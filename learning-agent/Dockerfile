# Vlearn Agent — Docker image.
#   Mặc định: lõi + Voyage embeddings (nhẹ, build nhanh). Nạp file .md/.txt/.html + knowledge pack OK.
#   Xử lý PDF/PPTX/video: build với --build-arg WITH_INGEST=1 (kéo Docling/Whisper, image nặng vài GB).
FROM python:3.12-slim

ARG WITH_INGEST=0
ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1

# ffmpeg cho audio/video; git cho knowledge pack + self-update
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY pyproject.toml README.md ./
COPY src ./src
RUN pip install --upgrade pip && pip install -e '.[voyage]' \
    && if [ "$WITH_INGEST" = "1" ]; then pip install -e '.[ingest]'; fi

# phần còn lại (skills, addons, config, SOUL, vault mẫu)
COPY . .

EXPOSE 8321
# mặc định chạy gateway; đổi command để chạy ui/sync (xem docker-compose.yml)
CMD ["learning-agent", "bot"]
