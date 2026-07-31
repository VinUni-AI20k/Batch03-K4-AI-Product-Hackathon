FROM python:3.11-slim

WORKDIR /app

# Thiết lập biến môi trường Python & Port mặc định cho Railway
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8080

# Cài đặt các gói hệ thống cần thiết
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Cài đặt thư viện Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose cổng service
EXPOSE 8080

# Chạy server FastAPI qua uvicorn trên backend server.py
CMD ["python", "codebase/backend/server.py"]
