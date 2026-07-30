# EDA VLearn AI Tutor

Notebook `vlearn_ai_tutor_eda.ipynb` ghép dữ liệu theo từng lượt hỏi–đáp, kiểm tra
chất lượng dữ liệu và sàng lọc các pain signal có thể kiểm lại.

- Báo cáo đề xuất bài toán: `bao-cao-de-xuat-bai-toan.md`

## Chạy bằng uv

```bash
uv sync
uv run jupyter lab
```

Mở `eda/vlearn_ai_tutor_eda.ipynb`, chọn kernel Python trong `.venv` nếu Jupyter
chưa tự chọn, rồi chạy `Run All`.

Notebook tự tìm file CSV theo vị trí tương đối từ root của dự án. Có thể chỉ định
file khác bằng biến môi trường:

```bash
VLEARN_CHATLOG_CSV=/duong/dan/chatlog.csv uv run jupyter lab
```

## Lưu ý diễn giải

- Các cột `pain_*` là heuristic để xếp hàng ưu tiên đọc tay, không phải nhãn đúng/sai.
- Tỷ lệ phải báo cùng mẫu số và phương pháp đếm.
- Khi đưa bằng chứng vào repo nộp bài, chỉ dùng ID ẩn danh và trích đoạn ngắn; không
  xuất hoặc commit lại toàn bộ data pack.
