import logo from "./logo.svg";
import logo_full from "./logo_full.svg";
import logo_full_dark from "./logo_full_dark.svg";
import search_icon from "./search_icon.svg";
import user_icon from "./user_icon.svg";
import theme_icon from "./theme_icon.svg";
import send_icon from "./send_icon.svg";
import stop_icon from "./stop_icon.svg";
import mountain_img from "./mountain_img.jpg";
import menu_icon from "./menu_icon.svg";
import close_icon from "./close_icon.svg";
import bin_icon from "./bin_icon.svg";
import logout_icon from "./logout_icon.svg";
import diamond_icon from "./diamond_icon.svg";
import gallery_icon from "./gallery_icon.svg";

// 💡 ĐÃ LOẠI BỎ TOÀN BỘ CÁC DÒNG IMPORT AI_IMAGE BỊ LỖI

export const assets = {
    logo,
    logo_full,
    search_icon,
    user_icon,
    theme_icon,
    send_icon,
    stop_icon,
    mountain_img,
    menu_icon,
    close_icon,
    bin_icon,
    logout_icon,
    logo_full_dark,
    diamond_icon,
    gallery_icon
};

export const dummyUserData = {
    "_id": "689c6deed410acddc0d95a0e",
    "name": "Thành Đỗ",
    "email": "admin@example.com",
    "password": "$2b$10$VESVdPDjL5LF.KCU6jKyqeXNSLASAAfpR2kkIJExtMO.PJvZJAudy",
    "credits": 200,
};

// Cấu hình các gói tài nguyên cho hệ thống tra cứu văn bản
export const dummyPlans = [
    {
        _id: "basic",
        name: "Cơ bản",
        price: 0,
        credits: 100,
        features: ['100 lượt tra cứu văn bản', 'Hỗ trợ tiêu chuẩn', 'Truy cập mô hình Llama 3 8B']
    },
    {
        _id: "pro",
        name: "Chuyên nghiệp",
        price: 20,
        credits: 500,
        features: ['500 lượt tra cứu văn bản', 'Ưu tiên tốc độ xử lý', 'Truy cập mô hình nâng cao', 'Phân tích lịch sử hội thoại']
    }
];

// Lịch sử Chat mẫu chuẩn văn bản (Đã loại bỏ các phần hiển thị hình ảnh lỗi)
export const dummyChats = [
    {
        "_id": "689ccb9016a922dd57a23fce",
        "userId": "689c6deed410acddc0d95a0e",
        "name": "Tra cứu lịch làm việc",
        "messages": [
            {
                "isImage": false,
                "isPublished": false,
                "role": "user",
                "content": "Xin chào bot, cho hỏi quy định thời gian làm việc của công ty như thế nào?",
                "timestamp": 1755106415912,
            },
            {
                "isImage": false,
                "isPublished": false,
                "role": "assistant",
                "content": "Chào bạn! Theo quy định nội bộ của công ty ABC, thời gian làm việc hành chính bắt đầu từ **8:00 AM đến 5:30 PM**, từ thứ Hai đến thứ Sáu. Thời gian nghỉ trưa kéo dài từ **12:00 PM đến 1:30 PM**. Bạn có cần tra cứu thêm về quy định chấm công hay nghỉ phép không?",
                "timestamp": 1755106420723,
            }
        ],
        "createdAt": "2025-08-13T17:29:52.421Z",
        "updatedAt": "2025-08-14T09:39:19.046Z",
        "userName": "Thành Đỗ"
    },
    {
        "_id": Date.now(),
        "userId": "gs123456789",
        "name": "Cuộc hội thoại mới",
        "userName": "Thành Đỗ",
        "messages": [],
        "createdAt": "2025-08-13T17:29:52.421Z",
        "updatedAt": "2025-08-14T09:39:19.046Z",
    }
];

// Mảng này để rỗng vì hệ thống tập trung xử lý RAG văn bản tra cứu quy trình
export const dummyPublishedImages = [];