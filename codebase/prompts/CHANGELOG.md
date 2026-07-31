# Prompt changelog

| Version | Trạng thái | Thay đổi | Lý do |
|---|---|---|---|
| v1 | Baseline cho Round 1 | Grounding, citation hai phía, fallback cơ bản | Baseline bị khóa trước khi chạy Round 1 |
| v2 | Chốt cho Round 2 | Thêm ngân sách: claim ≤18 từ, concept ≤6 từ, explanation ≤24 từ, warning ≤12 từ | Round 1 có 3/4 failure do output vượt giới hạn 300 từ; đây là failure lặp nhiều nhất |

Không thay đổi quality bar giữa hai phiên bản. Hash chính xác được runner ghi trong từng result.

Ghi chú môi trường chạy 31/07: baseline dự kiến dùng `gemini-2.5-flash`, nhưng API trả 404 “no longer available to new users”. `gemini-3.6-flash` smoke pass nhưng project free tier chỉ có 20 request/ngày, không đủ cho pipeline hai bước 22 case. Hai round vì vậy dùng cùng model stable `gemini-3.1-flash-lite`; prompt v1/v2 và quality bar không đổi.
