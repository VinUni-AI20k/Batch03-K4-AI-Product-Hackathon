# Lab Model Schema

Use this normalized model as the single source for both HTML and Markdown.

## Contents

1. Top-level structure
2. Metadata
3. Audit findings
4. Setup
5. Roles and files
6. Phases and tasks
7. Collaboration and commits
8. Validation rules
9. Minimal example

## Top-level structure

```json
{
  "meta": {},
  "audit": {},
  "setup": {},
  "roles": [],
  "files": [],
  "phases": [],
  "validations": [],
  "definition_of_done": []
}
```

Required top-level keys are `meta`, `setup`, `roles`, `files`, and `phases`.

## Metadata

```json
{
  "meta": {
    "title": "Tên bài lab",
    "language": "vi",
    "audience": "AI engineer fresher có nền tảng backend",
    "repository": "organization/repository",
    "branch": "main",
    "commit": "abc1234",
    "audit_date": "YYYY-MM-DD",
    "total_minutes": 150,
    "team_size": 5
  }
}
```

- Use `vi` or `en` for `language`.
- Use a short revision when available.
- Leave `commit` empty only when the source is not a Git checkout.
- Use user-provided time and team size before repository suggestions.

## Audit findings

```json
{
  "audit": {
    "findings": [
      {
        "title": "File sơ đồ chưa tồn tại",
        "evidence": "docs/CODELAB.md yêu cầu docs/flow.mermaid; tree không có file",
        "impact": "Học viên phải tạo file mới",
        "decision": "Đánh dấu NEW FILE và cung cấp contract, không cung cấp đáp án"
      }
    ],
    "sources": [
      "README.md",
      "docs/CODELAB.md",
      "src/app.py"
    ]
  }
}
```

Keep findings concise and learner-relevant. Use repository-relative evidence
paths.

## Setup

```json
{
  "setup": {
    "prerequisites": [
      "Python 3.11",
      "Chạy lệnh từ repository root"
    ],
    "conflict_prevention": [
      "Mỗi người dùng virtual environment riêng",
      "Core Integrator là người duy nhất sửa src/app.py"
    ],
    "commands": {
      "windows": [
        {
          "label": "Tạo môi trường",
          "type": "setup",
          "command": "py -m venv .venv",
          "expected": "Thư mục .venv được tạo"
        }
      ],
      "macos": [],
      "linux": []
    }
  }
}
```

Commands may cover cloning, environment setup, dependency installation,
zero-key smoke runs, and contract validation. Do not include Git submission or
history-manipulation commands.

## Roles and files

```json
{
  "roles": [
    {
      "id": "role-1",
      "title": "Product/Test Architect",
      "ownership": "Test cases và acceptance criteria",
      "files": ["config/test_cases.json"]
    }
  ],
  "files": [
    {
      "path": "docs/flow.mermaid",
      "status": "new_required",
      "parent_directory": "docs",
      "parent_status": "existing",
      "purpose": "Mô tả luồng hybrid",
      "consumers": [
        "Người chấm và phase nghiệm thu"
      ],
      "format": "Mermaid source UTF-8, không có Markdown fence",
      "required_contract": [
        "Có nhánh xử lý trực tiếp",
        "Có nhánh gọi tool",
        "Có điều kiện dừng"
      ],
      "creation_commands": {
        "windows": "New-Item -ItemType File -Path docs\\flow.mermaid -Force",
        "macos": "mkdir -p docs && touch docs/flow.mermaid",
        "linux": "mkdir -p docs && touch docs/flow.mermaid"
      },
      "validation": {
        "command": "test -s docs/flow.mermaid",
        "expected": "File tồn tại và không rỗng"
      }
    }
  ]
}
```

Allowed file statuses:

- `existing_edit`;
- `new_required`;
- `local_only`;
- `generated`;
- `optional`;
- `reference_only`.

Every `new_required` file must have `purpose`, `format`,
`parent_directory`, `parent_status`, `required_contract`,
`consumers`, `creation_commands`, and `validation`. Use `existing` or
`new_required` for `parent_status`. Make every creation command create the
parent first when its status is `new_required`.

Classify every task deliverable in the top-level `files` list, including
existing files.

## Phases and tasks

