"""Prompt builders for deep explanations (mindmap node or highlighted text) and
whole-document multiple-choice quizzes. These are independent LLM calls
(previously one combined explanation+exercise prompt in the Streamlit version)
-- product decision: quizzes are free-text-request-driven and persisted
per-request, not cached like node/highlight explanations.
"""

import hashlib
import json
import re
import uuid

from core import db
from core.llm_client import call_chat, call_llm

JARGON_INSTRUCTION = (
    "Any term or concept that would likely be unfamiliar given the learner's "
    "stated background must be annotated inline the moment it is used (e.g. a "
    "short inline gloss in parentheses) -- do not assume familiarity beyond what "
    "their background indicates. This applies uniformly, not just to hard concepts."
)


def _system_prompt(background):
    return f"You are an AI tutor. The learner's background:\n{background}\n\n{JARGON_INSTRUCTION}"


def _format_page_index(page_index):
    return "\n".join(f"- Page {p['page_number']}: {p['title']}" for p in page_index)


def build_explain_prompt(background, target_content, page_index, user_question=None):
    """Explanation only -- no exercise. Returns (system_prompt, user_prompt)."""
    system = _system_prompt(background)
    question_block = f'\nThe learner also specifically asked: "{user_question}"\n' if user_question else ""
    user = f"""Explain the following content to the learner, integrating their background, general knowledge, and this material. Cite [Page X] when referencing specific pages.

Content to explain:
{target_content}
{question_block}
All pages in this document (for cross-referencing):
{_format_page_index(page_index)}

After the explanation, list which OTHER pages (not already part of the content above) are most related to this content and why, one line each. Omit the section entirely if truly nothing else is related.

Format your response EXACTLY as:
## Explanation
...

## Related Pages
- Page X: <one-line reason>
"""
    return system, user


QUIZ_SYSTEM_TEMPLATE = """You are an AI tutor writing a multiple-choice quiz. The learner's background:
{background}

You produce ONLY valid JSON, no prose before or after, no markdown code fences."""


def build_quiz_prompt(background, full_content, user_request, num_questions):
    """Whole-document quiz -- returns (system_prompt, user_prompt). Unlike the
    other builders here this deliberately skips _system_prompt/JARGON_INSTRUCTION:
    quiz options must stay short and unambiguous, so inline jargon glosses (which
    make sense inline in an explanation) would just bloat/confuse the options."""
    system = QUIZ_SYSTEM_TEMPLATE.format(background=background)
    user = f"""The learner asked for practice questions covering this lecture, with this specific focus: "{user_request or 'toàn bộ nội dung bài giảng'}"

Full lecture content (all slides):
{full_content}

Write exactly {num_questions} multiple-choice questions testing understanding of this material, addressing their focus. Spread the questions across DIFFERENT parts/pages of the material rather than clustering on one slide. Each question needs exactly 4 options, exactly one correct. The 3 wrong options must be plausible distractors (common misconceptions or near-misses), not obviously wrong.

Return ONLY a JSON array (no other text) of exactly {num_questions} objects, each shaped exactly like:
{{"question": "...", "options": ["...", "...", "...", "..."], "correct_index": 0, "explanation": "...", "page_number": 12}}

- "options": exactly 4 strings, in Vietnamese.
- "correct_index": 0-based index (0-3) of the correct option in "options".
- "explanation": 2-4 sentences in Vietnamese, covering why the correct option is right AND briefly why each wrong option is wrong.
- "page_number": the page this question is drawn from.
"""
    return system, user


def _parse_explanation_and_related(raw_text):
    marker = "## Related Pages"
    idx = raw_text.find(marker)
    if idx == -1:
        return raw_text.strip(), []
    explanation = raw_text[:idx].strip()
    related_block = raw_text[idx + len(marker):].strip()
    related_pages = []
    for line in related_block.splitlines():
        line = line.strip().lstrip("-").strip()
        if not line:
            continue
        page_part, _, reason = line.partition(":")
        reason = reason.strip()
        # A line can legitimately name more than one page (e.g. "Page 23, 25: ...");
        # extract each number separately rather than joining all digits into one
        # (which previously corrupted "23, 25" into the single bogus page 2325).
        for num in re.findall(r"\d+", page_part):
            related_pages.append({"page_number": int(num), "reason": reason})
    return explanation, related_pages


