import cv2
import time
from ultralytics import YOLO
from . import config
from .events import make_event

class Detector:
    def __init__(self):
        self.model = YOLO(config.MODEL_PATH)
        self.cap = cv2.VideoCapture(config.VIDEO_SOURCE)
        self.running = False
        self.last_frame = None
        self.fps = 0.0
        self.latency_ms = 0.0
        self.events = []
        self.last_event_time = {}
        self.event_cooldown = 3.0
        self.max_events = 100

    def start(self):
        if not self.cap.isOpened():
            self.cap = cv2.VideoCapture(config.VIDEO_SOURCE)
        self.running = True

    def stop(self):
        self.running = False
        self.last_frame = None
        self.fps = 0.0
        self.latency_ms = 0.0

    def process_frame(self):
        start_time = time.time()
        ret, frame = self.cap.read()
        if not ret:
            return None

        results = self.model(frame, verbose=False)
        now = time.time()

        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            name = self.model.names[cls_id]

            if conf < config.CONFIDENCE_THRESHOLD:
                continue

            xyxy = box.xyxy[0].tolist()
            mapped_class = config.map_class(name)

            x1, y1, x2, y2 = map(int, xyxy)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 0), 2)
            cv2.putText(frame, f"{mapped_class} {conf:.2f}", (x1, y1 - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 200, 0), 2)

            last_time = self.last_event_time.get(mapped_class, 0)
            if now - last_time >= self.event_cooldown:
                event = make_event(mapped_class, conf, xyxy)
                self.events.append(event)
                self.last_event_time[mapped_class] = now

        if len(self.events) > self.max_events:
            self.events = self.events[-self.max_events:]

        elapsed = time.time() - start_time
        self.latency_ms = elapsed * 1000
        self.fps = 1.0 / elapsed if elapsed > 0 else 0.0
        self.last_frame = frame

        return frame

    def get_status(self):
        return {
            "state": "running" if self.running else "stopped",
            "source": str(config.VIDEO_SOURCE),
            "fps": round(self.fps, 1),
            "latency_ms": round(self.latency_ms, 1),
        }

    def get_events(self):
        return list(reversed(self.events))