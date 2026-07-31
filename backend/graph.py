import os
from typing import Annotated, TypedDict, Literal
from dotenv import load_dotenv

from langchain_core.messages import BaseMessage, AIMessage, SystemMessage
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver

import requests
import json

class CustomFPTChat:
    def __init__(self, temperature=0):
        self.token = "sk-H_YuLOl4y2dueOyIMJUFcq4X0FFF8MZg4-5u1QHlswQ="
        self.url = "https://mkp-api.fptcloud.com/chat/completions"
        self.model = "GLM-5.2"
        self.temperature = temperature

    def invoke(self, messages):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.token}"
        }
        
        formatted_msgs = []
        for msg in messages:
            role = "user"
            if msg.type == "system":
                role = "system"
            elif msg.type == "ai":
                role = "assistant"
            formatted_msgs.append({"role": role, "content": msg.content})
            
        data = {
            "model": self.model,
            "messages": formatted_msgs,
            "stream": False,
            "temperature": self.temperature
        }
        
        response = requests.post(self.url, headers=headers, json=data)
        if not response.ok:
            raise Exception(f"FPT API Error: {response.text}")
            
        answer = response.json()["choices"][0]["message"]["content"]
        return AIMessage(content=answer)

from sqlalchemy import text
from .database import SessionLocal

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
    llm = CustomFPTChat(temperature=0)
    
    lecture_id = state.get("lecture_id", "day01")
    sys_prompt = f"""You are a routing agent for an educational chatbot answering questions about a lecture.
The current lecture the user is learning is: {lecture_id}.
Your STRICT goal is to ensure users only ask questions related to the lesson and its academic domain.
Read the user's latest question and the conversation history.
Determine if the user's question is:
1. RELEVANT: Asking about the lecture, academic concepts, explanations, follow-up questions, or asking to summarize information/lesson/this. ASSUME ALL VAGUE REQUESTS FOR SUMMARIES OR HELP ARE RELEVANT TO THE CURRENT LECTURE ({lecture_id}).
2. IRRELEVANT: ONLY use this for CLEARLY out-of-domain topics (weather, politics, sports) or pure gibberish.

Output EXACTLY in one of these two formats:
Format 1 (If relevant):
RELEVANT: <a highly optimized search query capturing the core concepts to search in a vector database>
(If they ask for a general summary, output: RELEVANT: tổng quát nội dung bài giảng {lecture_id})

Format 2 (If irrelevant):
IRRELEVANT: <a polite response in Vietnamese declining to answer out-of-domain topics.>
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
    from .main import get_question_embedding
    
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

def route_after_evaluation(state: AgentState) -> Literal["retrieve", "__end__"]:
    if state.get("is_relevant", False):
        return "retrieve"
    return "__end__"

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("evaluate", evaluate_node)
workflow.add_node("retrieve", retrieve_node)

workflow.add_edge(START, "evaluate")
workflow.add_conditional_edges("evaluate", route_after_evaluation)
workflow.add_edge("retrieve", END)

memory = MemorySaver()
app = workflow.compile(checkpointer=memory)
