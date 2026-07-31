import os
from typing import Annotated, TypedDict, Literal
from dotenv import load_dotenv

from langchain_core.messages import BaseMessage, AIMessage, SystemMessage
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

from sqlalchemy import text
from .database import SessionLocal
from .main import get_question_embedding

load_dotenv()

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    lecture_id: str
    context: str
    search_query: str
    is_relevant: bool

def evaluate_node(state: AgentState):
    """
    Evaluates if the question is relevant. If yes, generates a search query.
    If no, sets is_relevant to False and responds.
    """
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)
    
    sys_prompt = """You are a routing agent for an educational chatbot answering questions about a lecture.
Your STRICT goal is to ensure users only ask questions related to the lesson and its academic domain.
Read the user's latest question and the conversation history.
Determine if the user's question is:
1. RELEVANT: Clearly asking about the lecture, academic concepts, explanations, or follow-up questions to your previous answers.
2. IRRELEVANT: Small talk, outside the domain (e.g. weather, politics, unrelated topics), gibberish, or the question is too vague/unclear to understand what part of the lesson they mean.

Output EXACTLY in one of these two formats:
Format 1 (If relevant):
RELEVANT: <a highly optimized search query capturing the core concepts to search in a vector database>

Format 2 (If irrelevant or unclear):
IRRELEVANT: <a polite response in Vietnamese. If outside the domain, decline to answer and steer them back to the lesson. If unclear, ask them to clarify what part of the lecture they are referring to.>
"""
    
    # We pass the system prompt and the messages
    messages = [SystemMessage(content=sys_prompt)] + state["messages"]
    
    response = llm.invoke(messages)
    
    if isinstance(response.content, list):
        content = "".join([item.get("text", "") for item in response.content if isinstance(item, dict) and "text" in item])
    else:
        content = str(response.content)
        
    content = content.strip()
    
    if content.startswith("RELEVANT:"):
        query = content.replace("RELEVANT:", "").strip()
        return {"is_relevant": True, "search_query": query}
    else:
        # Default to irrelevant if parsing fails or if it explicitly says IRRELEVANT
        rejection_text = content.replace("IRRELEVANT:", "").strip()
        if not rejection_text:
            rejection_text = "Xin lỗi, mình chỉ có thể trả lời các câu hỏi liên quan đến bài học. Bạn có thể nói rõ hơn được không?"
            
        rejection_msg = AIMessage(content=rejection_text)
        return {"is_relevant": False, "messages": [rejection_msg]}

def retrieve_node(state: AgentState):
    """Retrieves context from pgvector based on search_query."""
    query = state["search_query"]
    lecture_id = state.get("lecture_id", "day01")
    
    # Embed query
    vector = get_question_embedding(query)
    
    # Search DB
    db = SessionLocal()
    try:
        sql = text("""
            SELECT chunk_text 
            FROM slide_embeddings se
            JOIN slides s ON s.id = se.slide_id
            WHERE s.lecture_id = :lecture_id
            ORDER BY se.embedding <=> CAST(:vector AS vector)
            LIMIT 5
        """)
        results = db.execute(sql, {
            "lecture_id": lecture_id,
            "vector": str(vector)
        }).fetchall()
        
        context_chunks = "\n---\n".join([r[0] for r in results])
        if not context_chunks:
            context_chunks = "Không tìm thấy thông tin liên quan trong bài giảng này."
        
        return {"context": context_chunks}
    finally:
        db.close()

def generate_node(state: AgentState):
    """Generates the final answer using retrieved context."""
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0.7)
    
    context = state.get("context", "")
    lecture_id = state.get("lecture_id", "day01")
    
    sys_prompt = f"""Bạn là VLearn Tutor, trợ lý AI giải đáp thắc mắc về bài giảng.
Bạn đang hỗ trợ học viên trong bài học {lecture_id}.

[CÁC ĐOẠN NỘI DUNG LIÊN QUAN TRONG BÀI GIẢNG]:
{context}

Nhiệm vụ của bạn:
1. CHỈ TRẢ LỜI các câu hỏi tập trung vào kiến thức của bài học và lĩnh vực chuyên môn.
2. KHÔNG ĐƯỢC trả lời những vấn đề không liên quan đến đề tài. Nếu học viên hỏi ngoài lề, hãy lịch sự từ chối và hướng họ quay lại với nội dung bài học.
3. Dựa vào các nội dung trên và lịch sử hội thoại, hãy trả lời ngắn gọn, súc tích, dễ hiểu. KHÔNG bịa đặt thông tin nếu không có trong ngữ cảnh.
4. Nếu câu hỏi không rõ ràng về bài giảng, hãy hỏi lại học viên để làm rõ ý và hướng họ về việc hỏi đáp kiến thức bài học.
"""
    
    messages = [SystemMessage(content=sys_prompt)] + state["messages"]
    
    response = llm.invoke(messages)
    return {"messages": [response]}

def route_after_evaluation(state: AgentState) -> Literal["retrieve", "__end__"]:
    if state.get("is_relevant", False):
        return "retrieve"
    return "__end__"

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("evaluate", evaluate_node)
workflow.add_node("retrieve", retrieve_node)
workflow.add_node("generate", generate_node)

workflow.add_edge(START, "evaluate")
workflow.add_conditional_edges("evaluate", route_after_evaluation)
workflow.add_edge("retrieve", "generate")
workflow.add_edge("generate", END)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)
