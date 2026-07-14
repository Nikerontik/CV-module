from ultralytics import YOLO

model = YOLO("models/yolov8n.pt")
model.export(format="onnx", imgsz=640)
print("Модель готова: models/yolov8n.onnx")