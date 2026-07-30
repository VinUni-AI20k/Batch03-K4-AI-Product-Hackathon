"""Centralized LLM API connections."""

import json
import urllib.request
import urllib.error
from config import get_openai_api_key, get_openai_model

def call_openai_api(prompt: str, model: str = None, timeout: int = 60) -> tuple[str, dict]:
    """Call OpenAI API using HTTP and return (text_content, raw_response)."""
    api_key = get_openai_api_key()
    model = model or get_openai_model()
    
    body = {
        "model": model,
        "input": prompt,
        "reasoning": {"effort": "low"},
        "text": {"verbosity": "low"},
    }
    
    request = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            raw = json.loads(response.read())
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode(errors="replace")[:500]
        raise RuntimeError(f"OpenAI HTTP {exc.code}: {detail}") from exc
        
    text = raw.get("output_text") or "".join(
        part.get("text", "") for item in raw.get("output", []) for part in item.get("content", [])
    )
    return text.strip(), raw
