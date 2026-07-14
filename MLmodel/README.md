# CV-модуль: ML-часть

## Установка

python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

## Получение модели

python download_model.py

Это скачает yolov8n.pt в models/ и экспортирует его в yolov8n.onnx.

## Запуск сервиса

uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload

## API

- GET /health — проверка работоспособности
- GET /status — статус обработки, FPS, latency
- GET /events — список событий
- POST /start — запуск обработки (камера)
- POST /stop — остановка обработки
- GET /frame/latest — последний обработанный кадр (JPEG)

## Источник видео

По умолчанию используется камера (индекс 0). Настраивается в src/config.py через VIDEO_SOURCE.