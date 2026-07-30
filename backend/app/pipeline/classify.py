"""Classify cleaned transcript segments for the knowledge-preparation pipeline.

Run from ``backend``:
    python -m app.pipeline.classify --fallback

Use ``--llm`` only when GOOGLE_API_KEY and google-generativeai are configured.
"""

import argparse
import json
import re
from pathlib import Path

VALID_LABELS = {"TEACHING_CONTENT", "CLASSROOM_ACTIVITY", "OFF_TOPIC"}


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
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--llm", action="store_true", help="Use the configured Gemini client.")
    mode.add_argument("--fallback", action="store_true", help="Use deterministic offline labels.")
    args = parser.parse_args()

    segments = extract_segments(args.input)
    if not segments:
        raise ValueError(f"No transcript segments found in {args.input}")
    results = classify_with_llm(segments) if args.llm else classify_with_fallback(segments)
    write_results(results, args.output)
    print(f"Wrote {len(results)} classifications to {args.output}")


if __name__ == "__main__":
    main()
