"""
debate_agent.py
----------------
LangGraph agent sinh 1 LƯỢT PHÁT BIỂU của 1 "nhân vật" trong buổi thảo luận
nhóm (debate mode) quanh chủ đề người dùng đặt ra trong chat.

Không giống các agent khác (quiz/slide/animation/mindmap) vốn sinh 1 JSON có
cấu trúc, agent này sinh 1 đoạn hội thoại tự do (plain text) ngắn, và KHÔNG
lưu state giữa các lượt ở backend: FE giữ toàn bộ transcript và gửi lại
nguyên vẹn trong mỗi request (DebateTurnRequest.history) — nhờ vậy người
dùng có thể chen tin nhắn mới vào transcript giữa các lượt agent (human-in-
the-loop) mà không cần backend quản lý session.

Luồng: parse_input -> generate_turn -> format_output -> END
"""

import logging
import os

from langgraph.graph import StateGraph, END
from app.state import BaseAgentState
from app.schemas import DebateTurnRequest, DebateTurnResponse

logger = logging.getLogger("debate-agent")


PERSONAS = {
    "curious_mind": {
        "name": "Curious Mind",
        "avatar": "🙂",
        "role": "một học viên tò mò, luôn thích hỏi tại sao và như thế nào",
        "instruction": (
            "Đặt 1 câu hỏi tò mò hoặc nêu thắc mắc ngắn gọn ĐÀO SÂU thêm 1 khía cạnh CỤ THỂ "
            "của chủ đề (không phải câu hỏi chung chung kiểu 'tại sao nó quan trọng') — nếu đã "
            "có người hỏi/trả lời ý đó rồi thì hỏi sang 1 khía cạnh khác của cùng chủ đề."
        ),
    },
    "logic_master": {
        "name": "Logic Master",
        "avatar": "🤓",
        "role": "một học viên tư duy logic, thích giải quyết vấn đề theo từng bước",
        "instruction": (
            "Phân tích ngắn gọn theo hướng logic/từng bước MỘT chi tiết cụ thể vừa được nhắc "
            "tới trong chủ đề, có thể phản biện hoặc bổ sung cho ý vừa nêu ở lượt trước, nhưng "
            "phải đưa thêm thông tin mới thay vì diễn giải lại."
        ),
    },
    "bright_spark": {
        "name": "Bright Spark",
        "avatar": "✨",
        "role": "một học viên thích thử nghiệm, học qua thực hành",
        "instruction": (
            "Đề xuất 1 cách thử nghiệm/ví dụ thực tế CỤ THỂ minh hoạ đúng chủ đề (không dùng ví "
            "dụ chung chung), hoặc kể lại 1 trải nghiệm thử tương tự gắn với chi tiết vừa được "
            "nhắc tới trong hội thoại."
        ),
    },
    "note_taker": {
        "name": "Note Taker",
        "avatar": "📝",
        "role": "người ghi chú, chuyên tóm tắt lại các ý chính đã được thảo luận",
        "instruction": (
            "Tóm tắt ngắn gọn dưới dạng 2-3 gạch đầu dòng các ý CHÍNH đã thực sự được nhắc tới "
            "trong đoạn hội thoại phía trên (không bịa thêm ý mới), và nếu thấy hội thoại đang "
            "lan man sang thứ không liên quan tới chủ đề gốc thì chỉ rõ ý nào đã lệch hướng để "
            "kéo cả nhóm quay lại đúng trọng tâm."
        ),
    },
    "ai_teacher": {
        "name": "AI Teacher",
        "avatar": "🧑‍🏫",
        "role": "giáo viên AI điều phối buổi thảo luận",
        "instruction": (
            "Đưa ra 1 đoạn tổng kết ngắn gọn chốt lại TOÀN BỘ buổi thảo luận (không chỉ lượt "
            "gần nhất), liên hệ lại đúng chủ đề ban đầu, nêu 1-2 điểm quan trọng nhất cả nhóm đã "
            "rút ra được, và khuyến khích học viên áp dụng vào bài tiếp theo."
        ),
    },
}

