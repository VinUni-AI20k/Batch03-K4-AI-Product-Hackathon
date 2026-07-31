from __future__ import annotations

import csv
import hashlib
import json
import os
import re
import time
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, ValidationError, model_validator


ROOT = Path(__file__).resolve().parents[1]
GOLDEN_PATH = ROOT / "eval" / "golden_set.json"
PROMPT_ROOT = ROOT / "codebase" / "prompts"
DEFAULT_MODEL = "gemini-3.1-flash-lite"
SEGMENT_RE = re.compile(r"^\*\*\[(T\d{2}-\d{3})\]\*\*\s*(.*)$")
WORD_RE = re.compile(r"\b\w+\b", re.UNICODE)


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class RecapItem(StrictModel):
    claim: str
    citations: list[str]


class BridgeItem(StrictModel):
    from_concept: str
    to_concept: str
    explanation: str
    source_citations: list[str]
    target_citations: list[str]


class BridgeOutput(StrictModel):
    status: Literal["ok", "insufficient_context", "low_overlap"]
    recap: list[RecapItem] = Field(default_factory=list)
    bridges: list[BridgeItem] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class SourceSpec(StrictModel):
    segment_ids: list[str] = Field(default_factory=list)
    inline_segments: dict[str, str] = Field(default_factory=dict)


class GoldenCase(StrictModel):
    id: str = Field(pattern=r"^[a-z0-9_]+$")
    version: str
    cohort: Literal["normal", "hard", "rare"]
    hard_class: Literal["source_truth", "missing_ambiguous", "out_of_scope", "domain_specific"] | None
    title: str
    chat_refs: list[str]
    minimal_excerpt: str = Field(max_length=180)
    previous: SourceSpec
    current: SourceSpec
    expected_status: Literal["ok", "insufficient_context", "low_overlap"]
    forbidden_phrases: list[str]
    reviewer_set: bool

    @model_validator(mode="after")
    def validate_hard_class(self) -> "GoldenCase":
        if (self.cohort == "hard") != (self.hard_class is not None):
            raise ValueError("hard_class chỉ được dùng và bắt buộc cho hard case")
        return self


class ResolvedCase(StrictModel):
    case: GoldenCase
    previous: dict[str, str]
    current: dict[str, str]


class EvalError(RuntimeError):
    pass


def load_golden(path: Path = GOLDEN_PATH) -> list[GoldenCase]:
    if not path.exists():
        raise EvalError(f"Thiếu golden set: {path}")
    return TypeAdapter(list[GoldenCase]).validate_json(path.read_text(encoding="utf-8"))


class Resolver:
    def __init__(self, root: Path = ROOT) -> None:
        self.root = root
        self.data_root = root / "data" / "vlearn-pack"
        self._segments: dict[str, str] | None = None
        self._chat_refs: set[str] | None = None

    def segments(self) -> dict[str, str]:
        if self._segments is not None:
            return self._segments
        paths = sorted((self.data_root / "transcript").glob("transcript-*-clean.md"))
        if not paths:
            raise EvalError(f"Thiếu transcript tại {self.data_root / 'transcript'}")
        result: dict[str, str] = {}
        for path in paths:
            current: str | None = None
            buffer: list[str] = []
            for line in path.read_text(encoding="utf-8").splitlines():
                match = SEGMENT_RE.match(line)
                if match:
                    if current:
                        result[current] = " ".join(buffer).strip()
                    current, buffer = match.group(1), [match.group(2)]
                elif current and line.strip() and not line.startswith("##"):
                    buffer.append(line.strip())
            if current:
                result[current] = " ".join(buffer).strip()
        self._segments = result
        return result

    def chat_refs(self) -> set[str]:
        if self._chat_refs is not None:
            return self._chat_refs
        path = self.data_root / "chatlog" / "chat_history_anonymized_for_hackathon.csv"
        if not path.exists():
            raise EvalError(f"Thiếu chatlog: {path}")
        refs: set[str] = set()
        with path.open(encoding="utf-8", newline="") as handle:
            for row in csv.DictReader(handle):
                refs.add(row["conversation_id"])
                refs.add(f'{row["conversation_id"]}/{row["turn_id"]}')
        self._chat_refs = refs
        return refs

    def source(self, spec: SourceSpec) -> dict[str, str]:
        result = dict(spec.inline_segments)
        corpus = self.segments()
        missing = [item for item in spec.segment_ids if item not in corpus]
        if missing:
            raise EvalError(f"Không resolve được segment {missing}")
        result.update({item: corpus[item] for item in spec.segment_ids})
        return result

    def case(self, case: GoldenCase) -> ResolvedCase:
        missing = [item for item in case.chat_refs if item not in self.chat_refs()]
        if missing:
            raise EvalError(f"Chat ref không tồn tại: {missing}")
        return ResolvedCase(case=case, previous=self.source(case.previous), current=self.source(case.current))


