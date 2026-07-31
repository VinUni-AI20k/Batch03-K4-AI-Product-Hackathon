"""
Tool 12: campus_info
Tra cứu thông tin khuôn viên, cơ sở vật chất, bản đồ tại VinUni.
"""
import json
import re

SCHEMA = {
    "type": "function",
    "function": {
        "name": "campus_info",
        "description": (
            "Tra cứu thông tin về khuôn viên, cơ sở vật chất, tòa nhà, bãi gửi xe, "
            "căng tin, thư viện và hướng dẫn di chuyển tại VinUni. "
            "Dùng khi người dùng hỏi về địa điểm, vị trí, tiện ích tại trường."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "Địa điểm hoặc tiện ích cần tìm (ví dụ: 'phòng học', 'căng tin', 'bãi gửi xe', 'thư viện')."
                }
            },
            "required": ["location"]
        }
    }
}

CAMPUS_DB = {
    "căng tin": {
        "name": "Căng tin VinUni",
        "location": "Tầng 1, Tòa nhà G (Student Center)",
        "details": "Mở cửa từ 6:30 sáng đến 20:00 tối. Phục vụ ăn sáng, ăn trưa và ăn tối. Học viên dùng thẻ để thanh toán."
    },
    "bãi gửi xe": {
        "name": "Bãi gửi xe máy và ô tô",
        "location": "Hầm Tòa nhà chính hoặc bãi ngoài trời cạnh cổng phụ",
        "details": "Học viên được gửi xe miễn phí nếu đã đăng ký vé tháng hoặc dùng thẻ học viên."
    },
    "phòng học": {
        "name": "Khu vực Phòng học (Classrooms)",
        "location": "Tòa nhà E và Tòa nhà F",
        "details": "Các lớp AI Thực chiến thường diễn ra tại Tầng 2 hoặc Tầng 3 Tòa nhà E. Xem thông báo lịch học để biết phòng chính xác."
    },
    "thư viện": {
        "name": "Thư viện 24/7 VinUni",
        "location": "Trung tâm Tòa nhà chính",
        "details": "Mở cửa 24/7. Không gian yên tĩnh, có các phòng họp nhóm (cần đặt trước)."
    },
    "nhà vệ sinh": {
        "name": "Nhà vệ sinh",
        "location": "Cuối mỗi hành lang tại các tòa nhà",
        "details": "Sạch sẽ, đầy đủ tiện nghi ở mọi tầng."
    },
    "check-in": {
        "name": "Khu vực Lễ tân / Check-in",
        "location": "Sảnh chính Tòa nhà A",
        "details": "Cấp thẻ học viên, hỗ trợ thủ tục đầu vào."
    }
}

def run(location: str, **_) -> str:
    if not location.strip():
        return json.dumps({"error": "Vui lòng cung cấp địa điểm cần tìm."}, ensure_ascii=False)
        
    kw = location.lower().strip()
    matched = []
    
    # Match keyword
    for key, info in CAMPUS_DB.items():
        if key in kw or kw in key or any(word in info["name"].lower() or word in info["location"].lower() for word in kw.split() if len(word) > 2):
            matched.append(info)
            
    if not matched:
        return json.dumps({
            "found": 0,
            "location_query": location,
            "message": "Không tìm thấy thông tin chính xác. Vui lòng liên hệ lễ tân Tòa A để được hỗ trợ.",
            "available_locations": list(CAMPUS_DB.keys())
        }, ensure_ascii=False)
        
    return json.dumps({"found": len(matched), "results": matched}, ensure_ascii=False, indent=2)
