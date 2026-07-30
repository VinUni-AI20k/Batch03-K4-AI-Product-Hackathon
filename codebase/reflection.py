import os
import json

def get_team_reflections():
    """
    Module quản lý và tổng hợp Reflection cá nhân của các thành viên trong nhóm E402.
    """
    reflections = [
        {
            "member": "Nguyễn Phương Đông",
            "role": "AI Engineer & Technical Lead",
            "key_learnings": "Hiểu rõ tầm quan trọng của Human-In-The-Loop khi thiết kế AI Generator. Việc áp dụng HAX Guidelines G1 & G10 giúp giảm đáng kể hallucination trong sinh bài tập.",
            "challenges": "Xử lý ép kiểu JSON chuẩn từ LLM và xây dựng vòng lặp duyệt bài tập cho Lab Coach."
        },
        {
            "member": "Nguyễn Nhật Minh",
            "role": "Product Manager & Spec Lead",
            "key_learnings": "Nắm chắc tư duy JTBD và xây dựng Golden Set 20 case để đo đạc chất lượng bài lab.",
            "challenges": "Thu thập đúng 5 quote nguyên văn từ học viên và xác định lát cắt sản phẩm 1 câu."
        },
        {
            "member": "Trần Thị Kiều Trang",
            "role": "Frontend & UX Specialist",
            "key_learnings": "Xây dựng giao diện VLearn 2-Role mượt mà với Vanilla CSS/JS mang lại trải nghiệm trực quan cho cả học viên và Lab Coach.",
            "challenges": "Tối ưu hóa giao diện hiển thị các file code Mini Project và quy trình duyệt bài đa bước."
        }
    ]
    return reflections

if __name__ == "__main__":
    print("=== BÁO CÁO REFLECTION NHÓM E402 ===")
    for r in get_team_reflections():
        print(f"\n👤 Thành viên: {r['member']} ({r['role']})")
        print(f"  💡 BÀI HỌC: {r['key_learnings']}")
        print(f"  ⚠️ THÁCH THỨC: {r['challenges']}")
