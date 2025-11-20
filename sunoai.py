import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUNO_API_KEY = os.getenv("SUNO_API_KEY")
if not SUNO_API_KEY:
    raise RuntimeError("SUNO_API_KEY not set. Put it in .env or environment.")

url = "https://api.sunoapi.org/api/v1/generate"
headers = {
    "Authorization": f"Bearer {SUNO_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "prompt": "A peaceful acoustic guitar melody with soft vocals, folk style",
    "customMode": False,
    "instrumental": False,
    "model": "V3_5",
}

response = requests.post(url, json=payload, headers=headers)
result = response.json()

# print(f"Task ID: {result['data']['taskId']}")
print(f"Task ID: {result}")