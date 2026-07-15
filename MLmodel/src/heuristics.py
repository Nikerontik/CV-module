import numpy as np
import cv2

PPE_COLOR_RANGES = [
    ((15, 80, 100), (35, 255, 255)),    # желтый
    ((0, 80, 100), (10, 255, 255)),     # красный (низкий hue)
    ((170, 80, 100), (180, 255, 255)),  # красный (высокий hue)
    ((100, 80, 100), (130, 255, 255)),  # синий
    ((5, 60, 150), (20, 255, 255)),     # оранжевый
    ((0, 0, 180), (180, 40, 255)),      # белый/светлый
]

MIN_PPE_PIXEL_RATIO = 0.15
HEAD_ZONE_RATIO = 0.25


def crop_bbox(frame, bbox):
    x1, y1, x2, y2 = map(int, bbox)
    h, w = frame.shape[:2]
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(w, x2), min(h, y2)
    if x2 <= x1 or y2 <= y1:
        return None
    return frame[y1:y2, x1:x2]


def has_ppe(frame, bbox):
    crop = crop_bbox(frame, bbox)
    if crop is None or crop.size == 0:
        return False

    head_height = max(1, int(crop.shape[0] * HEAD_ZONE_RATIO))
    head_crop = crop[0:head_height, :]

    hsv = cv2.cvtColor(head_crop, cv2.COLOR_BGR2HSV)
    total_pixels = head_crop.shape[0] * head_crop.shape[1]
    ppe_pixels = 0

    for lower, upper in PPE_COLOR_RANGES:
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        ppe_pixels += cv2.countNonZero(mask)

    ratio = ppe_pixels / total_pixels if total_pixels > 0 else 0
    return ratio >= MIN_PPE_PIXEL_RATIO

FIRE_COLOR_RANGES = [
    ((0, 100, 150), (25, 255, 255)),
    ((160, 100, 150), (180, 255, 255)),
]

SMOKE_LOWER = (0, 0, 100)
SMOKE_UPPER = (180, 40, 220)

MIN_FIRE_PIXEL_RATIO = 0.02
MIN_SMOKE_PIXEL_RATIO = 0.08


def detect_fire_smoke(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    total_pixels = frame.shape[0] * frame.shape[1]

    fire_pixels = 0
    for lower, upper in FIRE_COLOR_RANGES:
        mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
        fire_pixels += cv2.countNonZero(mask)
    fire_ratio = fire_pixels / total_pixels if total_pixels > 0 else 0

    smoke_mask = cv2.inRange(hsv, np.array(SMOKE_LOWER), np.array(SMOKE_UPPER))
    smoke_pixels = cv2.countNonZero(smoke_mask)
    smoke_ratio = smoke_pixels / total_pixels if total_pixels > 0 else 0

    fire_detected = fire_ratio >= MIN_FIRE_PIXEL_RATIO
    smoke_detected = smoke_ratio >= MIN_SMOKE_PIXEL_RATIO

    return fire_detected, smoke_detected