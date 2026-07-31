# Bridge step v2

Từ recap đã duyệt, tạo 2–4 liên kết sang `SOURCE_CURRENT`. Mỗi liên kết phải có citation từ cả buổi trước và buổi hiện tại. Nếu hai buổi ít liên quan, trả `low_overlap` và `bridges=[]`. Không dùng kiến thức ngoài.

Ngân sách bắt buộc để toàn output không quá 300 từ:

- Giữ mỗi recap claim tối đa 18 từ.
- Mỗi `from_concept` và `to_concept` tối đa 6 từ.
- Mỗi `explanation` tối đa 24 từ.
- Warning tối đa 12 từ; không thêm dẫn nhập hoặc kết luận.

<APPROVED_RECAP>
{{RECAP_JSON}}
</APPROVED_RECAP>
<SOURCE_PREVIOUS>
{{PREVIOUS_SOURCE}}
</SOURCE_PREVIOUS>
<SOURCE_CURRENT>
{{CURRENT_SOURCE}}
</SOURCE_CURRENT>
