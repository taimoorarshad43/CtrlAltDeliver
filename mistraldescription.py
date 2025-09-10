import requests
import base64
from mistralai import Mistral
import os

# Retrieve the API key from environment variables
api_key = os.environ["MISTRAL_API_KEY"]

# Specify model
model = "pixtral-12b-2409"

# Initialize the Mistral client
client = Mistral(api_key=api_key)

# base64_image = getimages()

def getimages():
    # Calling API for random image
    img_url = 'https://picsum.photos/200'
    img_data = requests.get(img_url).content

    # Getting the base64 string
    img_data_encoded = base64.b64encode(img_data).decode('utf-8')

    return img_data_encoded

def getproductdescription(image_data, prompt=None):

    # We'll send our own custom message prompt or default to this one
    message_data = prompt
    
    if not prompt:
        message_data = "Analyze this food image and list all the ingredients you can identify. Return only the ingredient names, separated by commas."

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


getproductdescription(getimages())

