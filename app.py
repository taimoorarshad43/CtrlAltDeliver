from flask import Flask, request, render_template, jsonify, redirect, url_for
import os
import base64
from werkzeug.utils import secure_filename
import requests
# from mistraldescription import getproductdescription
from ingredients_playlist import getproductdescription
from ingredients_playlist import get_playlist_from_ingredients

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_food_image_from_api():
    """Fallback: Get a random food image from an API service"""
    try:
        # Using Unsplash API for food images (free tier)
        # You can replace with other food APIs like Spoonacular
        unsplash_url = "https://api.unsplash.com/photos/random"
        params = {
            'query': 'food',
            'client_id': os.environ.get('UNSPLASH_ACCESS_KEY', '')  # Optional: add to .env
        }
        
        response = requests.get(unsplash_url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            image_url = data['urls']['regular']
            img_data = requests.get(image_url).content
            return base64.b64encode(img_data).decode('utf-8')
        else:
            # Fallback to Picsum if Unsplash fails
            img_url = 'https://picsum.photos/400/300'
            img_data = requests.get(img_url).content
            return base64.b64encode(img_data).decode('utf-8')
            
    except Exception as e:
        print(f"Error fetching food image from API: {e}")
        # Final fallback to Picsum
        img_url = 'https://picsum.photos/400/300'
        img_data = requests.get(img_url).content
        return base64.b64encode(img_data).decode('utf-8')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # Read and encode the uploaded image
            with open(filepath, 'rb') as f:
                img_data = f.read()
            image_base64 = base64.b64encode(img_data).decode('utf-8')
            
            # Get ingredients using Mistral AI
            ingredients = getproductdescription(
                image_base64, 
                "Analyze this food image and list all the ingredients you can identify. Return only the ingredient names, separated by commas."
            )

            playlist = get_playlist_from_ingredients(ingredients)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return jsonify({
                'success': True,
                'playlist': playlist,
                'ingredients': ingredients,
                'source': 'uploaded_image'
            })
            
        except Exception as e:
            # Clean up file on error
            if os.path.exists(filepath):
                os.remove(filepath)
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload an image file.'}), 400

@app.route('/analyze_random', methods=['POST'])
def analyze_random_food():
    """Analyze a random food image from API"""
    try:
        # Get random food image from API
        image_base64 = get_food_image_from_api()
        
        # Get ingredients using Mistral AI
        ingredients = getproductdescription(
            image_base64, 
            "Analyze this food image and list all the ingredients you can identify. Return only the ingredient names, separated by commas."
        )
        
        # Get playlist based on ingredients
        playlist = get_playlist_from_ingredients(ingredients)
        
        return jsonify({
            'success': True,
            'ingredients': ingredients,
            'playlist': playlist,
            'source': 'api_image'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error analyzing random food image: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
