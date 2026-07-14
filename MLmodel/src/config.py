VIDEO_SOURCE = 0
MODEL_PATH = "models/yolov8n.pt"
CONFIDENCE_THRESHOLD = 0.5
FRAME_SKIP = 1
API_PORT = 8000
SAVE_EVENT_FRAMES = True
EVENTS_DIR = "../data/events"

VEHICLE_CLASSES = {"car", "truck", "bus", "motorcycle", "bicycle", "train", "airplane", "boat"}

def map_class(name: str) -> str:
    if name == "person":
        return "person"
    if name in VEHICLE_CLASSES:
        return "vehicle"
    return name