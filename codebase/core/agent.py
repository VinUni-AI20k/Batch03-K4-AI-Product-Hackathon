# core/agent.py
import os
import json
from env_loader import get_active_provider
from prompts.base_prompt import BASE_SYSTEM_INSTRUCTION
from core.tools import AVAILABLE_TOOLS, TOOL_REGISTRY

def run_agent(user_message: str) -> str:
    provider = get_active_provider()
    if not provider:
        raise ValueError("Không tìm thấy bất kỳ API Key hợp lệ nào trong file .env")

    if provider == "gemini":
        from google import genai
        from google.genai import types
        
        client = genai.Client()
        config = types.GenerateContentConfig(
            system_instruction=BASE_SYSTEM_INSTRUCTION,
            tools=AVAILABLE_TOOLS,
            temperature=0.0
        )
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=user_message,
            config=config
        )
        return response.text

    elif provider in ["openai", "deepseek"]:
        from openai import OpenAI
        
        # Cấu hình endpoint cho DeepSeek nếu có key DeepSeek
        if provider == "deepseek":
            client = OpenAI(
                api_key=os.getenv("DEEPSEEK_API_KEY"),
                base_url="https://api.deepseek.com"
            )
            model_name = "deepseek-chat"
        else:
            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            model_name = "gpt-4o-mini"

        # Định nghĩa schemas cho OpenAI Tool Call
        openai_tools = [
            {
                "type": "function",
                "function": {
                    "name": "load_slide_content",
                    "description": "Đọc nội dung của một trang slide từ tài liệu Day 1 hoặc Day 2.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "day_code": {"type": "string", "description": "Chỉ nhận giá trị 'd1' hoặc 'd2'"},
                            "page_num": {"type": "integer", "description": "Số trang cần đọc"}
                        },
                        "required": ["day_code", "page_num"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "get_glossary_term",
                    "description": "Tra cứu định nghĩa chuẩn mực của các thuật ngữ chuyên môn trong khóa học.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "term": {"type": "string", "description": "Tên thuật ngữ chuyên môn"}
                        },
                        "required": ["term"]
                    }
                }
            }
        ]

        messages = [
            {"role": "system", "content": BASE_SYSTEM_INSTRUCTION},
            {"role": "user", "content": user_message}
        ]

        # Lượt gọi thứ nhất
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            tools=openai_tools,
            temperature=0.0
        )
        
        response_message = response.choices[0].message
        tool_calls = response_message.tool_calls

        # Nếu model yêu cầu gọi tool
        if tool_calls:
            messages.append(response_message)
            for tool_call in tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.argv if hasattr(tool_call.function, 'argv') else tool_call.function.arguments)
                
                # Thực thi hàm từ Registry
                function_to_call = TOOL_REGISTRY[function_name]
                tool_output = function_to_call(**function_args)
                
                messages.append({
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": tool_output,
                })
            
            # Lượt gọi thứ hai để tổng hợp kết quả
            second_response = client.chat.completions.create(
                model=model_name,
                messages=messages,
                temperature=0.0
            )
            return second_response.choices[0].message.content

        return response_message.content

    elif provider == "claude":
        import anthropic

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        model_name = "claude-opus-5"

        # Tool schemas theo format Anthropic (input_schema, không có wrapper type:function)
        claude_tools = [
            {
                "name": "load_slide_content",
                "description": "Đọc nội dung của một trang slide từ tài liệu Day 1 hoặc Day 2.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "day_code": {"type": "string", "description": "Chỉ nhận giá trị 'd1' hoặc 'd2'"},
                        "page_num": {"type": "integer", "description": "Số trang cần đọc"}
                    },
                    "required": ["day_code", "page_num"]
                }
            },
            {
                "name": "get_glossary_term",
                "description": "Tra cứu định nghĩa chuẩn mực của các thuật ngữ chuyên môn trong khóa học.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "term": {"type": "string", "description": "Tên thuật ngữ chuyên môn"}
                    },
                    "required": ["term"]
                }
            }
        ]

        messages = [{"role": "user", "content": user_message}]

        # Lượt gọi thứ nhất
        response = client.messages.create(
            model=model_name,
            system=BASE_SYSTEM_INSTRUCTION,
            messages=messages,
            tools=claude_tools,
            temperature=0.0,
            max_tokens=4096,
        )

        # Vòng lặp tool use: Claude có thể yêu cầu nhiều tool tuần tự
        while response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})

            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    function_name = block.name
                    function_args = block.input
                    function_to_call = TOOL_REGISTRY[function_name]
                    tool_output = function_to_call(**function_args)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": tool_output,
                    })

            messages.append({"role": "user", "content": tool_results})
            response = client.messages.create(
                model=model_name,
                system=BASE_SYSTEM_INSTRUCTION,
                messages=messages,
                tools=claude_tools,
                temperature=0.0,
                max_tokens=4096,
            )

        # Ghép tất cả text blocks trong content cuối cùng
        return "".join(
            block.text for block in response.content if hasattr(block, "text")
        )