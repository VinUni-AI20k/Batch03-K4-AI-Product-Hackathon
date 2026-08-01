# Vlearn Agent — lối tắt. Dùng: make install | make run | make ui | make docker-up
.PHONY: install install-ingest run ui sync test docker-build docker-up docker-down

install:        ## Cài lõi + Voyage (Linux/macOS/WSL)
	bash install.sh

install-ingest: ## Cài kèm bộ xử lý PDF/PPTX/video (nặng)
	bash install.sh --ingest

run:            ## Chạy gateway (Telegram + Discord + scheduler)
	.venv/bin/learning-agent bot

ui:             ## Mở dashboard http://127.0.0.1:8321
	.venv/bin/learning-agent ui

sync:           ## Ingest tài liệu trong source_mirror/
	.venv/bin/learning-agent sync

test:           ## Chạy test
	.venv/bin/python -m pytest tests/ -q

docker-build:   ## Build image (thêm WITH_INGEST=1 để có Docling/Whisper)
	docker compose build

docker-up:      ## Bật bot + dashboard bằng docker compose
	docker compose up -d

docker-down:    ## Tắt
	docker compose down
