import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUNO_API_KEY = os.getenv("SUNO_API_KEY")
if not SUNO_API_KEY:
    raise RuntimeError("SUNO_API_KEY not set. Put it in .env or environment.")


def get_task_status(task_id: str):
    """
    Get the status and URL of a Suno AI music generation task.
    
    Args:
        task_id: The task ID returned from the generate API
    
    Returns:
        Dictionary with status and audio_url (if available)
    """
    url = f"https://api.sunoapi.org/api/v1/task/{task_id}"
    headers = {
        "Authorization": f"Bearer {SUNO_API_KEY}",
        "Content-Type": "application/json",
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()
    result = response.json()
    
    # Extract status and URL from response
    status = result.get("status", "unknown")
    audio_url = result.get("audio_url") or result.get("data", {}).get("audio_url") or result.get("data", {}).get("url")
    
    return {
        "status": status,
        "audio_url": audio_url,
        "full_response": result
    }


if __name__ == "__main__":
    # Example usage
    task_id = input("Enter task ID: ")
    try:
        result = get_task_status(task_id)
        print(f"Status: {result['status']}")
        if result['audio_url']:
            print(f"Audio URL: {result['audio_url']}")
        else:
            print("Audio URL not available yet")
    except Exception as e:
        print(f"Error: {e}")

