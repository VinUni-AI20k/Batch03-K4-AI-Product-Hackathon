# Git workflow nhanh cho nhóm

Tài liệu này thống nhất cách cộng tác trên repo: mỗi đầu việc dùng một branch ngắn hạn, thay đổi được review qua Pull Request (PR), và chỉ merge code đã kiểm tra vào `main`.

## Quy ước chung

- `main` luôn là phiên bản ổn định và có thể demo.
- Không commit trực tiếp lên `main`.
- Mỗi branch chỉ giải quyết **một đầu việc**.
- Commit nhỏ, có nội dung rõ ràng; không gom thay đổi không liên quan.
- Ít nhất một thành viên khác review PR trước khi merge.
- Không commit API key, mật khẩu, file `.env`, dữ liệu cá nhân, hoặc bản sao data pack vào repo nộp bài.

## Quy trình hằng ngày

### 1. Lấy phiên bản mới nhất

```bash
git switch main
git pull --ff-only origin main
```

Luôn làm bước này trước khi tạo branch mới.

### 2. Tạo branch cho đầu việc

```bash
git switch -c <loai>/<mo-ta-ngan>
```

Loại branch nên dùng:

| Loại | Dùng cho | Ví dụ |
|---|---|---|
| `feature/` | Chức năng mới | `feature/chatbot-demo` |
| `fix/` | Sửa lỗi | `fix/empty-response` |
| `docs/` | Spec, README, tài liệu | `docs/update-ai-spec` |
| `eval/` | Golden set, đánh giá | `eval/add-edge-cases` |
| `chore/` | Cấu hình, việc bảo trì | `chore/update-gitignore` |

Tên branch dùng chữ thường và dấu gạch ngang; không dùng dấu cách.

### 3. Làm việc và commit

```bash
git status
git diff
git add <duong-dan-file>
git diff --staged
git commit -m "<loai>: <mo-ta-ngan>"
```

Chỉ `git add` đúng file thuộc đầu việc. Tránh `git add .` khi thư mục có file dữ liệu, log hoặc file tạm.

Ví dụ commit:

```text
feat: add tutor response generator
fix: handle empty transcript input
docs: clarify quality bar in spec
eval: add ten risky conversation cases
```

Trước khi push, chạy cách kiểm tra phù hợp với phần đã sửa (test, lint, mở thử prototype, kiểm tra link Markdown, hoặc đọc lại spec).

### 4. Push branch và mở PR

```bash
git push -u origin <ten-branch>
```

Mở PR từ branch vào `main`. Nội dung PR ngắn gọn:

```md
## Thay đổi
- Đã làm gì?

## Cách kiểm tra
- Reviewer chạy hoặc đọc gì?

## Lưu ý
- Giới hạn, phần mock, rủi ro hoặc việc còn lại.
```

Nếu PR ảnh hưởng đến `spec.md`, `eval/`, dữ liệu hoặc luồng demo, gắn reviewer phụ trách phần đó. Không tự merge khi review chưa hoàn tất hoặc CI/test đang lỗi.

### 5. Cập nhật branch khi `main` đã thay đổi

Commit hoặc stash phần đang làm, sau đó:

```bash
git fetch origin
git merge origin/main
```

Nếu có conflict:

1. Chạy `git status` để xem file xung đột.
2. Trao đổi với người sở hữu phần nội dung liên quan; không chọn một phía theo phỏng đoán.
3. Sửa các vùng có `<<<<<<<`, `=======`, `>>>>>>>`.
4. Kiểm tra lại rồi hoàn tất:

```bash
git add <file-da-sua>
git commit
git push
```

Muốn hủy lần merge đang xử lý:

```bash
git merge --abort
```

### 6. Sau khi PR được merge

```bash
git switch main
git pull --ff-only origin main
git branch -d <ten-branch>
```

Tạo branch mới cho đầu việc tiếp theo; không tái sử dụng branch đã merge.

## Checklist trước khi yêu cầu review

- [ ] Thay đổi đúng phạm vi của một đầu việc.
- [ ] Không có secret, `.env`, dữ liệu cá nhân hoặc file tạm.
- [ ] Không đưa nguyên văn dài từ data pack vào repo nộp bài; dùng mã đoạn/mã hội thoại và trích dẫn tối thiểu.
- [ ] Đã kiểm tra `git diff` và `git diff --staged`.
- [ ] Prototype/test liên quan chạy được, hoặc PR giải thích rõ vì sao chưa chạy.
- [ ] README/spec được cập nhật nếu hành vi hay quyết định sản phẩm thay đổi.
- [ ] PR ghi rõ phần nào đang mock và các giới hạn đã biết.

## Khi commit nhầm

Chưa push và chỉ muốn sửa commit gần nhất:

```bash
git add <file-can-bo-sung>
git commit --amend
```

Đã push hoặc commit nằm trên branch dùng chung: **không** dùng `reset` hay force-push. Tạo commit đảo ngược an toàn:

```bash
git revert <commit-id>
git push
```

Nếu secret đã bị commit, xóa file khỏi Git là chưa đủ: báo ngay cho nhóm, thu hồi/đổi secret, rồi nhờ maintainer xử lý lịch sử Git.

## Sơ đồ ngắn

```text
main mới nhất
    │
    ├── tạo branch → sửa → kiểm tra → commit → push
    │                                      │
    └──────────────────── PR + review ─────┘
                                           │
                                      merge vào main
```

## Remote `upstream` của repo này

`origin` là repo làm việc của nhóm. `upstream` trỏ đến repo nguồn của ban tổ chức và chỉ dùng khi maintainer chủ động đồng bộ cập nhật:

```bash
git remote -v
git fetch upstream
```

Không push bài làm lên `upstream`. Nếu cần lấy cập nhật từ repo nguồn, maintainer nên tạo một branch riêng, merge `upstream/main`, kiểm tra thay đổi, rồi mở PR vào `main`.