# System prompt dùng chung cho MỌI persona: đây là nơi khoá cứng yêu cầu quan
# trọng nhất - luôn bám sát đúng 1 chủ đề duy nhất, không tự trôi dạt sang chủ
# đề khác dù transcript có dài và nhiều lượt. Tách riêng thành system message
# (thay vì gộp vào user message như các agent khác) để mô hình ưu tiên tuân
# theo ràng buộc này xuyên suốt, kể cả khi buổi thảo luận kéo dài liên tục.
DEBATE_SYSTEM_PROMPT = """Bạn đang mô phỏng MỘT thành viên trong một buổi thảo luận nhóm học tập
bằng tiếng Việt. Buổi thảo luận có thể kéo dài rất nhiều lượt liên tục cho tới khi người dùng
chủ động kết thúc.

RÀNG BUỘC QUAN TRỌNG NHẤT (không được vi phạm dù hội thoại đã dài bao nhiêu lượt):
1. CHỈ ĐƯỢC bàn về ĐÚNG một chủ đề gốc được cung cấp trong mỗi lượt gọi — không tự chuyển
   sang chủ đề khác, không lạc đề, không nói chuyện phiếm ngoài lề.
2. Nếu bạn nhận thấy các lượt phát biểu gần nhất trong transcript đang bắt đầu lan man/lệch khỏi
   chủ đề gốc, NHIỆM VỤ của bạn là chủ động kéo cuộc trò chuyện quay lại đúng trọng tâm chủ đề
   đó (nhắc lại từ khoá của chủ đề), thay vì tiếp tục đà lệch hướng.
3. Nếu người dùng (role "user" trong transcript) vừa chen ngang bằng 1 câu hỏi/tin nhắn mới,
   PHẢI ưu tiên phản hồi thẳng vào đúng nội dung người dùng vừa hỏi trước, rồi mới nối lại mạch
   thảo luận, nhưng vẫn phải giữ đúng chủ đề gốc.
4. KHÔNG lặp lại nguyên văn hoặc diễn giải lại ý người khác đã nói — mỗi lượt phải có thông tin/
   góc nhìn/chi tiết MỚI, cụ thể, gắn chặt với chủ đề.
5. Chỉ trả về đúng nội dung lời thoại của lượt phát biểu này, tiếng Việt tự nhiên như đang chat,
   không xưng "tôi là...", không markdown, không giải thích thêm, không đặt trong dấu ngoặc kép.
"""


def parse_input(state: BaseAgentState) -> BaseAgentState:
    request: DebateTurnRequest = state["input_block"]
    lines = [f"{m.speaker_name}: {m.text}" for m in request.history]
    state["parsed_context"] = "\n".join(lines)
    return state


def _build_prompt(persona_id: str, topic: str, transcript_text: str) -> str:
    persona = PERSONAS[persona_id]
    transcript_block = transcript_text or "(chưa có ai phát biểu, đây là lượt mở đầu buổi thảo luận)"
    return f"""Bạn đang đóng vai {persona['name']} — {persona['role']}.

CHỦ ĐỀ GỐC DUY NHẤT CỦA BUỔI THẢO LUẬN NÀY (mọi lượt, kể cả lượt thứ 20, vẫn phải xoay quanh
đúng chủ đề này):
{topic}

DIỄN BIẾN HỘI THOẠI CHO TỚI THỜI ĐIỂM NÀY (mỗi dòng là 1 lượt phát biểu, theo đúng thứ tự;
dòng có role "user" là tin nhắn/câu hỏi thật của người dùng, cần được ưu tiên phản hồi nếu là
lượt gần nhất):
{transcript_block}

YÊU CẦU RIÊNG CHO LƯỢT PHÁT BIỂU CỦA BẠN:
{persona['instruction']}

Trước khi trả lời, tự kiểm tra: nội dung bạn sắp nói có thực sự nói về đúng "{topic}" không,
hay đang trôi sang chuyện khác? Nếu đang trôi dạt, hãy kéo lại đúng chủ đề trước khi phát biểu.
"""