def build_page_index(document_id):
    """Compact (page_number, short title) index of every page -- lets the model
    name cross-page references. No per-page title exists anywhere in the schema,
    so the short title is always a ~10-word truncation of content_text."""
    pages = db.get_pages(document_id)
    index = []
    for page_number, content_text in pages:
        words = content_text.split()
        short = " ".join(words[:10]) + ("..." if len(words) > 10 else "")
        index.append({"page_number": page_number, "title": short})
    return index


# --- Cheap cross-page search (no LLM call) for the chat/question flow -------
#
# Stuffing every other page's full text into the prompt just in case a
# question mentions a term defined elsewhere would be expensive and mostly
# wasted. Instead: plain-Python keyword search over the already-OCR'd/cached
# page text (core/ingest.py already stored it), returning only a handful of
# short, bolded snippets from the pages that actually matched -- costs zero
# LLM tokens to compute, and only a few hundred tokens to include.

_STOPWORDS = {
    # Vietnamese function words commonly found in questions
    "là", "gì", "có", "không", "được", "này", "đó", "nào", "sao", "thế", "và",
    "của", "cho", "với", "trong", "một", "các", "những", "để", "khi", "như",
    "về", "hãy", "cái", "làm", "sẽ", "đã", "đang", "tôi", "bạn", "mình",
    "chúng", "ta", "nó", "ai", "bao", "nhiêu", "vì", "nên", "nếu", "thì", "mà",
    "rồi", "đây", "kia", "trên", "dưới", "ra", "vào", "lên", "xuống", "sau",
    "trước", "còn", "cũng", "hay", "nữa", "phải", "bị", "vậy", "giải", "thích",
    # English, in case the question is typed in English
    "the", "is", "a", "an", "of", "to", "in", "on", "for", "and", "or", "what",
    "how", "why", "does", "do", "this", "that", "are", "was", "were", "be",
}


def _extract_keywords(text):
    words = re.findall(r"[^\W\d_]+", text.lower(), flags=re.UNICODE)
    seen = []
    for w in words:
        if len(w) >= 3 and w not in _STOPWORDS and w not in seen:
            seen.append(w)
    return seen


def find_related_snippets(document_id, query, exclude_page, max_pages=3, radius=80):
    """Rank other pages by keyword-hit count, return a short snippet (matched
    term bolded) per top page. Empty list if the query has no real keywords
    or nothing else in the document matches -- callers should treat that as
    "no cross-references available", not an error."""
    keywords = _extract_keywords(query)
    if not keywords:
        return []

    hits = []
    for page_number, content_text in db.get_pages(document_id):
        if page_number == exclude_page:
            continue
        lower_content = content_text.lower()
        count = sum(lower_content.count(k) for k in keywords)
        if count == 0:
            continue
        first_kw = next(k for k in keywords if k in lower_content)
        pos = lower_content.find(first_kw)
        start = max(0, pos - radius)
        end = min(len(content_text), pos + len(first_kw) + radius)
        snippet = (
            content_text[start:pos]
            + f"**{content_text[pos:pos + len(first_kw)]}**"
            + content_text[pos + len(first_kw):end]
        ).strip()
        hits.append((count, page_number, snippet))

    hits.sort(key=lambda h: h[0], reverse=True)
    return [{"page_number": p, "snippet": s} for _, p, s in hits[:max_pages]]


def _extract_inline_page_citations(raw_text, document_id):
    """Chat/question-mode replies aren't forced into a '## Related Pages'
    section -- instead the model is told to cite [Page X] inline only when
    relevant, and we recover the page chips for the UI from those citations."""
    page_numbers = sorted({int(n) for n in re.findall(r"\[Page (\d+)\]", raw_text)})
    if not page_numbers:
        return []
    all_pages = dict(db.get_pages(document_id))
    related = []
    for p in page_numbers:
        words = all_pages.get(p, "").split()
        short = " ".join(words[:10]) + ("..." if len(words) > 10 else "")
        related.append({"page_number": p, "reason": short})
    return related


