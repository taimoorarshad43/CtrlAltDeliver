import requests
import base64
from mistralai import Mistral
from dotenv import load_dotenv
import os

load_dotenv()

# Retrieve the API key from environment variables
#api_key = os.environ["MISTRAL_API_KEY"]

api_key = os.getenv("MISTRAL_API_KEY")
if not api_key:
    raise RuntimeError("MISTRAL_API_KEY not set. Put it in .env or environment.")


#print(api_key)

# Specify model
model = "pixtral-12b-2409"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# base64_image = getimages()

def getimages():
    # Calling API for random image
    #img_url = 'https://picsum.photos/200'
    #img_url = 'https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg'

    img_url = 'https://thvnext.bing.com/th/id/OIP.dsBgwY6WbAqMooW5rrWk1QHaFI?w=269&h=187&c=7&r=0&o=7&cb=ucfimg2&dpr=1.3&pid=1.7&rm=3&ucfimg=1'

    
    img_data = requests.get(img_url).content

    # Getting the base64 string
    img_data_encoded = base64.b64encode(img_data).decode('utf-8')

    return img_data_encoded

def getproductdescription(image_data, prompt=None):

    # We'll send our own custom message prompt or default to this one
    message_data = prompt
    
    if not prompt:
        message_data = "Give me a list of ingredients for this image. Only return the ingredients, no other text."

    """Function that takes base64 utf-8 image data and returns an image description from Mistral's AI"""

    # Define the messages for the chat
    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": message_data
                },
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{image_data}" 
                }
            ]
        }
    ]

    # Get the chat response
    chat_response = client.chat.complete(
        model=model,
        messages=messages
    )

    # Print the content of the response and return as output
    print(chat_response.choices[0].message.content)

    output = chat_response.choices[0].message.content

    return output


# Below is the function to get a playlist based on ingredients
def get_playlist_from_ingredients(ingredients: str):
    prompt = f"""
    You are a contemporary music curator.
    Based on these food ingredients: {ingredients}

    Suggest a playlist of 8–10 real songs that match the mood/flavors.
    Format as a simple numbered list with "Song – Artist".
    """

    messages = [
        {"role": "user", "content": prompt}
    ]

    resp = client.chat.complete(
        model="mistral-large-latest",   # text model
        messages=messages,
        temperature=0.6
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