def _call_llm(persona_id: str, topic: str, transcript_text: str) -> str | None:
    api_key = os.getenv("API_KEY", "")
    if not api_key:
        logger.warning("Không có API_KEY -> bỏ qua gọi LLM, dùng fallback cho debate")
        return None

    try:
        from openai import OpenAI

        client_kwargs = {"api_key": api_key}
        base_url = os.getenv("BASE_URL", "")
        if base_url:
            client_kwargs["base_url"] = base_url
        client = OpenAI(**client_kwargs)

        completion = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "") or "gpt-4o-mini",
            messages=[
                {"role": "system", "content": DEBATE_SYSTEM_PROMPT},
                {"role": "user", "content": _build_prompt(persona_id, topic, transcript_text)},
            ],
            temperature=0.6,
        )
        return completion.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Lỗi khi gọi LLM sinh lượt debate ({persona_id}): {e}", exc_info=True)
        return None


def _fallback_draft(persona_id: str, topic: str, transcript_text: str) -> str:
    """Không gọi được LLM: dùng câu mẫu cố định, có chèn chủ đề/ý gần nhất."""
    last_line = transcript_text.strip().splitlines()[-1] if transcript_text.strip() else topic

    fallbacks = {
        "curious_mind": f'Mình tò mò là tại sao "{topic}" lại quan trọng trong bài học này nhỉ?',
        "logic_master": f'Theo mình hiểu, "{topic}" sẽ dễ nắm hơn nếu chia nhỏ thành từng bước cụ thể.',
        "bright_spark": f'Để mình thử nghĩ ra 1 ví dụ thực tế liên quan tới "{topic}" xem sao!',
        "note_taker": (
            "Tóm tắt nhanh những gì vừa trao đổi:\n"
            f"- Chủ đề đang bàn: {topic}\n"
            f"- Ý gần nhất: {last_line[:120]}"
        ),
        "ai_teacher": (
            f'Cảm ơn cả lớp đã thảo luận sôi nổi về "{topic}"! '
            "Đây là một điểm quan trọng của bài học — các bạn hãy thử áp dụng vào bài tập tiếp theo nhé."
        ),
    }
    return fallbacks.get(persona_id, f'Mình thấy "{topic}" khá thú vị.')


def generate_turn(state: BaseAgentState) -> BaseAgentState:
    request: DebateTurnRequest = state["input_block"]
    transcript_text = state.get("parsed_context") or ""
    text = _call_llm(request.next_speaker, request.topic, transcript_text)
    state["draft_output"] = text or _fallback_draft(request.next_speaker, request.topic, transcript_text)
    return state


def format_output(state: BaseAgentState) -> BaseAgentState:
    request: DebateTurnRequest = state["input_block"]
    persona = PERSONAS[request.next_speaker]
    output = DebateTurnResponse(
        speaker_id=request.next_speaker,
        speaker_name=persona["name"],
        avatar=persona["avatar"],
        text=state["draft_output"],
    )
    state["final_output"] = output
    return state


def build_debate_graph():
    graph = StateGraph(BaseAgentState)
    graph.add_node("parse_input", parse_input)
    graph.add_node("generate_turn", generate_turn)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_input")
    graph.add_edge("parse_input", "generate_turn")
    graph.add_edge("generate_turn", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()


debate_graph = build_debate_graph()


def run_debate_agent(request: DebateTurnRequest) -> DebateTurnResponse:
    initial_state: BaseAgentState = {"raw_content": request.topic, "input_block": request}
    result_state = debate_graph.invoke(initial_state)
    return result_state["final_output"]
