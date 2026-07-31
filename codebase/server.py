import http.server
import socketserver
import os
import sys
import json

# Import custom modular components
from config import PORT, GIAO_DIEN_DIR, CODEBASE_DIR, BASE_DIR, get_openai_api_key, get_openai_model
from llm import call_openai_json, get_all_ai_logs, save_ai_log
from prompt import (
    MINI_PROJECT_GENERATOR_SYSTEM_PROMPT,
    LAB_COACH_REVISION_PROMPT,
    REACT_AGENT_RUNNER_PROMPT
)
from tools import convert_pptx_to_markdown, ask_lab_coach, registry
from reflection import get_team_reflections


class VLearnRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve static files from giao_dien directory
        super().__init__(*args, directory=GIAO_DIEN_DIR, **kwargs)

    def do_GET(self):
        # API 1: System Status
        if self.path == '/api/status':
            key = get_openai_api_key()
            has_key = bool(key and key != 'sk-proj-your-openai-api-key-here')
            model = get_openai_model()
            
            res_data = {
                "status": "ok",
                "has_env_key": has_key,
                "model": model,
                "architecture": "Mini Project Architecture + Human-in-the-Loop",
                "message": "Real OpenAI API & Modular Backend Ready" if has_key else "Missing OPENAI_API_KEY"
            }
            self.send_json_response(res_data)
            return

        # API 2: Get AI Logs
        if self.path == '/api/logs':
            logs = get_all_ai_logs()
            self.send_json_response(logs)
            return

        # API 3: Get Team Reflections
        if self.path == '/api/reflections':
            reflections = get_team_reflections()
            self.send_json_response({"success": True, "reflections": reflections})
            return

        # Fallback file serving
        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else '{}'
        
        try:
            data = json.loads(body)
        except Exception:
            data = {}

        # API 4: Generate Mini Project Codelab via OpenAI JSON Call
        if self.path == '/api/generate_minicodelab':
            self.handle_generate_minicodelab(data)
            return

        # API 5: Human-In-The-Loop Revision (Lab Coach Feedback Loop)
        if self.path == '/api/revise_minicodelab':
            self.handle_revise_minicodelab(data)
            return

        # API 6: Run ReAct Agent Sandbox
        if self.path == '/api/run_agent':
            self.handle_run_agent(data)
            return

        self.send_error(404, "API Endpoint Not Found")

    def handle_generate_minicodelab(self, data):
        morning_slide = data.get('morning_slide', 'Day 4: ReAct Agent Architecture')
        afternoon_repo = data.get('afternoon_repo', 'github.com/vlearn/day4-research-agent-lab')
        readme_content = data.get('readme_content', '').strip()
        rules = data.get('rules', 'Mini Project với 3 file Python')
        user_key = data.get('api_key', '').strip()

        # 1. Trích xuất text từ Slide PPTX bằng tool pptx_to_md
        slide_markdown_content = convert_pptx_to_markdown(morning_slide)

        # 2. Giới hạn độ dài README.md để tiết kiệm token tối đa (chỉ lấy phần nội dung chính)
        if readme_content:
            trimmed_readme = readme_content[:3000] + ("\n... [Đã cắt ngắn để tiết kiệm token]" if len(readme_content) > 3000 else "")
        else:
            trimmed_readme = f"Tên Repo bài lab chiều: {afternoon_repo}. (Chỉ phân tích tên repo và mô tả tổng quan)."

        user_message = (
            f"=== 1. NỘI DUNG SLIDE BÀI GIẢNG SÁNG (Chuyển đổi từ file PPTX) ===\n{slide_markdown_content}\n\n"
            f"=== 2. NỘI DUNG FILE README.MD BÀI LAB CHIỀU (Chỉ đọc README.md để tối ưu token) ===\n{trimmed_readme}\n\n"
            f"=== 3. RÀNG BUỘC & PROMPT POLICY ===\n{rules}\n\n"
            f"Hãy sinh 1 bài Mini Project Codelab hoàn chỉnh (gồm các file code, giải thích và lệnh chạy) bằng tiếng Việt."
        )


        messages = [
            {"role": "system", "content": MINI_PROJECT_GENERATOR_SYSTEM_PROMPT},
            {"role": "user", "content": user_message}
        ]

        try:
            raw_response = call_openai_json(messages, override_key=user_key if user_key else None, action_name="GENERATE_MINI_PROJECT")
            parsed_lab = json.loads(raw_response)
            self.send_json_response({"success": True, "lab": parsed_lab})
        except Exception as e:
            self.send_json_response({
                "success": False,
                "error": str(e),
                "hint": "Vui lòng kiểm tra file .env hoặc API Key."
            }, status=500)

    def handle_revise_minicodelab(self, data):
        feedback = data.get('feedback', '')
        current_lab = data.get('current_lab', {})
        user_key = data.get('api_key', '').strip()

        revision_user_message = LAB_COACH_REVISION_PROMPT.format(
            feedback=feedback,
            current_lab_json=json.dumps(current_lab, ensure_ascii=False, indent=2)
        )

        messages = [
            {"role": "system", "content": MINI_PROJECT_GENERATOR_SYSTEM_PROMPT},
            {"role": "user", "content": revision_user_message}
        ]

        try:
            raw_response = call_openai_json(messages, override_key=user_key if user_key else None, action_name="HUMAN_IN_LOOP_REVISION")
            parsed_lab = json.loads(raw_response)
            parsed_lab["status"] = "Dự thảo đã chỉnh sửa theo phản hồi"
            self.send_json_response({"success": True, "lab": parsed_lab})
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=500)

    def handle_run_agent(self, data):
        code_input = data.get('code_input', '')
        user_key = data.get('api_key', '').strip()

        messages = [
            {"role": "system", "content": REACT_AGENT_RUNNER_PROMPT},
            {"role": "user", "content": f"Chạy thực thi đoạn code dự án này:\n\n{code_input}"}
        ]

        try:
            raw_response = call_openai_json(messages, override_key=user_key if user_key else None, action_name="RUN_SANDBOX_AGENT")
            parsed_output = json.loads(raw_response)
            
            output_str = parsed_output.get('full_log') or (
                f"[THOUGHT] {parsed_output.get('thought', '')}\n"
                f"[ACTION] {parsed_output.get('action', '')}\n"
                f"[OBSERVATION] {parsed_output.get('observation', '')}\n"
                f"[FINAL ANSWER] {parsed_output.get('final_answer', '')}"
            )
            self.send_json_response({"success": True, "output": output_str, "data": parsed_output})
        except Exception as e:
            self.send_json_response({"success": False, "error": str(e)}, status=500)

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    print(f"🚀 VLearn Modular Backend Server running on http://localhost:{PORT}")
    print(f"📁 Serving UI from: {GIAO_DIEN_DIR}")
    print(f"🔑 API Key Status: {'Ready' if get_openai_api_key() else 'Not Configured'}")

    try:
        with ReusableTCPServer(("", PORT), VLearnRequestHandler) as httpd:
            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print("\nServer shut down gracefully.")
                sys.exit(0)
    except OSError as e:
        if e.errno == 98:
            print(f"\n⚠️ Cổng {PORT} hiện đang được sử dụng bởi server đang chạy ngầm!")
            print(f"👉 Bạn có thể truy cập ứng dụng ngay tại: http://localhost:{PORT}")
            print(f"👉 Nếu muốn tắt tiến trình cũ để chạy lại, hãy gõ lệnh:")
            print(f"   fuser -k {PORT}/tcp  (hoặc pkill -f server.py)\n")
        else:
            raise e