def load_prompts(version: str) -> dict[str, str]:
    directory = PROMPT_ROOT / "versions" / version
    result: dict[str, str] = {}
    for name in ("system_prompt.md", "recap_prompt.md", "bridge_prompt.md"):
        path = directory / name
        if not path.exists():
            raise EvalError(f"Thiếu prompt: {path}")
        result[name] = path.read_text(encoding="utf-8")
    return result


def hashes(prompts: dict[str, str]) -> dict[str, str]:
    return {name: hashlib.sha256(value.encode()).hexdigest() for name, value in prompts.items()}


def format_source(source: dict[str, str]) -> str:
    return "\n".join(f"[{key}] {value}" for key, value in source.items())


def gemini_schema(model: type[BaseModel]) -> dict[str, object]:
    """Return the Pydantic schema subset accepted by Gemini generateContent."""
    schema = model.model_json_schema()

    def strip_unsupported(value: object) -> object:
        if isinstance(value, dict):
            return {
                key: strip_unsupported(item)
                for key, item in value.items()
                if key != "additionalProperties"
            }
        if isinstance(value, list):
            return [strip_unsupported(item) for item in value]
        return value

    return strip_unsupported(schema)


def word_count(output: BridgeOutput) -> int:
    text = [*output.warnings, *(item.claim for item in output.recap)]
    for item in output.bridges:
        text.extend((item.from_concept, item.to_concept, item.explanation))
    return len(WORD_RE.findall(" ".join(text)))


def normalize_citations(output: BridgeOutput) -> BridgeOutput:
    def canonical(value: str) -> str:
        value = value.strip()
        if value.startswith("[") and value.endswith("]"):
            return value[1:-1].strip()
        return value

    for recap in output.recap:
        recap.citations = [canonical(value) for value in recap.citations]
    for bridge in output.bridges:
        bridge.source_citations = [canonical(value) for value in bridge.source_citations]
        bridge.target_citations = [canonical(value) for value in bridge.target_citations]
    return output


def validate_recap(output: BridgeOutput, resolved: ResolvedCase) -> list[str]:
    errors: list[str] = []
    if output.status == "low_overlap":
        errors.append("recap step không được trả low_overlap")
    if output.bridges:
        errors.append("recap step phải có bridges=[]")
    if output.status == "ok" and not 5 <= len(output.recap) <= 7:
        errors.append("recap ok phải có 5-7 ý")
    if output.status == "insufficient_context" and output.recap:
        errors.append("insufficient_context phải có recap=[]")
    allowed = set(resolved.previous)
    for index, item in enumerate(output.recap, 1):
        invalid = set(item.citations) - allowed
        if not item.citations or invalid:
            errors.append(f"recap[{index}] citation thiếu/sai: {sorted(invalid)}")
    return errors


