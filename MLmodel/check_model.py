from ultralytics import YOLO
import cv2

model = YOLO("models/yolov8n.pt")
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Не удалось открыть камеру")
else:
    ret, frame = cap.read()
    if not ret:
        print("Не удалось прочитать кадр")
    else:
        results = model(frame)
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])
            name = model.names[cls_id]
            print(f"Класс: {name}, confidence: {conf:.2f}")

cap.release()