# Task Assignment

## Project
**AI Glossary Tutor** – AI hỗ trợ giải thích thuật ngữ AI theo ngữ cảnh cho người mới học.

---

# Team Members

| STT | Thành viên | Vai trò |
|-----|------------|----------|
| 1 | [2A202601528] - [Lê Đình Việt] | Product Owner |
| 2 | [2A202601164] - [Nguyễn Ngọc Huân] | AI Engineer |
| 3 | [2A202601770] - [Vương Đức Thoại ] | Fullstack Developer |
| 4 | [2A202601532] - [Quách Thanh Hưng] | QA & Evaluation |

---

# Phân công công việc

| Thành viên | Vai trò | Công việc chính | Deliverable |
|------------|----------|-----------------|-------------|
| **Lê Đình Việt** | Product Owner | - Xây dựng Canvas 7 dòng<br>- Phân tích JTBD, Pain Point<br>- Khảo sát người dùng và thu thập Evidence<br>- Viết `spec.md` (§1 → §4)<br>- Chuẩn bị slide và thuyết trình | `README.md`<br>`spec.md` (§1–§4)<br>`demo-slides.pdf` |
| **Nguyễn Ngọc Huân** | AI Engineer | - Thiết kế Prompt<br>- Tích hợp LLM API<br>- Xây dựng logic giải thích thuật ngữ theo ngữ cảnh<br>- Thiết kế Happy Path, Low Confidence, Failure, Correction | `codebase/`<br>`spec.md` (§5–§6) |
| **Vương Đức Thoại** | Fullstack Developer | - Thiết kế giao diện Extension/Web App<br>- Chức năng bôi đen văn bản<br>- Popup hiển thị kết quả<br>- API kết nối AI<br>- Hoàn thiện prototype end-to-end | `codebase/` |
| **Quách Thanh Hưng** | QA & Evaluation | - Xây dựng Golden Set (≥20 test cases)<br>- Định nghĩa Quality Bar<br>- Chạy kiểm thử và tổng hợp kết quả<br>- Thu thập Feedback người dùng<br>- Viết Reflection và Changelog | `eval/`<br>`validation/`<br>`reflection/`<br>`spec.md` (§7–§9) |

---

# Mapping theo cấu trúc Repo

```
repo/
├── README.md                ← Thành viên 1
├── spec.md                  ← Thành viên 1,2,4
├── demo-slides.pdf          ← Thành viên 1 (cả nhóm hỗ trợ)
├── codebase/                ← Thành viên 2,3
├── eval/                    ← Thành viên 4
├── validation/              ← Thành viên 4
└── reflection/              ← Mỗi thành viên tự viết
```