def validate_final(output: BridgeOutput, resolved: ResolvedCase) -> dict[str, object]:
    errors: list[str] = []
    previous_ids, current_ids = set(resolved.previous), set(resolved.current)
    bad_recap = 0
    untraceable = 0

    if output.status == "ok":
        if not 5 <= len(output.recap) <= 7:
            errors.append("ok phải có 5-7 recap")
        if not 2 <= len(output.bridges) <= 4:
            errors.append("ok phải có 2-4 bridge")
    elif output.status == "low_overlap":
        if not 5 <= len(output.recap) <= 7:
            errors.append("low_overlap vẫn phải giữ 5-7 recap")
        if output.bridges:
            errors.append("low_overlap phải có bridges=[]")
    elif output.recap or output.bridges:
        errors.append("insufficient_context phải có recap=[] và bridges=[]")

    for index, item in enumerate(output.recap, 1):
        invalid = set(item.citations) - previous_ids
        if not item.citations or invalid:
            errors.append(f"recap[{index}] citation thiếu/sai: {sorted(invalid)}")
            bad_recap += 1
    for index, item in enumerate(output.bridges, 1):
        bad_source = not item.source_citations or bool(set(item.source_citations) - previous_ids)
        bad_target = not item.target_citations or bool(set(item.target_citations) - current_ids)
        if bad_source or bad_target:
            errors.append(f"bridge[{index}] thiếu citation hợp lệ ở một hoặc hai phía")
            untraceable += 1

    words = word_count(output)
    if words > 300:
        errors.append(f"Vượt 300 từ: {words}")
    if output.status != resolved.case.expected_status:
        errors.append(f"Fallback sai: expected={resolved.case.expected_status}, actual={output.status}")
    serialized = output.model_dump_json().casefold()
    for phrase in resolved.case.forbidden_phrases:
        if phrase.casefold() in serialized:
            errors.append(f"Chứa phrase bị cấm: {phrase}")

    return {
        "passed": not errors,
        "errors": errors,
        "word_count": words,
        "recap_has_existing_citation": bool(output.recap) and bad_recap == 0,
        "untraceable_bridge_count": untraceable,
    }


def gate(recap: BridgeOutput, resolved: ResolvedCase) -> list[str]:
    reasons: list[str] = []
    if recap.status == "insufficient_context":
        reasons.append("recap model báo insufficient_context")
    if not resolved.previous:
        reasons.append("thiếu nguồn buổi trước")
    if not resolved.current:
        reasons.append("thiếu nguồn buổi hiện tại")
    reasons.extend(validate_recap(recap, resolved))
    return reasons


def preflight_gate(resolved: ResolvedCase) -> list[str]:
    """Deterministic source sufficiency checks that do not need an LLM call."""
    reasons: list[str] = []
    if len(resolved.previous) < 5:
        reasons.append("nguồn buổi trước có ít hơn 5 đoạn độc lập")
    if not resolved.current:
        reasons.append("thiếu nguồn buổi hiện tại")
    return reasons


def validate_assets(cases: list[GoldenCase], resolver: Resolver) -> dict[str, object]:
    errors: list[str] = []
    cohorts = Counter(case.cohort for case in cases)
    hard = Counter(case.hard_class for case in cases if case.cohort == "hard")
    expected_hard = {"source_truth": 2, "missing_ambiguous": 2, "out_of_scope": 2, "domain_specific": 2}
    if len(cases) != 22:
        errors.append(f"Cần đúng 22 case, có {len(cases)}")
    if dict(cohorts) != {"normal": 10, "hard": 8, "rare": 4}:
        errors.append(f"Cơ cấu cohort sai: {dict(cohorts)}")
    if dict(hard) != expected_hard:
        errors.append(f"Cơ cấu hard class sai: {dict(hard)}")
    if len({case.id for case in cases}) != len(cases):
        errors.append("Trùng case ID")
    if sum(bool(case.chat_refs) for case in cases) < 10:
        errors.append("Chưa đủ 10 case trace về chatlog")
    if sum(case.reviewer_set for case in cases) != 13:
        errors.append("Reviewer set phải gồm 8 hard + 5 normal = 13 case")
    resolved_count = 0
    for case in cases:
        try:
            resolver.case(case)
            resolved_count += 1
        except Exception as exc:
            errors.append(f"{case.id}: {exc}")
    prompt_hashes: dict[str, object] = {}
    for version in ("v1", "v2"):
        try:
            prompt_hashes[version] = hashes(load_prompts(version))
        except Exception as exc:
            errors.append(str(exc))
    v2_system = (PROMPT_ROOT / "system_prompt.md").read_text(encoding="utf-8")
    if "dữ liệu" not in v2_system or "không phải chỉ dẫn" not in v2_system:
        errors.append("System prompt chính chưa có ranh giới prompt-injection rõ ràng")
    return {
        "valid": not errors,
        "case_count": len(cases),
        "cohorts": dict(cohorts),
        "hard_classes": {str(key): value for key, value in hard.items()},
        "chat_traceable_cases": sum(bool(case.chat_refs) for case in cases),
        "reviewer_cases": sum(case.reviewer_set for case in cases),
        "resolved_cases": resolved_count,
        "prompt_hashes": prompt_hashes,
        "errors": errors,
    }


