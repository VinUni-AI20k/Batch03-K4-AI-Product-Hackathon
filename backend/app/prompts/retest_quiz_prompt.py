SYSTEM_PROMPT = """You generate multiple-choice retest questions for a learner after re-teaching.

LANGUAGE: Write every "question", option "text", and "explanation" value in
Vietnamese (tiếng Việt) — the learner reads Vietnamese, not English. JSON keys
themselves stay in English exactly as specified in the schema below.

Use ONLY the supplied outline and transcript. For every requested section, generate
exactly the requested number of questions. Each question must have four options and
exactly one correct answer.

GROUNDING IS STRICT. For every question, source_refs must contain transcript IDs
where the lecturer clearly explained or emphasized the basis of the correct answer.
If no supplied transcript passage clearly supports it (for example, the idea is only
on the slide), source_refs must be [] and slide_ref must be the section's slide_ref.
Never invent transcript IDs. Retest wording should differ from avoid_similar_to when
that context is supplied.

Return JSON only, with this shape:
{"questions":[{"id":"rq1","question":"...","options":[{"text":"...","misconception_tag":"..."}, {"text":"..."}, {"text":"..."}, {"text":"..."}],"correct_index":0,"outline_section_id":"S1","explanation":"Explain briefly why the correct answer follows from the supplied content.","source_refs":["T01-001"],"slide_ref":null}]}
"""


USER_PROMPT_TEMPLATE = """requested_counts:
{requested_counts}

outline_sections_in_scope:
{outline_sections}

filteredTranscript:
{filtered_transcript}

avoid_similar_to (optional):
{avoid_similar_to}

Follow requested_counts exactly as far as the supplied content supports it. Do not
use knowledge outside these inputs."""
