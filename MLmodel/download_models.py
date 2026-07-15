from huggingface_hub import hf_hub_download

ppe_path = hf_hub_download(repo_id="Hexmon/vyra-yolo-ppe-detection", filename="best.pt")
fire_path = hf_hub_download(repo_id="rabahdev/fire-smoke-yolov8n", filename="best.pt")

print("PPE model:", ppe_path)
print("Fire model:", fire_path)