class GeminiEval:
    def __init__(self, version: str) -> None:
        self.version = version
        self.prompts = load_prompts(version)
        self.prompt_hashes = hashes(self.prompts)
        self.model = os.getenv("GEMINI_MODEL", DEFAULT_MODEL)
        self.client = None

    def ready(self) -> None:
        from dotenv import load_dotenv

        load_dotenv(ROOT / ".env")
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise EvalError("Thiếu GOOGLE_API_KEY; không tạo result/pass giả")
        try:
            from google import genai
        except ImportError as exc:
            raise EvalError("Thiếu google-genai; cài eval/requirements.txt") from exc
        self.client = genai.Client(api_key=api_key)

    def generate(self, prompt: str) -> tuple[str, int]:
        from google.genai import types

        started = time.perf_counter()
        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=self.prompts["system_prompt.md"],
                response_mime_type="application/json",
                response_schema=gemini_schema(BridgeOutput),
            ),
        )
        latency = round((time.perf_counter() - started) * 1000)
        if not response.text:
            raise EvalError("API trả response rỗng")
        return response.text, latency

    def call(self, stage: Literal["recap", "bridge"], prompt: str, resolved: ResolvedCase) -> tuple[BridgeOutput | None, list[dict[str, object]]]:
        log: list[dict[str, object]] = []
        feedback = ""
        for attempt in (1, 2):
            started = time.perf_counter()
            try:
                raw, latency = self.generate(prompt + feedback)
            except Exception as exc:
                log.append({"stage": stage, "attempt": attempt, "latency_ms": round((time.perf_counter() - started) * 1000), "api_error": f"{type(exc).__name__}: {exc}"})
                return None, log
            try:
                output = normalize_citations(BridgeOutput.model_validate_json(raw))
                errors = validate_recap(output, resolved) if stage == "recap" else validate_final(output, resolved)["errors"]
            except (ValidationError, ValueError) as exc:
                output, errors = None, [f"schema/JSON: {exc}"]
            log.append({"stage": stage, "attempt": attempt, "latency_ms": latency, "raw_output": raw, "validation_errors": errors})
            if output is not None and not errors:
                return output, log
            retryable = any(
                error.startswith("schema/JSON") or "citation" in error.casefold()
                for error in errors
            )
            if attempt == 1 and retryable:
                feedback = "\n\nRETRY FEEDBACK — sửa đúng các lỗi sau, vẫn chỉ dùng nguồn:\n- " + "\n- ".join(errors)
            else:
                return None, log
        return None, log

    def run_case(self, resolved: ResolvedCase) -> dict[str, object]:
        started = time.perf_counter()
        preflight_reasons = preflight_gate(resolved)
        if preflight_reasons:
            output = BridgeOutput(
                status="insufficient_context",
                warnings=preflight_reasons,
            )
            report = validate_final(output, resolved)
            return {
                "case_id": resolved.case.id,
                "case_version": resolved.case.version,
                "expected_status": resolved.case.expected_status,
                "model": self.model,
                "prompt_version": self.version,
                "prompt_hashes": self.prompt_hashes,
                "timestamp_utc": datetime.now(timezone.utc).isoformat(),
                "latency_ms": round((time.perf_counter() - started) * 1000),
                "attempts": 0,
                "output": output.model_dump(mode="json"),
                "validator": report,
                "errors": report["errors"],
                "attempt_log": [],
                "passed": bool(report["passed"]),
            }
        previous, current = format_source(resolved.previous), format_source(resolved.current)
        recap_prompt = self.prompts["recap_prompt.md"].replace("{{PREVIOUS_SOURCE}}", previous)
        recap, attempts = self.call("recap", recap_prompt, resolved)
        output: BridgeOutput | None = None
        report: dict[str, object] | None = None
        errors: list[str] = []
        if recap is None:
            errors.append("Recap fail sau retry hoặc API error")
        else:
            gate_reasons = gate(recap, resolved)
            if gate_reasons:
                output = BridgeOutput(status="insufficient_context", warnings=gate_reasons)
            else:
                bridge_prompt = self.prompts["bridge_prompt.md"]
                bridge_prompt = bridge_prompt.replace("{{PREVIOUS_SOURCE}}", previous)
                bridge_prompt = bridge_prompt.replace("{{CURRENT_SOURCE}}", current)
                bridge_prompt = bridge_prompt.replace("{{RECAP_JSON}}", recap.model_dump_json(indent=2))
                output, bridge_log = self.call("bridge", bridge_prompt, resolved)
                attempts.extend(bridge_log)
                if output is None:
                    errors.append("Bridge fail sau retry hoặc API error")
            if output is not None:
                report = validate_final(output, resolved)
                errors.extend(report["errors"])
        return {
            "case_id": resolved.case.id,
            "case_version": resolved.case.version,
            "expected_status": resolved.case.expected_status,
            "model": self.model,
            "prompt_version": self.version,
            "prompt_hashes": self.prompt_hashes,
            "timestamp_utc": datetime.now(timezone.utc).isoformat(),
            "latency_ms": round((time.perf_counter() - started) * 1000),
            "attempts": len(attempts),
            "output": output.model_dump(mode="json") if output else None,
            "validator": report,
            "errors": errors,
            "attempt_log": attempts,
            "passed": bool(report and report["passed"] and not errors),
        }


