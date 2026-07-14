import cv2
from src.detector import Detector

detector = Detector()
detector.start()

while True:
    frame = detector.process_frame()
    if frame is None:
        break

    cv2.imshow("CV-модуль preview", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

detector.stop()
detector.cap.release()
cv2.destroyAllWindows()