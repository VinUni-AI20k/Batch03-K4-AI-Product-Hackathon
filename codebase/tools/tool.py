from .pptx_to_md import convert_pptx_to_markdown
from .ask_coach import ask_lab_coach

class ToolRegistry:
    def __init__(self):
        self.tools = {
            "convert_pptx_to_markdown": {
                "func": convert_pptx_to_markdown,
                "description": "Chuyển đổi bài giảng Slide PPTX sang Markdown để AI dễ đọc và phân tích."
            },
            "ask_lab_coach": {
                "func": ask_lab_coach,
                "description": "Hỏi lại Lab Coach khi gặp thắc mắc hoặc cần sửa đổi bổ sung bài lab."
            }
        }

    def execute_tool(self, tool_name, **kwargs):
        if tool_name in self.tools:
            return self.tools[tool_name]["func"](**kwargs)
        raise ValueError(f"Tool {tool_name} không tồn tại trong ToolRegistry.")

# Global instance
registry = ToolRegistry()
