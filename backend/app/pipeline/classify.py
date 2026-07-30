"""Classify cleaned transcript segments for the knowledge-preparation pipeline.

Run from ``backend``:
    python -m app.pipeline.classify --fallback

Use ``--llm`` only when GOOGLE_API_KEY and google-generativeai are configured.
"""

import argparse
from collections import Counter
import json
import re
import unicodedata
from pathlib import Path

VALID_LABELS = {"TEACHING_CONTENT", "CLASSROOM_ACTIVITY", "OFF_TOPIC"}
DAY_PATTERN = re.compile(r"\bday\s*(\d+)\b", re.IGNORECASE)
WORD_PATTERN = re.compile(r"[a-z0-9]{3,}")
STOP_WORDS = {
    "bai", "ban", "buoi", "cach", "cho", "cua", "day", "giang", "hoc",
    "noi", "phan", "sach", "the", "transcript", "ve", "voi", "va",
}


def normalize_words(text: str) -> Counter[str]:
    """Return accent-insensitive Vietnamese/English topic terms."""
    normalized = "".join(
        char for char in unicodedata.normalize("NFD", text.casefold())
        if unicodedata.category(char) != "Mn"
    ).replace("đ", "d")
    return Counter(word for word in WORD_PATTERN.findall(normalized) if word not in STOP_WORDS)


def title_slug(title: str) -> str:
    """Create a stable ASCII filename suffix from a transcript title."""
    topic = re.sub(r"^transcript\s+bài\s+giảng\s*\(bản\s+sạch\)\s*[—-]\s*", "", title, flags=re.IGNORECASE)
    topic = DAY_PATTERN.sub("", topic)
    normalized = "".join(
        char for char in unicodedata.normalize("NFD", topic.casefold())
        if unicodedata.category(char) != "Mn"
    ).replace("đ", "d")
    slug = re.sub(r"[^a-z0-9]+", "-", normalized).strip("-")
    return slug[:100].rstrip("-") or "untitled"


def transcript_metadata(path: Path) -> dict[str, object]:
    """Read a transcript title and any explicit ``Day X`` stated in that title."""
    content = path.read_text(encoding="utf-8")
    title = next((line[2:].strip() for line in content.splitlines() if line.startswith("# ")), "")
    explicit_match = DAY_PATTERN.search(title)
    title_terms = normalize_words(title)
    body_terms = normalize_words(content[:12000])
    return {
        "path": path,
        "title": title,
        "explicit_day": explicit_match.group(1) if explicit_match else None,
        "title_terms": title_terms,
        "body_terms": body_terms,
    }


def cosine_similarity(left: Counter[str], right: Counter[str]) -> float:
    shared = set(left) & set(right)
    dot_product = sum(left[word] * right[word] for word in shared)
    left_size = sum(value * value for value in left.values()) ** 0.5
    right_size = sum(value * value for value in right.values()) ** 0.5
    return dot_product / (left_size * right_size) if left_size and right_size else 0.0


def resolve_course_days(paths: list[Path]) -> list[dict[str, object]]:
    """Resolve days from titles, then infer missing days from topic similarity.

    A transcript without ``Day X`` is never mapped from its filename. It must
    match a topic profile built from transcripts that explicitly state a day.
    """
    metadata = [transcript_metadata(path) for path in paths]
    title_profiles: dict[str, Counter[str]] = {}
    body_profiles: dict[str, Counter[str]] = {}
    for item in metadata:
        if day := item["explicit_day"]:
            title_profiles.setdefault(day, Counter()).update(item["title_terms"])
            body_profiles.setdefault(day, Counter()).update(item["body_terms"])
            item["course_day"] = day
            item["day_source"] = "explicit_title"

    if not title_profiles:
        raise ValueError("No transcript title contains an explicit 'Day X' marker")

    for item in metadata:
        if item.get("course_day"):
            continue
        scores = {
            # The title identifies the lesson topic; body text is corroboration
            # only, since long transcripts otherwise dominate this comparison.
            day: 0.8 * cosine_similarity(item["title_terms"], title_profile)
            + 0.2 * cosine_similarity(item["body_terms"], body_profiles[day])
            for day, title_profile in title_profiles.items()
        }
        ranked = sorted(scores.items(), key=lambda pair: pair[1], reverse=True)
        best_day, best_score = ranked[0]
        runner_up = ranked[1][1] if len(ranked) > 1 else 0.0
        if best_score < 0.05 or best_score - runner_up < 0.01:
            raise ValueError(
                f"Could not infer course day confidently for {item['path'].name}; "
                "add an explicit Day X to its title."
            )
        item["course_day"] = best_day
        item["day_source"] = "topic_similarity"
        item["day_confidence"] = round(best_score, 4)
    return metadata


def extract_segments(file_path: str | Path) -> list[dict[str, str]]:
    """Extract every ``[Txx-NNN]`` segment, including Markdown-bold IDs."""
    content = Path(file_path).read_text(encoding="utf-8")
    pattern = re.compile(
        r"^\s*(?:\*\*)?\[(T\d{2}-\d{3})\](?:\*\*)?\s*(.*?)(?=^\s*(?:\*\*)?\[T\d{2}-\d{3}\](?:\*\*)?|\Z)",
        re.DOTALL | re.MULTILINE,
    )
    return [
        {"segment_id": segment_id, "text": text.strip()}
        for segment_id, text in pattern.findall(content)
    ]


