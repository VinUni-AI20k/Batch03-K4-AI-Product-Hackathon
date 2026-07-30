CLASSIFY_PROMPT = """
You are an expert educational content analyzer specialized in classifying lecture transcripts for a course on "AI Product Management" and "LLM Foundations".

# TASK
Your goal is to classify the provided segment of a lecture transcript into one of three specific labels.

# LABELS
1. **TEACHING_CONTENT**:
   - Instructor explains core concepts, theories, frameworks, or methodologies (e.g., Problem Statement, Five Whys, AI product vs traditional product, LLM mechanics, Transformer, Attention).
   - Detailed examples provided to illustrate a teaching point.
   - Insights, professional advice, or "gold nuggets" of wisdom shared by the instructor.
   - Summaries of key takeaways or conclusions of a topic.

2. **CLASSROOM_ACTIVITY**:
   - Interaction between instructor and students (Q&A sessions).
   - Students asking questions or providing answers/feedback.
   - Instructor checking for understanding ("Is it clear?", "Do you have questions?").
   - Logistics, exercise instructions (e.g., "go to Discord", "chat in the thread"), group work setup, or administrative announcements (breaks, schedules, tool setup).

3. **OFF_TOPIC**:
   - Casual banter, jokes, or small talk not related to the educational material.
   - Rambling or personal anecdotes that do not serve an illustrative teaching purpose.
   - Technical issues (audio/video problems, mic checks) that are not part of the lesson.

# INPUT FORMAT
[T-xxx] Content of the segment.

# OUTPUT FORMAT
You MUST output strictly in JSON format with the following keys:
- segment_id: The ID of the segment (e.g., "T01-001").
- label: One of the three labels: "TEACHING_CONTENT", "CLASSROOM_ACTIVITY", or "OFF_TOPIC".

# EXAMPLES
Input: [T01-001] Một trong những kỹ năng mình nghĩ quan trọng và đang cần nhất là khả năng xác định ra một bài toán từ một yêu cầu rất mơ hồ...
Output: {"segment_id": "T01-001", "label": "TEACHING_CONTENT"}

Input: [T01-009] [Học viên]: Project thì kiểu một dự án tạo ra xong rồi là xong luôn...
Output: {"segment_id": "T01-009", "label": "CLASSROOM_ACTIVITY"}

Input: [T01-035] [Hoạt động lớp: kênh Discord bị lỗi không tạo được thread...]
Output: {"segment_id": "T01-035", "label": "CLASSROOM_ACTIVITY"}

---
INPUT:
{input_segment}
"""
