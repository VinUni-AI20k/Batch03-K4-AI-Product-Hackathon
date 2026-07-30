import os
from dotenv import load_dotenv

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CODEBASE_DIR = os.path.dirname(os.path.abspath(__file__))
GIAO_DIEN_DIR = os.path.join(CODEBASE_DIR, 'giao_dien')
DATA_DIR = os.path.join(BASE_DIR, 'data')
LOGS_DIR = os.path.join(BASE_DIR, 'logs')

# Load .env
env_file_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_file_path):
    load_dotenv(env_file_path)
else:
    load_dotenv()

# Server settings
PORT = int(os.getenv('PORT', 3000))

# OpenAI API Settings
def get_openai_api_key(override_key=None):
    if override_key and override_key.strip():
        return override_key.strip()
    key = os.getenv('OPENAI_API_KEY', '')
    return key.strip()

def get_openai_model():
    return os.getenv('OPENAI_MODEL', 'gpt-4o-mini')

# Ensure logs directory exists
os.makedirs(LOGS_DIR, exist_ok=True)
AI_LOGS_FILE = os.path.join(LOGS_DIR, 'ai_logs.json')