CHAT_SYSTEM_TEMPLATE = """You are an AI tutor answering a student's question in a chat. The learner's background:
{background}

Rules for this chat:
- Answer ONLY using the lecture content given to you below (the current page, plus any excerpts from other pages). Do not pull in outside knowledge beyond what's needed to explain a term that already appears in this material.
- If the question is not related to this lecture's content, reply with exactly one short sentence saying it isn't covered in this material -- do not answer it anyway, and do not apologize at length.
- Be direct and concise: answer exactly what was asked. Do not describe or summarize the whole page unless that IS the question.
- Only cite other pages with [Page X] when the learner is asking about a specific term/concept that appears in the excerpts below. Otherwise, do not mention any page numbers at all.
- Do not use section headers (no "## Explanation", no "## Related Pages") -- answer in plain prose.

{jargon}"""


def build_chat_prompt(background, page_content, page_number, other_snippets, user_question):
    """Free-form chat question -- returns (system_prompt, user_prompt) for the
    CURRENT turn only. Prior turns are passed separately as real conversation
    messages (see explain_question) so they stay cheap and this injection
    doesn't get repeated for every turn."""
    system = CHAT_SYSTEM_TEMPLATE.format(background=background, jargon=JARGON_INSTRUCTION)

    snippet_block = ""
    if other_snippets:
        lines = "\n\n".join(f"[Page {s['page_number']}]: ...{s['snippet']}..." for s in other_snippets)
        snippet_block = (
            "\n\nPossibly relevant excerpts from OTHER pages "
            f"(only cite these if the question is about a term/concept they define):\n{lines}\n"
        )

    user = f"""Current page {page_number} content:
{page_content}
{snippet_block}
The learner's question: "{user_question}\""""
    return system, user


HIGHLIGHT_QUESTION_SYSTEM_TEMPLATE = """You are an AI tutor. The learner's background:
{background}

The learner highlighted a piece of text while asking a question. Their QUESTION is what you must answer -- treat the highlighted text and the page it's on as supporting context only, not the thing to explain end-to-end.
- Answer directly and concisely.
- You may cite other pages with [Page X] if genuinely relevant to the question.
- Do not use section headers (no "## Explanation", no "## Related Pages") -- plain prose.

{jargon}"""


def build_highlight_question_prompt(
    background, selected_text, page_content, page_number, other_snippets, user_question
):
    """Highlight + question -- the question is primary, the highlight is
    context. Contrast with build_explain_prompt, used when there's no
    question and the highlighted content itself is what's being explained."""
    system = HIGHLIGHT_QUESTION_SYSTEM_TEMPLATE.format(background=background, jargon=JARGON_INSTRUCTION)

    snippet_block = ""
    if other_snippets:
        lines = "\n\n".join(f"[Page {s['page_number']}]: ...{s['snippet']}..." for s in other_snippets)
        snippet_block = (
            "\n\nPossibly relevant excerpts from OTHER pages "
            f"(only cite these if the question is about a term/concept they define):\n{lines}\n"
        )

    user = f"""The learner's question: "{user_question}"

They highlighted this text on page {page_number} (context only, not necessarily what they're asking about):
"{selected_text}"

Full page {page_number} content (context only):
{page_content}
{snippet_block}"""
    return system, user


def _collect_descendant_page_refs(node):
    refs = list(node.get("page_refs", []))
    for child in node.get("children") or []:
        refs.extend(_collect_descendant_page_refs(child))
    seen = set()
    ordered = []
    for r in refs:
        if r not in seen:
            seen.add(r)
            ordered.append(r)
    return ordered


def explain_node(document_id, node, session_id, background, user_question=None):
    """A parent node's page_refs are the union of all its descendant leaves'
    page_refs, so the resulting explanation synthesizes across the whole branch
    rather than just describing that it has children."""
    cached = db.get_explanation(document_id, node["id"], session_id)
    if cached:
        explanation, related_json = cached
        return explanation, json.loads(related_json) if related_json else []

    page_refs = _collect_descendant_page_refs(node)
    all_pages = dict(db.get_pages(document_id))
    target_content = "\n\n".join(f"--- Page {p} ---\n{all_pages.get(p, '')}" for p in page_refs)
    page_index = build_page_index(document_id)

    system, user = build_explain_prompt(background, target_content, page_index, user_question)
    raw = call_llm(system, user, max_tokens=2048)
    explanation, related_pages = _parse_explanation_and_related(raw)
    # exercise_text column repurposed to hold related_pages_json -- see PHASE2_NOTES.md
    db.save_explanation(document_id, node["id"], session_id, explanation, json.dumps(related_pages))
    return explanation, related_pages


