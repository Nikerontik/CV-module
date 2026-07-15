import cv2
import time
from ultralytics import YOLO
from . import config
from .events import make_event
from .logger import logger


class Detector:
    def __init__(self):
        self.model = YOLO(config.BASE_MODEL_PATH)
        self.ppe_model = YOLO(config.PPE_MODEL_PATH)
        self.fire_model = YOLO(config.FIRE_MODEL_PATH)
        self.cap = self._open_capture(config.VIDEO_SOURCE)
        self.running = False
        self.last_frame = None
        self.fps = 0.0
        self.latency_ms = 0.0
        self.events = []
        self.last_event_time = {}
        self.event_cooldown = 3.0
        self.max_events = 100

    def _open_capture(self, source):
        if isinstance(source, int):
            return cv2.VideoCapture(source, cv2.CAP_DSHOW)
        return cv2.VideoCapture(source)

    def start(self):
        if not self.cap.isOpened():
            self.cap = self._open_capture(config.VIDEO_SOURCE)
        self.running = True
        logger.info(f"Обработка началась из {config.VIDEO_SOURCE}")

    def stop(self):
        self.running = False
        self.last_frame = None
        self.fps = 0.0
        self.latency_ms = 0.0
        logger.info("Обработка остановлена")

    def _register_event(self, name, conf, xyxy, severity, now):
        last_time = self.last_event_time.get(name, 0)
        if now - last_time >= self.event_cooldown:
            event = make_event(name, conf, xyxy, severity=severity)
            self.events.append(event)
            self.last_event_time[name] = now
            logger.info(f"Событие создано: {name}, confidence={conf:.2f}, id={event['id']}")

    def process_frame(self):
        start_time = time.time()
        ret, frame = self.cap.read()

        if not ret:
            is_video_file = config.VIDEO_SOURCE != config.CAMERA_INDEX
            if is_video_file:
                self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = self.cap.read()
            if not ret:
                logger.error("Не удалось получить кадр из источника видео")
                self.running = False
                return None

        now = time.time()

        base_results = self.model(frame, verbose=False)
        for box in base_results[0].boxes:
            conf = float(box.conf[0])
            if conf < config.CONFIDENCE_THRESHOLD:
                continue
            name = self.model.names[int(box.cls[0])]
            mapped_class = config.map_class(name)
            if mapped_class is None:
                continue
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, xyxy)
            color = (0, 200, 0)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{mapped_class} {conf:.2f}", (x1, y1 - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            self._register_event(mapped_class, conf, xyxy, "medium", now)

        if config.PPE_CHECK_ENABLED:
            ppe_results = self.ppe_model(frame, verbose=False)
            for box in ppe_results[0].boxes:
                conf = float(box.conf[0])
                if conf < config.CONFIDENCE_THRESHOLD:
                    continue
                name = self.ppe_model.names[int(box.cls[0])]
                xyxy = box.xyxy[0].tolist()
                x1, y1, x2, y2 = map(int, xyxy)
                is_violation = "no" in name.lower()
                color = (0, 0, 220) if is_violation else (0, 200, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"{name} {conf:.2f}", (x1, y1 - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                if is_violation:
                    self._register_event(name, conf, xyxy, "high", now)

        fire_results = self.fire_model(frame, verbose=False)
        for box in fire_results[0].boxes:
            conf = float(box.conf[0])
            if conf < config.CONFIDENCE_THRESHOLD:
                continue
            name = self.fire_model.names[int(box.cls[0])]
            xyxy = box.xyxy[0].tolist()
            x1, y1, x2, y2 = map(int, xyxy)
            color = (0, 0, 255) if "fire" in name.lower() else (180, 180, 180)
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            cv2.putText(frame, f"{name} {conf:.2f}", (x1, y1 - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            self._register_event(name, conf, xyxy, "high", now)

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