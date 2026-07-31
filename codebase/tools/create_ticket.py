"""
Tool 13: create_ticket
Tạo support ticket khi AI không thể giải đáp.
"""
import json
import uuid
import os
from datetime import datetime

try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None

SCHEMA = {
    "type": "function",
    "function": {
        "name": "create_ticket",
        "description": (
            "Tạo một support ticket mới gửi cho Admin khi AI không thể giải đáp câu hỏi của người dùng, "
            "hoặc khi người dùng yêu cầu chuyển cho tư vấn viên/nhân viên hỗ trợ. "
            "Chỉ sử dụng khi thực sự cần sự can thiệp của con người."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "user_email": {
                    "type": "string",
                    "description": "Email của người dùng. Hãy hỏi người dùng nếu chưa biết, hoặc dùng 'unknown@user.com' nếu không thể xác định."
                },
                "question": {
                    "type": "string",
                    "description": "Nội dung câu hỏi hoặc yêu cầu cần hỗ trợ."
                },
                "reason": {
                    "type": "string",
                    "description": "Lý do vì sao AI không thể xử lý (ví dụ: Ngoài phạm vi, yêu cầu cấp quyền, ...)."
                }
            },
            "required": ["user_email", "question"]
        }
    }
}

def run(user_email: str, question: str, reason: str = "", **_) -> str:
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    mongo_db_name = os.getenv("MONGO_DB_NAME", "ai_hackathon_kb")
    
    if not MongoClient:
        return json.dumps({"error": "PyMongo không được cài đặt."})
        
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        db = client[mongo_db_name]
        
        ticket_id = str(uuid.uuid4())[:8]
        now_str = datetime.utcnow().isoformat() + "Z"
        
        new_ticket = {
            "id": ticket_id,
            "user_email": user_email,
            "question": question,
            "reason": reason,
            "status": "pending",
            "response": "",
            "created_at": now_str,
            "updated_at": now_str
        }
        db["tickets"].insert_one(new_ticket)
        return json.dumps({
            "success": True, 
            "ticket_id": ticket_id, 
            "message": f"Ticket {ticket_id} đã được tạo thành công và gửi tới Admin. Chúng tôi sẽ phản hồi sớm nhất qua email hoặc hiển thị trong danh sách ticket của bạn."
        }, ensure_ascii=False)
    except Exception as e:
        return json.dumps({"error": f"Lỗi tạo ticket: {str(e)}"}, ensure_ascii=False)