```json
{
  "phases": [
    {
      "id": "phase-1",
      "title": "Chuẩn hóa contract",
      "minutes": 30,
      "mode": "parallel",
      "entry_condition": "Setup smoke test chạy thành công",
      "checkpoint": "Input và tool contract đều pass",
      "tasks": [
        {
          "id": "task-input",
          "title": "Chuẩn hóa test input",
          "owner": "role-1",
          "knowledge": [
            "Test data là input contract, không phải test runner"
          ],
          "guidance": [
            "Hoàn thiện dữ liệu trong config/test_cases.json theo schema đã audit",
            "Giữ nguyên các field mà src/app.py đang đọc",
            "Tự chọn nội dung case và chạy validation schema"
          ],
          "paths": [
            "config/test_cases.json"
          ],
          "commands": [],
          "validation": {
            "type": "contract_validation",
            "command": "python scripts/check_cases.py",
            "manual": [],
            "expected": "PASS: input contract"
          },
          "expected_outcomes": [
            "Ứng dụng đọc được toàn bộ case mà không lỗi schema"
          ],
          "deliverables": [
            "config/test_cases.json"
          ]
        }
      ],
      "collaboration": {},
      "suggested_commits": []
    }
  ]
}
```

Task rules:

- Keep `knowledge` to at most three short items.
- Write behavioral `guidance`, not implementation steps.
- List every touched or created path in `paths`.
- Put multiline commands in `commands`, not inside guidance.
- Give every task one `validation` object with `type`, `expected`, and either
  `command` or non-empty `manual` steps.
- Make `expected_outcomes` observable.
- Put only repository file paths in `deliverables`.
- Do not list logs, scores, oral answers, or URLs as file deliverables.

Allowed phase modes are `parallel`, `sequential`, and `mixed`.

## Collaboration and commits

```json
{
  "collaboration": {
    "parallel_work": [
      "role-1 chuẩn hóa input",
      "role-2 hoàn thiện tool contract"
    ],
    "shared_files": [
      {
        "path": "src/app.py",
        "owner": "role-4"
      }
    ],
    "handoffs": [
      {
        "from": "role-2",
        "to": "role-4",
        "output": "Tool registry đã pass contract validation"
      }
    ],
    "integration_owner": "role-4"
  },
  "suggested_commits": [
    {
      "message": "feat: define input and tool contracts",
      "owner": "role-4",
      "files": [
        "config/test_cases.json",
        "src/tools.py"
      ],
      "checkpoint": "Input và tool validation pass"
    }
  ]
}
```

Every phase requires a collaboration object and at least one suggested commit.
For a phase with no file change, use an explicit planning commit entry with an
empty `files` array and explain `Không có commit vì phase chỉ đọc/trao đổi` in
the message field. Prefer combining such a phase with the next productive
phase instead of inventing a commit.

Do not include Git commands.

## Validation rules

Reject the model when:

- a required key is missing;
- a phase has no tasks, checkpoint, collaboration, or commit plan;
- a task misses one of the four learner-facing concepts;
- a deliverable is not a repository-relative file path;
- a required new file lacks its contract;
- a path contains the audit machine's drive or home directory;
- guidance contains line-level edits, patches, or solution code;
- any command performs Git submission or history manipulation;
- Vietnamese output mixes English UI labels.

## Minimal example

```json
{
  "meta": {
    "title": "Lab mẫu",
    "language": "vi",
    "audience": "AI engineer fresher",
    "repository": "org/repo",
    "branch": "main",
    "commit": "abc1234",
    "audit_date": "2026-07-31",
    "total_minutes": 60,
    "team_size": 5
  },
  "audit": {
    "findings": [],
    "sources": ["README.md"]
  },
  "setup": {
    "prerequisites": ["Python 3.11"],
    "conflict_prevention": ["Một người sở hữu mỗi shared file"],
    "commands": {
      "windows": [],
      "macos": [],
      "linux": []
    }
  },
  "roles": [
    {
      "id": "role-1",
      "title": "Product/Test Architect",
      "ownership": "Input contract",
      "files": ["config/cases.json"]
    }
  ],
      "files": [],
  "phases": [
    {
      "id": "phase-1",
      "title": "Xác nhận contract",
      "minutes": 60,
      "mode": "sequential",
      "entry_condition": "Setup hoàn tất",
      "checkpoint": "Contract validation pass",
      "tasks": [
        {
          "id": "task-1",
          "title": "Hoàn thiện input contract",
          "owner": "role-1",
          "knowledge": ["Schema giúp producer và consumer thống nhất"],
          "guidance": ["Hoàn thiện config/cases.json theo schema từ README"],
          "paths": ["config/cases.json"],
          "commands": [],
          "validation": {
            "type": "contract_validation",
            "command": "python scripts/check_cases.py",
            "manual": [],
            "expected": "PASS: input contract"
          },
          "expected_outcomes": ["Ứng dụng đọc được input"],
          "deliverables": ["config/cases.json"]
        }
      ],
      "collaboration": {
        "parallel_work": [],
        "shared_files": [],
        "handoffs": [],
        "integration_owner": "role-1"
      },
      "suggested_commits": [
        {
          "message": "feat: complete input contract",
          "owner": "role-1",
          "files": ["config/cases.json"],
          "checkpoint": "Contract validation pass"
        }
      ]
    }
  ],
  "validations": [],
  "definition_of_done": ["Contract validation pass"]
}
```
