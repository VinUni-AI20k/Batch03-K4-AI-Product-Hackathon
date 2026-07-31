import json
import requests
from typing import Dict, Any

# Định nghĩa schema cho OpenAI Function Calling
SCHEMA = {
    "type": "function",
    "function": {
        "name": "get_course_schedule",
        "description": "Lấy thông tin lịch trình, sự kiện và các mốc thời gian quan trọng của khóa học AI Thực Chiến. Gọi hàm này khi người dùng hỏi về lịch học, ngày khai giảng, workshop, hoặc checkpoint.",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        }
    }
}

def run(**kwargs) -> str:
    """
    Gọi API nội bộ để lấy danh sách lịch trình khóa học.
    Trả về string dạng JSON cho LLM.
    """
    try:
        # Gọi trực tiếp API nội bộ (đang chạy cùng domain/port)
        response = requests.get("http://localhost:8000/api/schedules", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            schedules = data.get("schedules", [])
            
            if not schedules:
                return {"status": "success", "message": "Hiện tại chưa có lịch trình nào được lên kế hoạch."}
            
            # Format kết quả trả về cho AI đọc dễ hiểu
            formatted_schedule = "LỊCH TRÌNH KHÓA AI THỰC CHIẾN:\n"
            for ev in schedules:
                formatted_schedule += f"- [{ev['date']}] {ev['title']} (Địa điểm: {ev['location']})\n"
                formatted_schedule += f"  Chi tiết: {ev['description']}\n"
            
            return json.dumps({
                "status": "success",
                "schedule_details": formatted_schedule
            })
        else:
            return json.dumps({
                "status": "error",
                "message": f"Không thể lấy lịch trình. HTTP Status: {response.status_code}"
            })
    except Exception as e:
        return json.dumps({
            "status": "error",
            "message": f"Lỗi hệ thống khi gọi API lịch trình: {str(e)}"
        })
