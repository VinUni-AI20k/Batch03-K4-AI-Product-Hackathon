import json
import urllib.request
import urllib.error
import datetime
import os
from config import get_openai_api_key, get_openai_model, AI_LOGS_FILE, LOGS_DIR

def save_ai_log(action_type, prompt_data, response_data, status="SUCCESS", error_msg=None):
    """
    Lưu log tương tác AI vào file JSON để theo dõi và kiểm tra trả lời (AI Call Logging)
    """
    log_entry = {
        "timestamp": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "action_type": action_type,
        "status": status,
        "prompt": prompt_data,
        "response": response_data,
        "error": error_msg
    }

    logs = []
    if os.path.exists(AI_LOGS_FILE):
        try:
            with open(AI_LOGS_FILE, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        except Exception:
            logs = []

    logs.insert(0, log_entry)  # Thêm log mới lên đầu
    # Giữ tối đa 100 logs gần nhất
    logs = logs[:100]

    try:
        with open(AI_LOGS_FILE, 'w', encoding='utf-8') as f:
            json.dump(logs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Lỗi ghi AI log: {e}")

def get_all_ai_logs():
    """Lấy danh sách log AI hiện có"""
    if os.path.exists(AI_LOGS_FILE):
        try:
            with open(AI_LOGS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def call_openai_json(messages, override_key=None, temperature=0.7, action_name="OPENAI_CALL"):
    """
    Gọi OpenAI API Chat Completions và ép kiểu đầu ra JSON chuẩn.
    Lưu vết log phản hồi chi tiết vào ai_logs.json.
    """
    api_key = get_openai_api_key(override_key)
    model = get_openai_model()

    if not api_key or api_key == 'sk-proj-your-openai-api-key-here':
        err_str = "Chưa cấu hình OPENAI_API_KEY hợp lệ trong file .env hoặc giao diện!"
        save_ai_log(action_name, messages, None, status="FAILED", error_msg=err_str)
        raise ValueError(err_str)

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "response_format": {"type": "json_object"}
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            content = res_data['choices'][0]['message']['content']
            
            # Save log
            save_ai_log(action_name, messages, content, status="SUCCESS")
            return content
    except urllib.error.HTTPError as e:
        err_body = e.read().decode('utf-8') if e.fp else str(e)
        save_ai_log(action_name, messages, None, status="HTTP_ERROR", error_msg=err_body)
        raise RuntimeError(f"Lỗi OpenAI API HTTP {e.code}: {err_body}")
    except Exception as e:
        save_ai_log(action_name, messages, None, status="ERROR", error_msg=str(e))
        raise e
