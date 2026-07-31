#!/usr/bin/env python3
"""Render a normalized lab model as standalone HTML or structured Markdown."""

from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path
from typing import Any


SKILL_DIR = Path(__file__).resolve().parent.parent
HTML_TEMPLATE = SKILL_DIR / "assets" / "lab-guide-template.html"
MARKDOWN_TEMPLATE = SKILL_DIR / "assets" / "lab-guide-template.md"

LABELS: dict[str, dict[str, Any]] = {
    "vi": {
        "labGuide": "Hướng dẫn thực hành",
        "people": "người",
        "minutes": "phút",
        "branch": "Nhánh",
        "revision": "Phiên bản",
        "auditDate": "Ngày rà soát",
        "progress": "Tiến độ",
        "start": "Bắt đầu",
        "pause": "Tạm dừng",
        "focus": "Chế độ tập trung",
        "print": "In",
        "copy": "Sao chép",
        "copied": "Đã chép",
        "expected": "Kỳ vọng",
        "knowledge": "Kiến thức",
        "guidance": "Hướng dẫn",
        "outcome": "Đầu ra kỳ vọng",
        "deliverables": "Các file cần nộp",
        "audit": "Điểm cần biết trước khi làm",
        "auditSubtitle": "Các mâu thuẫn và contract được xác nhận từ repository.",
        "impact": "Ảnh hưởng",
        "decision": "Quyết định của guide",
        "noFindings": "Không có mâu thuẫn quan trọng cần cảnh báo.",
        "setup": "Chuẩn bị môi trường",
        "setupSubtitle": "Thiết lập thống nhất trước khi chia việc.",
        "prerequisites": "Điều kiện ban đầu",
        "conflictPrevention": "Tránh xung đột",
        "noCommands": "Không có lệnh riêng cho hệ điều hành này.",
        "roles": "Vai trò",
        "rolesSubtitle": "Mỗi người có vùng sở hữu và đầu ra rõ ràng.",
        "learnerName": "Tên học viên",
        "files": "File quan trọng",
        "filesSubtitle": "Phân biệt file hiện hữu, file mới và file chỉ dùng cục bộ.",
        "format": "Định dạng",
        "parentDirectory": "Thư mục chứa",
        "parentStatus": "Trạng thái thư mục",
        "consumers": "Nơi sử dụng",
        "createFile": "Tạo file",
        "validateFile": "Kiểm tra file",
        "noFiles": "Không có file đặc biệt.",
        "phases": "Các phase thực hiện",
        "phasesSubtitle": "Chỉ chuyển phase khi checkpoint đã đạt.",
        "phase": "Phase",
        "entryCondition": "Điều kiện bắt đầu",
        "owner": "Người phụ trách",
        "markDone": "Đánh dấu task hoàn thành",
        "taskValidation": "Kiểm tra task",
        "manualValidation": "Kiểm tra thủ công",
        "parallelWork": "Công việc song song",
        "sharedFiles": "File dùng chung",
        "handoffs": "Bàn giao",
        "integrationOwner": "Người tích hợp",
        "suggestedCommit": "Commit đề xuất",
        "requiredCheckpoint": "Checkpoint trước commit",
        "checkpoint": "Điều kiện chuyển phase",
        "reset": "Xóa tiến độ",
        "resetConfirm": "Xóa toàn bộ tiến độ và tên thành viên?",
        "validations": "Kiểm tra nhanh",
        "validationsSubtitle": "Dùng đúng loại kiểm tra và đọc kết quả quan sát được.",
        "noValidations": "Không có validation bổ sung.",
        "done": "Điều kiện hoàn thành",
        "doneSubtitle": "Kiểm tra artifact và kiến thức trước khi kết thúc.",
        "sources": "Nguồn repository đã rà soát",
        "none": "Không có",
        "os": {"windows": "Windows", "macos": "macOS", "linux": "Linux"},
        "modes": {"parallel": "Song song", "sequential": "Tuần tự", "mixed": "Kết hợp"},
        "fileStatus": {
            "existing_edit": "FILE HIỆN HỮU CẦN SỬA",
            "new_required": "FILE MỚI BẮT BUỘC",
            "local_only": "CHỈ DÙNG CỤC BỘ · KHÔNG NỘP",
            "generated": "FILE ĐƯỢC SINH RA",
            "optional": "TÙY CHỌN",
            "reference_only": "CHỈ ĐỌC",
        },
        "parentStatuses": {"existing": "Đã tồn tại", "new_required": "Cần tạo mới"},
    },
    "en": {
        "labGuide": "Lab guide",
        "people": "people",
        "minutes": "minutes",
        "branch": "Branch",
        "revision": "Revision",
        "auditDate": "Audit date",
        "progress": "Progress",
        "start": "Start",
        "pause": "Pause",
        "focus": "Focus mode",
        "print": "Print",
        "copy": "Copy",
        "copied": "Copied",
        "expected": "Expected",
        "knowledge": "Knowledge",
        "guidance": "Guidance",
        "outcome": "Expected outcome",
        "deliverables": "Files to submit",
        "audit": "Know before starting",
        "auditSubtitle": "Repository contradictions and verified contracts.",
        "impact": "Impact",
        "decision": "Guide decision",
        "noFindings": "No high-impact contradictions found.",
        "setup": "Environment setup",
        "setupSubtitle": "Align the environment before splitting work.",
        "prerequisites": "Prerequisites",
        "conflictPrevention": "Conflict prevention",
        "noCommands": "No commands for this operating system.",
        "roles": "Roles",
        "rolesSubtitle": "Give every learner clear ownership and output.",
        "learnerName": "Learner name",
        "files": "Important files",
        "filesSubtitle": "Separate existing, new, and local-only files.",
        "format": "Format",
        "parentDirectory": "Parent directory",
        "parentStatus": "Parent status",
        "consumers": "Consumers",
        "createFile": "Create file",
        "validateFile": "Validate file",
        "noFiles": "No special files.",
        "phases": "Execution phases",
        "phasesSubtitle": "Move on only after the checkpoint passes.",
        "phase": "Phase",
        "entryCondition": "Entry condition",
        "owner": "Owner",
        "markDone": "Mark task complete",
        "taskValidation": "Validate task",
        "manualValidation": "Manual validation",
        "parallelWork": "Parallel work",
        "sharedFiles": "Shared files",
        "handoffs": "Handoffs",
        "integrationOwner": "Integration owner",
        "suggestedCommit": "Suggested commit",
        "requiredCheckpoint": "Checkpoint before commit",
        "checkpoint": "Phase checkpoint",
        "reset": "Reset progress",
        "resetConfirm": "Reset all progress and learner names?",
        "validations": "Quick validation",
        "validationsSubtitle": "Use the correct check type and inspect observable results.",
        "noValidations": "No additional validation.",
        "done": "Completion criteria",
        "doneSubtitle": "Check artifacts and learning outcomes before finishing.",
        "sources": "Repository sources audited",
        "none": "None",
        "os": {"windows": "Windows", "macos": "macOS", "linux": "Linux"},
        "modes": {"parallel": "Parallel", "sequential": "Sequential", "mixed": "Mixed"},
        "fileStatus": {
            "existing_edit": "EXISTING FILE TO EDIT",
            "new_required": "NEW REQUIRED FILE",
            "local_only": "LOCAL ONLY",
            "generated": "GENERATED FILE",
            "optional": "OPTIONAL",
            "reference_only": "REFERENCE ONLY",
        },
        "parentStatuses": {"existing": "Existing", "new_required": "Must be created"},
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True, help="Path to lab-model JSON, or - for stdin")
    parser.add_argument("--format", choices=("html", "markdown", "md"), default="html")
    parser.add_argument("--output", required=True)
    parser.add_argument("--force", action="store_true", help="Overwrite an existing output")
    return parser.parse_args()


def load_model(source: str) -> dict[str, Any]:
    if source == "-":
        return json.load(sys.stdin)
    return json.loads(Path(source).read_text(encoding="utf-8"))


def write_output(path: Path, content: str, force: bool) -> None:
    if path.exists() and not force:
        raise SystemExit(f"Output already exists: {path}. Use --force only after checking it.")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def safe_script_json(value: Any) -> str:
    return (
        json.dumps(value, ensure_ascii=False, separators=(",", ":"))
        .replace("</", "<\\/")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def render_html(model: dict[str, Any]) -> str:
    meta = model["meta"]
    language = meta.get("language", "vi")
    labels = LABELS.get(language, LABELS["vi"])
    template = HTML_TEMPLATE.read_text(encoding="utf-8")
    return (
        template.replace("__LANG__", html.escape(language, quote=True))
        .replace("__TITLE__", html.escape(str(meta["title"]), quote=True))
        .replace("__LAB_MODEL_JSON__", safe_script_json(model))
        .replace("__LABELS_JSON__", safe_script_json(labels))
    )


def md_escape(value: Any) -> str:
    text = str(value if value is not None else "")
    return text.replace("\\", "\\\\").replace("|", "\\|").replace("\n", "<br>")


def md_list(items: list[Any] | None) -> str:
    if not items:
        return "—"
    return "<br>".join(f"- {md_escape(item)}" for item in items)


def code_block(command: str, language: str = "text") -> str:
    return f"```{language}\n{command.rstrip()}\n```"


def mermaid_node_id(prefix: str, value: Any) -> str:
    normalized = re.sub(r"[^A-Za-z0-9_]", "_", str(value))
    return f"{prefix}_{normalized or 'node'}"


def mermaid_label(value: Any) -> str:
    return str(value if value is not None else "").replace("\\", "\\\\").replace(
        '"', '\\"'
    ).replace("\r\n", "<br/>").replace("\n", "<br/>")


def build_workflow_graph(model: dict[str, Any]) -> str:
    language = model.get("meta", {}).get("language", "vi")
    vi = language == "vi"
    role_map = {role["id"]: role.get("title", role["id"]) for role in model.get("roles", [])}
    lines = ["flowchart TD"]
    declared_nodes: set[str] = set()

    def node(node_id: str, label: str) -> None:
        if node_id not in declared_nodes:
            lines.append(f'{node_id}["{mermaid_label(label)}"]')
            declared_nodes.add(node_id)

    def role_node(role_id: str) -> str:
        node_id = mermaid_node_id("role", role_id)
        node(node_id, role_map.get(role_id, role_id))
        return node_id

    start = "start"
    node(start, "Bắt đầu" if vi else "Start")
    previous = start
    for phase_index, phase in enumerate(model.get("phases", []), start=1):
        phase_id = phase.get("id", phase_index)
        entry = mermaid_node_id("entry", phase_id)
        integration = mermaid_node_id("integration", phase_id)
        checkpoint = mermaid_node_id("checkpoint", phase_id)
        collaboration = phase["collaboration"]
        node(entry, phase.get("entry_condition", ""))
        node(integration, role_map.get(collaboration["integration_owner"], ""))
        node(checkpoint, phase.get("checkpoint", ""))
        lines.append(f"{previous} --> {entry}")

        tasks = phase.get("tasks", [])
        task_nodes = [
            mermaid_node_id("task", task.get("id", index))
            for index, task in enumerate(tasks, start=1)
        ]
        for task, task_node in zip(tasks, task_nodes):
            owner = role_map.get(task.get("owner"), task.get("owner", ""))
            node(task_node, f"{owner}: {task.get('title', '')}")

        if phase.get("mode") == "sequential":
            if task_nodes:
                lines.append(f"{entry} --> {task_nodes[0]}")
                lines.extend(f"{source} --> {target}" for source, target in zip(task_nodes, task_nodes[1:]))
        else:
            lines.extend(f"{entry} --> {task_node}" for task_node in task_nodes)

        handoffs = collaboration.get("handoffs", [])
        handoff_sources = {handoff.get("from") for handoff in handoffs}
        for task, task_node in zip(tasks, task_nodes):
            owner = task.get("owner")
            if owner in handoff_sources:
                lines.append(f"{task_node} --> {role_node(owner)}")
            elif phase.get("mode") != "sequential" or task_node == task_nodes[-1]:
                lines.append(f"{task_node} --> {integration}")

        handoff_targets: set[str] = set()
        for handoff in handoffs:
            source = role_node(handoff.get("from", ""))
            target_id = handoff.get("to", "")
            target = role_node(target_id)
            lines.append(f'{source} -->|"{mermaid_label(handoff.get("output", ""))}"| {target}')
            handoff_targets.add(target_id)
        for target_id in handoff_targets:
            lines.append(f"{role_node(target_id)} --> {integration}")

        lines.append(f"{integration} --> {checkpoint}")
        previous = checkpoint

    completion = "completion"
    completion_label = "<br/>".join(model.get("definition_of_done", [])) or (
        "Hoàn thành" if vi else "Complete"
    )
    node(completion, completion_label)
    lines.append(f"{previous} --> {completion}")
    return "\n".join(lines)


def render_markdown(model: dict[str, Any]) -> str:
    meta = model["meta"]
    language = meta.get("language", "vi")
    vi = language == "vi"
    template = MARKDOWN_TEMPLATE.read_text(encoding="utf-8")
    revision = " · ".join(part for part in (meta.get("branch"), meta.get("commit")) if part) or "—"
    metadata_labels = {
        "attribute_label": "Thuộc tính" if vi else "Attribute",
        "value_label": "Giá trị" if vi else "Value",
        "repository_label": "Repository",
        "revision_label": "Phiên bản" if vi else "Revision",
        "duration_label": "Thời lượng" if vi else "Duration",
        "minutes_label": "phút" if vi else "minutes",
        "team_label": "Nhóm" if vi else "Team",
        "people_label": "người" if vi else "people",
        "audit_date_label": "Ngày rà soát" if vi else "Audit date",
    }
    result = (
        template.replace("{{title}}", str(meta["title"]))
        .replace("{{audience}}", str(meta.get("audience", "")))
        .replace("{{repository}}", str(meta.get("repository", "")))
        .replace("{{revision}}", revision)
        .replace("{{total_minutes}}", str(meta.get("total_minutes", "—")))
        .replace("{{team_size}}", str(meta.get("team_size", "—")))
        .replace("{{audit_date}}", str(meta.get("audit_date", "—")))
    ).rstrip()
    for key, value in metadata_labels.items():
        result = result.replace(f"{{{{{key}}}}}", value)
    out: list[str] = [result]

    out.extend(["", "## Điểm cần biết trước khi làm" if vi else "## Know before starting", ""])
    findings = model.get("audit", {}).get("findings", [])
    if findings:
        out.extend([
            "| Phát hiện | Bằng chứng | Ảnh hưởng | Quyết định của guide |"
            if vi else "| Finding | Evidence | Impact | Guide decision |",
            "| --- | --- | --- | --- |",
        ])
        for item in findings:
            out.append(
                f"| {md_escape(item.get('title'))} | {md_escape(item.get('evidence'))} | "
                f"{md_escape(item.get('impact'))} | {md_escape(item.get('decision'))} |"
            )
    else:
        out.append("Không có mâu thuẫn quan trọng." if vi else "No high-impact contradictions found.")

    setup = model.get("setup", {})
    out.extend(["", "## Chuẩn bị môi trường" if vi else "## Environment setup", ""])
    out.append("### Điều kiện ban đầu" if vi else "### Prerequisites")
    out.extend(f"- {item}" for item in setup.get("prerequisites", []))
    out.extend(["", "### Tránh xung đột" if vi else "### Conflict prevention"])
    out.extend(f"- {item}" for item in setup.get("conflict_prevention", []))
    for os_name, commands in setup.get("commands", {}).items():
        if not commands:
            continue
        out.extend(["", f"### {LABELS[language]['os'].get(os_name, os_name)}", ""])
        for command in commands:
            out.append(f"**{command.get('label', '')}**")
            out.append("")
            out.append(code_block(command.get("command", ""), "powershell" if os_name == "windows" else "bash"))
            if command.get("expected"):
                out.append(f"**{'Kỳ vọng' if vi else 'Expected'}:** {command['expected']}")
            out.append("")

    out.extend(["## Vai trò" if vi else "## Roles", ""])
    out.extend([
        "| Vai trò | Sở hữu | File |" if vi else "| Role | Ownership | Files |",
        "| --- | --- | --- |",
    ])
    role_map = {role["id"]: role.get("title", role["id"]) for role in model.get("roles", [])}
    for role in model.get("roles", []):
        out.append(
            f"| {md_escape(role.get('title'))} | {md_escape(role.get('ownership'))} | "
            f"{md_list(role.get('files'))} |"
        )

    files = model.get("files", [])
    if files:
        out.extend(["", "## File quan trọng" if vi else "## Important files", ""])
        out.extend([
            "| Trạng thái | Đường dẫn | Mục đích | Định dạng/contract |"
            if vi else "| Status | Path | Purpose | Format/contract |",
            "| --- | --- | --- | --- |",
        ])
        for item in files:
            status = LABELS[language]["fileStatus"].get(item.get("status"), item.get("status"))
            contract = [item.get("format", "")] + item.get("required_contract", [])
            out.append(
                f"| {md_escape(status)} | `{md_escape(item.get('path'))}` | "
                f"{md_escape(item.get('purpose'))} | {md_list([x for x in contract if x])} |"
            )
        for item in files:
            if item.get("status") != "new_required":
                continue
            out.extend([
                "",
                f"### {'Tạo file mới' if vi else 'Create new file'} — `{item.get('path')}`",
                "",
                f"- **{'Thư mục chứa' if vi else 'Parent directory'}:** "
                f"`{item.get('parent_directory', '.')}`",
                f"- **{'Trạng thái thư mục' if vi else 'Parent status'}:** "
                f"{LABELS[language]['parentStatuses'].get(item.get('parent_status'), item.get('parent_status', '—'))}",
                f"- **{'Nơi sử dụng' if vi else 'Consumers'}:** "
                f"{', '.join(item.get('consumers', [])) or '—'}",
                "",
            ])
            for os_name, command in item.get("creation_commands", {}).items():
                if not command:
                    continue
                out.append(f"**{LABELS[language]['os'].get(os_name, os_name)}**")
                out.append("")
                out.append(code_block(command, "powershell" if os_name == "windows" else "bash"))
                out.append("")
            validation = item.get("validation", {})
            if validation.get("command"):
                out.append(f"**{'Kiểm tra file' if vi else 'Validate file'}**")
                out.append("")
                out.append(code_block(validation["command"]))
                if validation.get("expected"):
                    out.append(f"**{'Kỳ vọng' if vi else 'Expected'}:** {validation['expected']}")
                out.append("")

    out.extend([
        "",
        "## Luồng làm việc nhóm đầu-cuối" if vi else "## End-to-end team workflow",
        "",
        code_block(build_workflow_graph(model), "mermaid"),
    ])

    out.extend(["", "## Các phase thực hiện" if vi else "## Execution phases"])
    task_header = (
        "| Kiến thức | Hướng dẫn | Đầu ra kỳ vọng | Các file cần nộp |"
        if vi else "| Knowledge | Guidance | Expected outcome | Files to submit |"
    )
    workflow_header = (
        "| Vai trò | Công việc | Bàn giao | Commit đề xuất |"
        if vi else "| Role | Work | Handoff | Suggested commit |"
    )
    for index, phase in enumerate(model.get("phases", []), start=1):
        out.extend([
            "",
            f"## Phase {index} — {phase.get('title', '')}",
            "",
            f"- **{'Thời gian' if vi else 'Time'}:** {phase.get('minutes', '—')} "
            f"{'phút' if vi else 'minutes'}",
            f"- **{'Chế độ' if vi else 'Mode'}:** "
            f"{LABELS[language]['modes'].get(phase.get('mode'), phase.get('mode'))}",
            f"- **{'Điều kiện bắt đầu' if vi else 'Entry condition'}:** {phase.get('entry_condition', '')}",
            f"- **{'Điều kiện chuyển phase' if vi else 'Phase checkpoint'}:** {phase.get('checkpoint', '')}",
            "",
            task_header,
            "| --- | --- | --- | --- |",
        ])
        for task in phase.get("tasks", []):
            guidance = [f"`{path}`" for path in task.get("paths", [])] + task.get("guidance", [])
            out.append(
                f"| {md_list(task.get('knowledge'))} | {md_list(guidance)} | "
                f"{md_list(task.get('expected_outcomes'))} | {md_list(task.get('deliverables'))} |"
            )

        task_commands = [
            (task, command)
            for task in phase.get("tasks", [])
            for command in task.get("commands", [])
        ]
        for task in phase.get("tasks", []):
            validation = task.get("validation", {})
            existing_commands = {item.get("command") for item in task.get("commands", [])}
            if validation.get("command") and validation.get("command") not in existing_commands:
                task_commands.append(
                    (
                        task,
                        {
                            "label": "Kiểm tra task" if vi else "Validate task",
                            "command": validation["command"],
                            "expected": validation.get("expected", ""),
                        },
                    )
                )
        if task_commands:
            out.extend(["", f"### {'Lệnh kiểm tra' if vi else 'Validation commands'}", ""])
            for task, command in task_commands:
                out.append(f"**{task.get('title')} — {command.get('label', '')}**")
                out.append("")
                out.append(code_block(command.get("command", "")))
                if command.get("expected"):
                    out.append(f"**{'Kỳ vọng' if vi else 'Expected'}:** {command['expected']}")
                out.append("")
        manual_tasks = [
            (task, task.get("validation", {}))
            for task in phase.get("tasks", [])
            if task.get("validation", {}).get("manual")
        ]
        for task, validation in manual_tasks:
            out.append(f"**{task.get('title')} — {'Kiểm tra thủ công' if vi else 'Manual validation'}**")
            out.extend(f"- {step}" for step in validation.get("manual", []))
            if validation.get("expected"):
                out.append(f"- **{'Kỳ vọng' if vi else 'Expected'}:** {validation['expected']}")
            out.append("")

        collaboration = phase.get("collaboration", {})
        handoffs = collaboration.get("handoffs", [])
        commits = phase.get("suggested_commits", [])
        out.extend(["", workflow_header, "| --- | --- | --- | --- |"])
        for task in phase.get("tasks", []):
            owner_id = task.get("owner", "")
            owner = role_map.get(owner_id, owner_id)
            owner_handoffs = [
                f"{role_map.get(item.get('from'), item.get('from'))} → "
                f"{role_map.get(item.get('to'), item.get('to'))}: {item.get('output')}"
                for item in handoffs
                if item.get("from") == owner_id
            ]
            task_files = set(task.get("deliverables", []))
            owner_commits = [
                item.get("message", "")
                for item in commits
                if task_files.intersection(item.get("files", []))
            ]
            out.append(
                f"| {md_escape(owner)} | {md_escape(task.get('title'))} | "
                f"{md_list(owner_handoffs)} | {md_list(owner_commits)} |"
            )

        shared_files = [
            f"`{item.get('path')}` — {role_map.get(item.get('owner'), item.get('owner'))}"
            for item in collaboration.get("shared_files", [])
        ]
        out.extend([
            "",
            f"- **{'File dùng chung' if vi else 'Shared files'}:** "
            f"{'; '.join(shared_files) if shared_files else '—'}",
            f"- **{'Người tích hợp' if vi else 'Integration owner'}:** "
            f"{role_map.get(collaboration.get('integration_owner'), collaboration.get('integration_owner', '—'))}",
        ])
        if commits:
            out.extend(["", f"### {'Commit đề xuất' if vi else 'Suggested commits'}", ""])
            for commit in commits:
                out.extend([
                    f"- `{commit.get('message', '')}`",
                    f"  - {'Người phụ trách' if vi else 'Owner'}: "
                    f"{role_map.get(commit.get('owner'), commit.get('owner', ''))}",
                    f"  - {'File' if vi else 'Files'}: {', '.join(f'`{item}`' for item in commit.get('files', [])) or '—'}",
                    f"  - {'Checkpoint' if vi else 'Checkpoint'}: {commit.get('checkpoint', '')}",
                ])

    validations = model.get("validations", [])
    if validations:
        out.extend(["", "## Kiểm tra cuối" if vi else "## Final validation", ""])
        for item in validations:
            out.append(f"### {item.get('title', '')}")
            if item.get("command"):
                out.extend(["", code_block(item["command"]), ""])
            if item.get("expected"):
                out.append(f"**{'Kỳ vọng' if vi else 'Expected'}:** {item['expected']}")
            out.extend(f"- {step}" for step in item.get("manual", []))
            out.append("")

    out.extend(["## Điều kiện hoàn thành" if vi else "## Completion criteria", ""])
    out.extend(f"- [ ] {item}" for item in model.get("definition_of_done", []))
    out.extend([
        "",
        f"## {'Nguồn repository đã rà soát' if vi else 'Repository sources audited'}",
        "",
    ])
    out.extend(f"- `{source}`" for source in model.get("audit", {}).get("sources", []))
    return "\n".join(out).rstrip() + "\n"


def main() -> None:
    args = parse_args()
    model = load_model(args.model)
    output = Path(args.output)
    content = render_html(model) if args.format == "html" else render_markdown(model)
    write_output(output, content, args.force)
    print(f"Rendered {args.format}: {output}")


if __name__ == "__main__":
    main()
