import sys
import requests
import json

sys.stdout.reconfigure(encoding='utf-8')

url = "https://mkp-api.fptcloud.com/chat/completions"

token = "sk-H_YuLOl4y2dueOyIMJUFcq4X0FFF8MZg4-5u1QHlswQ="
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

data = {
    "model": "GLM-5.2",                           # Model name

    "messages": [                                      # List of message objects. Please update the System prompt to have the model respond appropriately
        {
            "role": "system",
            "content": "You are a helpful assistant capable of understanding a user's needs through conversation to recommend suitable services. Based on the conversation history and the user's last message, list services that can address the user's needs. Respond only in Vietnamese or English, matching the language of the user's input."
        },
        {
            "role": "user",
            "content": "Xin chào, bạn có thể giúp gì cho tôi?"
        }
    ],
    "stream": True                                      # Enable streaming
}

# Since stream=True, we need to handle streaming response
response = requests.post(url, headers=headers, data=json.dumps(data), stream=True)

# Process the streaming response, keeping only the final answer (skip reasoning_content)
answer = ""
for line in response.iter_lines():
    if line:
        # Skip the "data: " prefix if present
        line_text = line.decode('utf-8')
        if line_text.startswith('data: '):
            line_text = line_text[6:]

        # Skip empty lines or "[DONE]" message
        if line_text == "[DONE]":
            break

        try:
            # Parse the JSON response chunk
            json_response = json.loads(line_text)
            choices = json_response.get("choices") or []
            if choices:
                answer += choices[0]["delta"].get("content", "")
        except json.JSONDecodeError:
            # Handle non-JSON lines
            print(f"Cannot parse: {line_text}")

print(answer)