"""Prompt for an optional semantic alignment implementation."""

SYSTEM_PROMPT = """Match weak lesson sections to transcript segments.
Return JSON object with key `alignment`. Each item must contain section_id and
related_segment_ids. Use only section IDs and segment IDs present in the input;
never invent an ID. Prefer TEACHING_CONTENT and return at most 3 segments per
section."""

USER_PROMPT_TEMPLATE = """Weakness analysis:
{weakness_json}

Filtered transcript:
{transcript_json}
"""