def fallback_label(segment: dict[str, str]) -> str:
    """Conservative offline fallback for a reproducible demo.

    The cleaned transcript already explicitly marks learner turns and classroom
    activities. All remaining segments are retained as teaching content, which
    avoids accidentally discarding lesson material when an LLM is unavailable.
    """
    text = segment["text"].casefold()
    if "[học viên]:" in text or "[hoạt động lớp:" in text:
        return "CLASSROOM_ACTIVITY"
    return "TEACHING_CONTENT"


def classify_with_fallback(segments: list[dict[str, str]]) -> list[dict[str, str]]:
    return [
        {"segment_id": segment["segment_id"], "label": fallback_label(segment)}
        for segment in segments
    ]


def classify_with_llm(segments: list[dict[str, str]]) -> list[dict[str, str]]:
    """Classify with Gemini and reject malformed or mismatched model output."""
    from app.core.llm_client import llm_client
    from app.prompts.classify_prompt import CLASSIFY_PROMPT

    results = []
    for segment in segments:
        prompt = CLASSIFY_PROMPT.format(
            input_segment=f"[{segment['segment_id']}] {segment['text']}"
        )
        response_text = llm_client.generate_text(prompt)
        match = re.search(r"\{.*?\}", response_text, re.DOTALL)
        if not match:
            raise ValueError(f"No JSON returned for {segment['segment_id']}")
        result = json.loads(match.group())
        if result.get("segment_id") != segment["segment_id"]:
            raise ValueError(f"Mismatched segment_id returned for {segment['segment_id']}")
        if result.get("label") not in VALID_LABELS:
            raise ValueError(f"Invalid label returned for {segment['segment_id']}")
        results.append({"segment_id": result["segment_id"], "label": result["label"]})
    return results


def write_results(results: list[dict[str, str]], output_path: str | Path) -> None:
    if not results:
        raise ValueError("Refusing to write an empty classification result")
    target = Path(output_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def classify_transcript_file(
    input_path: Path, output_path: Path, use_llm: bool
) -> list[dict[str, str]]:
    segments = extract_segments(input_path)
    if not segments:
        raise ValueError(f"No transcript segments found in {input_path}")
    results = classify_with_llm(segments) if use_llm else classify_with_fallback(segments)
    write_results(results, output_path)
    return results


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--input",
        default="../data/vlearn-pack/transcript/transcript-01-clean.md",
        help="Path relative to the backend directory.",
    )
    parser.add_argument(
        "--output",
        default="clean-data/fallback_responses/classify.json",
        help="Path relative to the backend directory.",
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Classify all transcripts into their actual course-day directories.",
    )
    parser.add_argument(
        "--output-dir",
        default="clean-data/fallback_responses/classify",
        help="Base directory for day-01/transcript-04.json, etc., when using --all.",
    )
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--llm", action="store_true", help="Use the configured Gemini client.")
    mode.add_argument("--fallback", action="store_true", help="Use deterministic offline labels.")
    args = parser.parse_args()

    if args.all:
        input_dir = Path(args.input).parent
        transcript_paths = sorted(input_dir.glob("transcript-*-clean.md"))
        if not transcript_paths:
            raise ValueError(f"No cleaned transcripts found in {input_dir}")
        resolved_transcripts = resolve_course_days(transcript_paths)
        all_results = []
        manifest = []
        for item in resolved_transcripts:
            transcript_path = item["path"]
            transcript_number = re.search(
                r"transcript-(\d{2})-clean", transcript_path.name
            ).group(1)
            course_day = str(item["course_day"]).zfill(2)
            output_name = f"transcript-{transcript_number}-{title_slug(item['title'])}.json"
            day_output = (
                Path(args.output_dir)
                / f"day-{course_day}"
                / output_name
            )
            results = classify_transcript_file(transcript_path, day_output, args.llm)
            all_results.extend(results)
            manifest.append(
                {
                    "transcript": transcript_path.name,
                    "title": item["title"],
                    "course_day": course_day,
                    "day_source": item["day_source"],
                    "classification_file": str(day_output).replace("\\", "/"),
                    **(
                        {"day_confidence": item["day_confidence"]}
                        if "day_confidence" in item
                        else {}
                    ),
                }
            )
            print(f"Wrote {len(results)} classifications to {day_output}")
        write_results(all_results, args.output)
        manifest_path = Path(args.output_dir) / "day-resolution.json"
        manifest_path.parent.mkdir(parents=True, exist_ok=True)
        manifest_path.write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Wrote {len(all_results)} ordered classifications to {args.output}")
        print(f"Wrote day resolution metadata to {manifest_path}")
    else:
        results = classify_transcript_file(Path(args.input), Path(args.output), args.llm)
        print(f"Wrote {len(results)} classifications to {args.output}")


if __name__ == "__main__":
    main()
