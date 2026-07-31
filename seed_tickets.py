import pymongo
from datetime import datetime

client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["ai_qa_db"]

now = datetime.utcnow().isoformat() + "Z"

tickets = [
    {
        "id": "TKT-001",
        "user_email": "student_a@vinuni.edu.vn",
        "question": "Cho em hỏi học bổng 100% có áp dụng cho sinh viên năm nhất không ạ?",
        "reason": "Agent không chắc chắn vì thông tin học bổng có điều khoản ngoại lệ.",
        "status": "pending",
        "response": "",
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "TKT-002",
        "user_email": "nguyen.van.b@gmail.com",
        "question": "Tôi muốn xin bảo lưu kết quả thi khóa 3 để đăng ký khóa 4 được không? Thủ tục thế nào?",
        "reason": "Agent không tìm thấy quy định bảo lưu điểm thi trong sổ tay.",
        "status": "pending",
        "response": "",
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "TKT-003",
        "user_email": "hoang.mai@gmail.com",
        "question": "Con tôi lớp 12 thì có được tham gia khoá học này không? Cháu rất giỏi toán.",
        "reason": "Câu hỏi của phụ huynh cần sự tư vấn chuyên sâu của con người.",
        "status": "pending",
        "response": "",
        "created_at": now,
        "updated_at": now
    },
    {
        "id": "TKT-004",
        "user_email": "test_user@gmail.com",
        "question": "Em lỡ nộp nhầm file bài tập lên VLearn, giờ hệ thống báo hết hạn thì phải làm sao để nộp lại?",
        "reason": "Sự cố kỹ thuật cá nhân trên hệ thống cần admin can thiệp.",
        "status": "resolved",
        "response": "Chào bạn, Admin đã mở lại quyền nộp bài cho tài khoản của bạn. Hạn chót mới là 23:59 hôm nay nhé.",
        "created_at": now,
        "updated_at": now
    }
]

# Insert vào db
db["tickets"].insert_many(tickets)
print(f"Đã tạo thành công {len(tickets)} tickets mẫu vào CSDL để test.")
