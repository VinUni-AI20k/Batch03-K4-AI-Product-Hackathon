# --- Stage 1: Build Frontend ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
RUN npm run build

# --- Stage 2: Build Backend ---
FROM python:3.13-slim AS backend-builder
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# --- Stage 3: Final Image ---
FROM python:3.13-slim
WORKDIR /app

# Cài đặt Nginx và Supervisor để quản lý nhiều process
RUN apt-get update && apt-get install -y nginx supervisor && rm -rf /var/lib/apt/lists/*

# Copy kết quả build Frontend từ Stage 1
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# Copy code Backend và dependencies từ Stage 2
COPY --from=backend-builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY backend /app/backend
COPY data /app/data

# Cấu hình Nginx
RUN echo 'server { \
    listen 80; \
    location / { \
        root /var/www/html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://127.0.0.1:8000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
    } \
    location /docs { \
        proxy_pass http://127.0.0.1:8000/docs; \
    } \
}' > /etc/nginx/sites-available/default

# Cấu hình Supervisor để chạy cả FastAPI và Nginx
RUN echo '[supervisord] \
nodaemon=true \
user=root \
\
[program:nginx] \
command=/usr/sbin/nginx -g "daemon off;" \
autostart=true \
autorestart=true \
\
[program:backend] \
command=sh -c "cd /app/backend && uvicorn app.main:app --host 127.0.0.1 --port 8000" \
autostart=true \
autorestart=true' > /etc/supervisor/conf.d/supervisord.conf

# Environment variables
ENV PYTHONPATH=/app/backend
ENV PYTHONUNBUFFERED=1
ENV PORT=80

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
