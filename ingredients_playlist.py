import base64
import json
import os
from typing import Dict, Optional

import requests
from dotenv import load_dotenv
from mistralai import Mistral

load_dotenv()

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise RuntimeError("MISTRAL_API_KEY not set. Put it in .env or environment.")

IMAGE_MODEL = "pixtral-12b-2409"
TEXT_MODEL = "mistral-small-latest"

client = Mistral(api_key=api_key)


def getimages():
    img_url = "https://thvnext.bing.com/th/id/OIP.dsBgwY6WbAqMooW5rrWk1QHaFI?w=269&h=187&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1"
    img_data = requests.get(img_url).content
    img_data_encoded = base64.b64encode(img_data).decode("utf-8")
    return img_data_encoded


def _call_pixtral(image_data: str, prompt: str, *, response_format: Optional[Dict] = None) -> str:
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image_data}"},
            ],
        }
    ]

    kwargs = {"model": IMAGE_MODEL, "messages": messages}
    if response_format is not None:
        kwargs["response_format"] = response_format

    chat_response = client.chat.complete(**kwargs)
    return chat_response.choices[0].message.content


def analyze_food_image(image_data: str) -> Dict[str, str]:
    prompt = (
        "You are a culinary expert. Identify the primary prepared dish in this image and list the most common "
        "ingredients used to make it. Respond strictly as a JSON object with the keys "
        '"dish_name" (string) and "ingredients" (comma-separated string). '
        'If you are unsure, set "dish_name" to "Unknown" and include your best guess of ingredients.'
    )

    raw_response = _call_pixtral(image_data, prompt, response_format={"type": "json_object"})

    try:
        parsed = json.loads(raw_response)
    except json.JSONDecodeError:
        parsed = {"dish_name": "Unknown", "ingredients": ""}

    dish_name = parsed.get("dish_name") or "Unknown"
    ingredients = parsed.get("ingredients") or ""

    return {"dish_name": dish_name.strip(), "ingredients": ingredients.strip()}


def getproductdescription(image_data, prompt=None):
    message_data = prompt or "Give me a list of ingredients for this image. Only return the ingredients, no other text."
    response_text = _call_pixtral(image_data, message_data)
    return response_text


def get_playlist_from_ingredients(ingredients: str):
    prompt = f"""
    You are a contemporary music curator.
    Based on these food ingredients: {ingredients}

    Suggest a playlist of 8–10 real songs that match the mood/flavors.
    Format as a simple numbered list with "Song – Artist".
    """

    messages = [{"role": "user", "content": prompt}]

    resp = client.chat.complete(
        model=TEXT_MODEL,
        messages=messages,
        temperature=0.6,
    )

    playlist = resp.choices[0].message.content
    return playlist

# # Example use:
# ingredients_output = "tomato, basil, garlic, olive oil, parmesan"
# #playlist = get_playlist_from_ingredients(ingredients_output)
# ingredients = getproductdescription(getimages())
# playlist = get_playlist_from_ingredients(ingredients)
# print("\nRecommended Playlist:\n")
# print(playlist)