def metrics(results: list[dict[str, object]]) -> dict[str, object]:
    total = len(results)
    passed = sum(bool(item["passed"]) for item in results)
    recap_eligible = [
        item for item in results if item.get("expected_status") != "insufficient_context"
    ]
    grounded = sum(
        bool((item.get("validator") or {}).get("recap_has_existing_citation"))
        for item in recap_eligible
    )
    untraceable = sum(int((item.get("validator") or {}).get("untraceable_bridge_count", 0)) for item in results)
    return {
        "total_cases": total,
        "recap_eligible_cases": len(recap_eligible),
        "case_pass_percent": round(100 * passed / total, 1) if total else 0,
        "recap_with_existing_citation_percent": (
            round(100 * grounded / len(recap_eligible), 1) if recap_eligible else 0
        ),
        "untraceable_bridge_count": untraceable,
        "user_helpfulness": "pending validation"
    }


def write_json(path: Path, data: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


REVIEW_DIMENSIONS = ("citation_support", "bridge_logic", "domain_correct", "useful_size")


def load_completed_review(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists():
        raise EvalError(f"Thiếu bảng reviewer: {path}")
    rows: dict[str, dict[str, str]] = {}
    with path.open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            case_id = row.get("case_id", "")
            if not case_id:
                continue
            missing = [name for name in REVIEW_DIMENSIONS if row.get(name) not in {"pass", "fail", "na"}]
            if missing:
                raise EvalError(f"{path.name}: {case_id} chưa chấm {missing}")
            rows[case_id] = row
    if len(rows) != 13:
        raise EvalError(f"{path.name} phải có đúng 13 case hoàn tất, hiện có {len(rows)}")
    return rows


def load_round(path: Path) -> dict[str, object]:
    if not path.exists():
        raise EvalError(f"Thiếu live round: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    if len(data.get("results", [])) != 22:
        raise EvalError(f"{path.name} không đủ 22 result")
    return data


def summarize_completed() -> dict[str, object]:
    round_1 = load_round(ROOT / "eval" / "results" / "round_1.json")
    round_2 = load_round(ROOT / "eval" / "results" / "round_2.json")
    first = load_completed_review(ROOT / "eval" / "reviews" / "eval_prompt_lead.csv")
    second = load_completed_review(ROOT / "eval" / "reviews" / "spec_design_lead.csv")
    disagreements = []
    for case_id in sorted(first):
        for dimension in REVIEW_DIMENSIONS:
            if first[case_id][dimension] != second[case_id][dimension]:
                disagreements.append({
                    "case_id": case_id,
                    "dimension": dimension,
                    "eval_prompt_lead": first[case_id][dimension],
                    "spec_design_lead": second[case_id][dimension],
                })
    return {
        "round_1": round_1["metrics"],
        "round_2": round_2["metrics"],
        "review_disagreements": disagreements,
        "user_helpfulness": "pending validation",
    }
