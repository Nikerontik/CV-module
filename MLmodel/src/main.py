import threading
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import cv2

from .detector import Detector
from . import config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = Detector()
_worker_thread = None

def _worker_loop():
    while detector.running:
        detector.process_frame()
        time.sleep(0.01)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/status")
def status():
    return detector.get_status()

@app.get("/events")
def events():
    return detector.get_events()

@app.post("/start")
def start():
    global _worker_thread
    detector.start()
    if _worker_thread is None or not _worker_thread.is_alive():
        _worker_thread = threading.Thread(target=_worker_loop, daemon=True)
        _worker_thread.start()
    return {"status": "started"}

@app.post("/stop")
def stop():
    detector.stop()
    return {"status": "stopped"}

@app.get("/frame/latest")
def latest_frame():
    if detector.last_frame is None:
        return Response(status_code=204)
    _, buffer = cv2.imencode(".jpg", detector.last_frame)
    return Response(content=buffer.tobytes(), media_type="image/jpeg")