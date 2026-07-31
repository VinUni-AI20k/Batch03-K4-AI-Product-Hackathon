import sys
import os
from pathlib import Path
from typing import Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

class SlideFormatter:
    """
    Công cụ xuất bản báo cáo tóm tắt Slide dưới dạng Markdown hoặc lưu ra file.
    """

    @staticmethod
    def format_final_report(
        title: str,
        executive_summary: str,
        outline: str,
        detailed_slides_summary: str,
        action_items: str
    ) -> str:
        report_md = f"""# 📄 BÁO CÁO TÓM TẮT SLIDE BÀI GIẢNG

**Tên tài liệu:** `{title}`

---

## 🎯 1. TỔNG QUAN EXECUTIVE SUMMARY
{executive_summary.strip()}

---

## 🗺️ 2. BỐ CỤC & LUỒNG KIẾN THỨC (OUTLINE)
{outline.strip()}

---

## 🔍 3. CHI TIẾT NỘI DUNG THEO TỪNG SLIDE
{detailed_slides_summary.strip()}

---

## 💡 4. TỪ KHÓA & HÀNH ĐỘNG ĐỀ XUẤT (ACTION ITEMS / Q&A)
{action_items.strip()}

---
*Báo cáo được khởi tạo tự động bởi AI Slide Summary Agent.*
"""
        return report_md

    @staticmethod
    def save_markdown(content: str, output_path: str) -> str:
        path = Path(output_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return str(path.resolve())
