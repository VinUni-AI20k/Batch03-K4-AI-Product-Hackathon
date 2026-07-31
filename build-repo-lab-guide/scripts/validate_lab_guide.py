#!/usr/bin/env python3
"""Validate a normalized lab model and its rendered learner guide."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from pathlib import Path, PurePosixPath
from typing import Any, Iterable


REQUIRED_TOP = ("meta", "setup", "roles", "files", "phases")
REQUIRED_META = ("title", "language", "audience", "repository", "total_minutes", "team_size")
REQUIRED_TASK = (
    "id",
    "title",
    "owner",
    "knowledge",
    "guidance",
    "validation",
    "expected_outcomes",
    "deliverables",
)
PHASE_MODES = {"parallel", "sequential", "mixed"}
FILE_STATUSES = {
    "existing_edit",
    "new_required",
    "local_only",
    "generated",
    "optional",
    "reference_only",
}
PARENT_STATUSES = {"existing", "new_required"}
COMMAND_TYPES = {
    "setup",
    "smoke_demo",
    "automated_test",
    "contract_validation",
    "manual_check",
    "security_check",
}

FORBIDDEN_GIT = re.compile(
    r"(?i)\bgit\s+(?:add|commit|push|merge|rebase|remote\s+add|checkout|"
    r"cherry-pick|reset|switch|branch\s+-[dD])\b"
)
ABSOLUTE_PATH = re.compile(
    r"(?i)(?:\b[A-Z]:[\\/]|/(?:Users|home|root)/[^/\s]+/)"
)
LINE_EDIT = re.compile(
    r"(?i)(?:\b(?:line|lines|dòng)\s+\d+\b|"
    r"\b(?:replace|thay)\s+(?:dòng|đoạn|line|block)\b|"
    r"^\s*@@\s|^\s*[+-]{3}\s)"
)
SOLUTION_SEQUENCE = re.compile(
    r"(?i)(?:\btry\s*/?\s*except\b|"
    r"\b(?:import|from)\s+[A-Za-z_][\w.]*\s+(?:inside|bên trong)\b|"
    r"\b(?:gọi|call)\b.+\b(?:sau đó|rồi|then)\b)"
)
PLACEHOLDER = re.compile(r"(?:__[A-Z0-9_]+__|\bTODO\b|\bTBD\b)")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--artifact")
    return parser.parse_args()


def load_json(path: str) -> dict[str, Any]:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def walk_strings(value: Any) -> Iterable[str]:
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for nested in value.values():
            yield from walk_strings(nested)
    elif isinstance(value, list):
        for nested in value:
            yield from walk_strings(nested)


def is_relative_repo_path(value: str) -> bool:
    if not value or ABSOLUTE_PATH.search(value) or "://" in value or "\\" in value:
        return False
    path = PurePosixPath(value)
    return not path.is_absolute() and ".." not in path.parts and len(path.parts) > 0


def require_list(container: dict[str, Any], key: str, where: str, errors: list[str]) -> list[Any]:
    value = container.get(key)
    if not isinstance(value, list):
        errors.append(f"{where}.{key} must be a list")
        return []
    return value


def validate_model(model: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED_TOP:
        if key not in model:
            errors.append(f"Missing top-level key: {key}")

    meta = model.get("meta", {})
    for key in REQUIRED_META:
        if meta.get(key) in (None, ""):
            errors.append(f"Missing meta.{key}")
    if meta.get("language") not in {"vi", "en"}:
        errors.append("meta.language must be vi or en")
    if not isinstance(meta.get("team_size"), int) or meta.get("team_size", 0) < 1:
        errors.append("meta.team_size must be a positive integer")
    if not isinstance(meta.get("total_minutes"), int) or meta.get("total_minutes", 0) < 1:
        errors.append("meta.total_minutes must be a positive integer")

    setup = model.get("setup", {})
    setup_types: set[str] = set()
    for os_name, commands in setup.get("commands", {}).items():
        if os_name not in {"windows", "macos", "linux"}:
            errors.append(f"setup.commands has unsupported operating system: {os_name}")
        if not isinstance(commands, list):
            errors.append(f"setup.commands.{os_name} must be a list")
            continue
        for index, command in enumerate(commands):
            command_type = command.get("type")
            if command_type not in COMMAND_TYPES:
                errors.append(f"setup.commands.{os_name}[{index}].type is invalid")
            else:
                setup_types.add(command_type)
            if not command.get("command") or not command.get("expected"):
                errors.append(f"setup.commands.{os_name}[{index}] needs command and expected")

    roles = require_list(model, "roles", "model", errors)
    role_ids = {role.get("id") for role in roles if isinstance(role, dict)}
    used_roles: set[str] = set()
    referenced_paths: set[str] = set()
    if not roles:
        errors.append("roles must not be empty")
    for index, role in enumerate(roles):
        where = f"roles[{index}]"
        for key in ("id", "title", "ownership", "files"):
            if key not in role:
                errors.append(f"{where} missing {key}")
        for path in role.get("files", []):
            if not is_relative_repo_path(path):
                errors.append(f"{where} has non-portable file path: {path}")
    if len(role_ids) != len(roles) or None in role_ids or "" in role_ids:
        errors.append("roles must have unique, non-empty ids")

    files = require_list(model, "files", "model", errors)
    file_index: dict[str, dict[str, Any]] = {}
    for index, item in enumerate(files):
        where = f"files[{index}]"
        path = item.get("path", "")
        if not is_relative_repo_path(path):
            errors.append(f"{where} has non-portable path: {path}")
        else:
            file_index[path] = item
        if item.get("status") not in FILE_STATUSES:
            errors.append(f"{where}.status is invalid: {item.get('status')}")
        if item.get("status") == "new_required":
            for key in (
                "purpose",
                "format",
                "parent_directory",
                "parent_status",
                "consumers",
                "required_contract",
                "creation_commands",
                "validation",
            ):
                if not item.get(key):
                    errors.append(f"{where} new_required file missing {key}")
            if item.get("parent_status") not in PARENT_STATUSES:
                errors.append(f"{where}.parent_status must be existing or new_required")
            if item.get("parent_directory") and not is_relative_repo_path(item["parent_directory"]):
                errors.append(f"{where} has invalid parent_directory: {item.get('parent_directory')}")

    phases = require_list(model, "phases", "model", errors)
    if not phases:
        errors.append("phases must not be empty")
    elif re.search(r"(?i)\bsmoke\b", str(phases[0].get("entry_condition", ""))) and "smoke_demo" not in setup_types:
        errors.append("First phase requires a smoke check, but setup has no smoke_demo command")
    task_ids: set[str] = set()
    phase_ids: set[str] = set()
    for p_index, phase in enumerate(phases):
        where = f"phases[{p_index}]"
        for key in ("id", "title", "minutes", "mode", "entry_condition", "checkpoint"):
            if phase.get(key) in (None, ""):
                errors.append(f"{where} missing {key}")
        if phase.get("mode") not in PHASE_MODES:
            errors.append(f"{where}.mode must be parallel, sequential, or mixed")
        phase_id = phase.get("id")
        if phase_id in phase_ids:
            errors.append(f"Duplicate phase id: {phase_id}")
        phase_ids.add(phase_id)
        tasks = require_list(phase, "tasks", where, errors)
        if not tasks:
            errors.append(f"{where} must contain at least one task")

        collaboration = phase.get("collaboration")
        if not isinstance(collaboration, dict):
            errors.append(f"{where}.collaboration must be an object")
            collaboration = {}
        for key in ("parallel_work", "shared_files", "handoffs", "integration_owner"):
            if key not in collaboration:
                errors.append(f"{where}.collaboration missing {key}")
        integration_owner = collaboration.get("integration_owner")
        if integration_owner and integration_owner not in role_ids:
            errors.append(f"{where} integration owner is not a declared role: {integration_owner}")
        if integration_owner:
            used_roles.add(integration_owner)
        for shared in collaboration.get("shared_files", []):
            if not is_relative_repo_path(shared.get("path", "")):
                errors.append(f"{where} has invalid shared file path: {shared.get('path')}")
            if shared.get("owner") not in role_ids:
                errors.append(f"{where} shared file owner is not a declared role")
            else:
                used_roles.add(shared.get("owner"))
            if shared.get("path"):
                referenced_paths.add(shared["path"])
        for handoff in collaboration.get("handoffs", []):
            for endpoint in ("from", "to"):
                role_id = handoff.get(endpoint)
                if role_id not in role_ids:
                    errors.append(f"{where} handoff {endpoint} is not a declared role: {role_id}")
                else:
                    used_roles.add(role_id)
        producer_roles = {
            task.get("owner")
            for task in tasks
            if task.get("owner") and task.get("owner") != integration_owner
        }
        handoff_sources = {handoff.get("from") for handoff in collaboration.get("handoffs", [])}
        for producer in sorted(producer_roles - handoff_sources):
            errors.append(f"{where} task owner has no explicit handoff: {producer}")

        commits = require_list(phase, "suggested_commits", where, errors)
        if not commits:
            errors.append(f"{where} needs at least one suggested commit plan")
        for c_index, commit in enumerate(commits):
            c_where = f"{where}.suggested_commits[{c_index}]"
            for key in ("message", "owner", "files", "checkpoint"):
                if key not in commit:
                    errors.append(f"{c_where} missing {key}")
            if commit.get("owner") not in role_ids:
                errors.append(f"{c_where} owner is not a declared role")
            else:
                used_roles.add(commit.get("owner"))
            for path in commit.get("files", []):
                if not is_relative_repo_path(path):
                    errors.append(f"{c_where} has invalid file path: {path}")
                if path not in file_index:
                    errors.append(f"{c_where} file is not classified in model.files: {path}")
                if file_index.get(path, {}).get("status") == "local_only":
                    errors.append(f"{c_where} includes local-only file: {path}")
                referenced_paths.add(path)

        for t_index, task in enumerate(tasks):
            t_where = f"{where}.tasks[{t_index}]"
            for key in REQUIRED_TASK:
                if key not in task:
                    errors.append(f"{t_where} missing {key}")
            task_id = task.get("id")
            if task_id in task_ids:
                errors.append(f"Duplicate task id: {task_id}")
            task_ids.add(task_id)
            if task.get("owner") not in role_ids:
                errors.append(f"{t_where} owner is not a declared role")
            else:
                used_roles.add(task.get("owner"))
            knowledge = require_list(task, "knowledge", t_where, errors)
            guidance = require_list(task, "guidance", t_where, errors)
            outcomes = require_list(task, "expected_outcomes", t_where, errors)
            deliverables = require_list(task, "deliverables", t_where, errors)
            if not knowledge or len(knowledge) > 3:
                errors.append(f"{t_where}.knowledge must contain 1-3 concise items")
            if not guidance:
                errors.append(f"{t_where}.guidance must not be empty")
            if not outcomes:
                errors.append(f"{t_where}.expected_outcomes must not be empty")
            for path in task.get("paths", []):
                if not is_relative_repo_path(path):
                    errors.append(f"{t_where} has non-portable path: {path}")
                referenced_paths.add(path)
            for path in deliverables:
                if not is_relative_repo_path(path):
                    errors.append(f"{t_where} deliverable is not a repository-relative file: {path}")
                if path not in file_index:
                    errors.append(f"{t_where} deliverable is not classified in model.files: {path}")
                referenced_paths.add(path)
            validation = task.get("validation")
            if not isinstance(validation, dict):
                errors.append(f"{t_where}.validation must be an object")
            else:
                if validation.get("type") not in COMMAND_TYPES:
                    errors.append(f"{t_where}.validation.type is invalid")
                if not validation.get("expected"):
                    errors.append(f"{t_where}.validation missing expected")
                if not validation.get("command") and not validation.get("manual"):
                    errors.append(f"{t_where}.validation needs command or manual steps")
            for command_index, command in enumerate(task.get("commands", [])):
                if command.get("type") not in COMMAND_TYPES:
                    errors.append(f"{t_where}.commands[{command_index}].type is invalid")
                if not command.get("command") or not command.get("expected"):
                    errors.append(f"{t_where}.commands[{command_index}] needs command and expected")
            for text in guidance:
                if LINE_EDIT.search(text):
                    errors.append(f"{t_where} contains line-level edit guidance: {text}")
                if SOLUTION_SEQUENCE.search(text):
                    errors.append(f"{t_where} contains solution-level implementation sequence: {text}")

    for role in roles:
        role_id = role.get("id")
        if role_id and role_id not in used_roles:
            errors.append(f"Declared role has no structured task or handoff: {role_id}")
        for path in role.get("files", []):
            if path not in referenced_paths:
                errors.append(f"Role-owned file is not covered by a task or commit: {path}")

    all_text = "\n".join(walk_strings(model))
    if FORBIDDEN_GIT.search(all_text):
        errors.append("Model contains forbidden Git workflow command")
    if ABSOLUTE_PATH.search(all_text):
        errors.append("Model contains an audit-machine absolute path")
    return errors


def validate_javascript(artifact: Path, text: str, errors: list[str]) -> None:
    if not shutil.which("node"):
        return
    scripts = re.findall(r"<script(?![^>]*type=[\"']application/json[\"'])[^>]*>(.*?)</script>", text, re.S | re.I)
    with tempfile.TemporaryDirectory() as temp_dir:
        for index, script in enumerate(scripts, start=1):
            path = Path(temp_dir) / f"script-{index}.js"
            path.write_text(script, encoding="utf-8")
            result = subprocess.run(
                ["node", "--check", str(path)],
                capture_output=True,
                text=True,
                check=False,
            )
            if result.returncode:
                errors.append(f"{artifact.name} inline script {index} is invalid: {result.stderr.strip()}")


def validate_artifact(model: dict[str, Any], artifact: Path) -> list[str]:
    errors: list[str] = []
    if not artifact.exists() or artifact.stat().st_size == 0:
        return [f"Artifact missing or empty: {artifact}"]
    text = artifact.read_text(encoding="utf-8")
    if PLACEHOLDER.search(text):
        errors.append("Artifact contains unresolved placeholder")
    if FORBIDDEN_GIT.search(text):
        errors.append("Artifact contains forbidden Git workflow command")
    if ABSOLUTE_PATH.search(text):
        errors.append("Artifact contains an audit-machine absolute path")

    if artifact.suffix.lower() == ".html":
        for marker in (
            'id="lab-model"',
            'id="osTabs"',
            'id="phases"',
            'data-task=',
            "localStorage",
            "focus-mode",
        ):
            if marker not in text:
                errors.append(f"HTML missing required interaction marker: {marker}")
        if re.search(r"<(?:script|link)[^>]+(?:src|href)=[\"']https?://", text, re.I):
            errors.append("HTML depends on an external script or stylesheet")
        if model.get("meta", {}).get("language") == "vi":
            for label in ("Knowledge", "Instructions", "Expected outcome", "Deliverables"):
                if f">{label}<" in text:
                    errors.append(f"Vietnamese HTML contains English UI label: {label}")
        validate_javascript(artifact, text, errors)

    elif artifact.suffix.lower() == ".md":
        language = model.get("meta", {}).get("language")
        workflow_heading = (
            "## Luồng làm việc nhóm đầu-cuối"
            if language == "vi"
            else "## End-to-end team workflow"
        )
        if text.count(workflow_heading) != 1:
            errors.append("Markdown needs exactly one end-to-end workflow heading")
        if len(re.findall(r"^```mermaid\s*$", text, re.M)) != 1:
            errors.append("Markdown needs exactly one Mermaid workflow graph")
        header = (
            "| Kiến thức | Hướng dẫn | Đầu ra kỳ vọng | Các file cần nộp |"
            if language == "vi"
            else "| Knowledge | Guidance | Expected outcome | Files to submit |"
        )
        count = text.count(header)
        if count != len(model.get("phases", [])):
            errors.append(
                f"Markdown needs one four-column task table per phase: expected "
                f"{len(model.get('phases', []))}, found {count}"
            )
        if language == "vi":
            for heading in ("#### Knowledge", "#### Instructions", "#### Expected outcome", "#### Deliverables"):
                if heading in text:
                    errors.append(f"Vietnamese Markdown uses forbidden repeated heading: {heading}")
    else:
        errors.append("Artifact must have .html or .md extension")
    return errors


def main() -> None:
    args = parse_args()
    model = load_json(args.model)
    errors = validate_model(model)
    if args.artifact:
        errors.extend(validate_artifact(model, Path(args.artifact)))
    if errors:
        print("VALIDATION FAILED")
        for error in errors:
            print(f"- {error}")
        raise SystemExit(1)
    print("VALIDATION PASSED")


if __name__ == "__main__":
    main()
