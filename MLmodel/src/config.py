USE_CAMERA = True
CAMERA_INDEX = 0
VIDEO_FILE = "videos/test.mp4"

VIDEO_SOURCE = CAMERA_INDEX if USE_CAMERA else VIDEO_FILE

BASE_MODEL_PATH = "models/yolov8n.pt"
PPE_MODEL_PATH = "models/ppe.pt"
FIRE_MODEL_PATH = "models/fire_smoke.pt"

CONFIDENCE_THRESHOLD = 0.6
FRAME_SKIP = 2
API_PORT = 8000
SAVE_EVENT_FRAMES = True
EVENTS_DIR = "../data/events"

PPE_CHECK_ENABLED = True

VEHICLE_CLASSES = {"car", "truck", "bus", "motorcycle", "bicycle", "train", "airplane", "boat"}
ALLOWED_CLASSES = {"person"} | VEHICLE_CLASSES


def map_class(name: str) -> str | None:
    if name == "person":
        return "person"
    if name in VEHICLE_CLASSES:
        return "vehicle"
    return None