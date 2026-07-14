import uuid
from datetime import datetime, timezone

def make_event(object_class, confidence, bbox, severity="medium", camera_id="cam_01"):
    return {
        "id": f"evt_{uuid.uuid4().hex[:8]}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "event_type": f"{object_class}_detected",
        "object_class": object_class,
        "confidence": round(confidence, 2),
        "bbox": {
            "x": int(bbox[0]),
            "y": int(bbox[1]),
            "width": int(bbox[2] - bbox[0]),
            "height": int(bbox[3] - bbox[1]),
        },
        "camera_id": camera_id,
        "severity": severity,
        "status": "new",
    }