def explain_highlight(document_id, page_number, selected_text, session_id, background, user_question=None):
    """Two distinct prompts depending on whether a question came with the
    highlight:
    - question given -> the question is the primary thing to answer, the
      highlight is just supporting context; always fresh, never cached (the
      old cache key ignored user_question entirely, so a second question on
      the same highlighted text would have silently returned the FIRST
      answer -- caching only the no-question path below fixes that too).
    - no question -> the highlighted content itself is what's being
      explained; cached per (page, text, session) same as before.
    """
    all_pages = dict(db.get_pages(document_id))
    page_content = all_pages.get(page_number, "")

    if user_question:
        snippets = find_related_snippets(document_id, user_question, exclude_page=page_number)
        system, user = build_highlight_question_prompt(
            background, selected_text, page_content, page_number, snippets, user_question
        )
        raw = call_llm(system, user, max_tokens=1024)
        explanation = raw.strip()
        related_pages = _extract_inline_page_citations(explanation, document_id)
        return explanation, related_pages

    text_hash = hashlib.sha256(selected_text.encode("utf-8")).hexdigest()[:16]
    cached = db.get_highlight_explanation(document_id, page_number, text_hash, session_id)
    if cached:
        explanation, related_json = cached
        return explanation, json.loads(related_json) if related_json else []

    target_content = f'Highlighted text: "{selected_text}"\n\nFull page {page_number} content for context:\n{page_content}'
    page_index = build_page_index(document_id)

    system, user = build_explain_prompt(background, target_content, page_index, None)
    raw = call_llm(system, user, max_tokens=2048)
    explanation, related_pages = _parse_explanation_and_related(raw)
    db.save_highlight_explanation(
        document_id, page_number, text_hash, session_id, selected_text, explanation, json.dumps(related_pages)
    )
    return explanation, related_pages


def explain_question(document_id, page_number, background, user_question, chat_history=None):
    """Free-form chat question about the page currently in view -- no
    highlight required. Always fresh, never cached (same rationale as
    generate_exercise: the input varies too much per-call to key a cache on).

    chat_history: up to the last 3 prior {"question", "answer"} turns from
    this session, replayed as real conversation turns so follow-ups keep
    context. Only the CURRENT turn gets the page content + cross-page
    snippets injected, so older turns stay cheap instead of repeating that
    injection on every call.
    """
    all_pages = dict(db.get_pages(document_id))
    page_content = all_pages.get(page_number, "")
    snippets = find_related_snippets(document_id, user_question, exclude_page=page_number)

    system, user = build_chat_prompt(background, page_content, page_number, snippets, user_question)

    messages = []
    for turn in (chat_history or [])[-3:]:
        messages.append({"role": "user", "content": turn["question"]})
        messages.append({"role": "assistant", "content": turn["answer"]})
    messages.append({"role": "user", "content": user})

    raw = call_chat(system, messages, max_tokens=1024)
    explanation = raw.strip()
    related_pages = _extract_inline_page_citations(explanation, document_id)
    return explanation, related_pages


def _parse_quiz_json(raw_text):
    text = raw_text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    start = text.find("[")
    end = text.rfind("]")
    questions = json.loads(text[start:end + 1])
    for q in questions:
        if len(q.get("options", [])) != 4 or not isinstance(q.get("correct_index"), int):
            raise ValueError(f"Malformed quiz question from model: {q!r}")
    return questions


def generate_quiz(document_id, session_id, user_request, background, num_questions=5):
    """Whole-document multiple-choice quiz -- always generates fresh (no cache,
    same rationale as the old per-page exercise: the request text is free-form).
    Persisted to the quizzes table for later eval/reference, but nothing reads
    it back today -- grading happens client-side since correct_index +
    explanation are already in the response."""
    pages = db.get_pages(document_id)
    full_content = "\n\n".join(f"--- Page {p} ---\n{c}" for p, c in pages)

    system, user = build_quiz_prompt(background, full_content, user_request, num_questions)
    raw = call_llm(system, user, max_tokens=4096)
    questions = _parse_quiz_json(raw)

    quiz_id = str(uuid.uuid4())
    db.create_quiz(quiz_id, document_id, session_id, user_request, json.dumps(questions))
    return quiz_id, questions
