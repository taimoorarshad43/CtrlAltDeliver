from flask import Flask, request, render_template, jsonify, redirect, url_for
import os
import base64
from werkzeug.utils import secure_filename
import requests
import json

# Import Food-101 model for food detection
from predict_food101 import detect_food_from_base64

# Import Mistral/Gemini for ingredient extraction
# from mistraldescription import getproductdescription
from ingredients_playlist import getproductdescription
from ingredients_playlist import get_playlist_from_ingredients
from spotify_playlist import parse_playlist, get_next_song, get_previous_song

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
            
            # Step 1: Detect food type using Food-101 model
            food_name = detect_food_from_base64(image_base64)
            
            # Step 2: Get ingredients using Mistral/Gemini based on the detected food
            ingredients = getproductdescription(
                image_base64, 
                f"This is {food_name}. List the typical ingredients found in {food_name}. Return only the ingredient names, separated by commas."
            )

            playlist = get_playlist_from_ingredients(ingredients)
            
            # Clean up uploaded file
            os.remove(filepath)
            
            # Parse playlist into structured format
            parsed_playlist = parse_playlist(playlist)
            
            return jsonify({
                'success': True,
                'food_name': food_name,  # Add detected food name
                'playlist': playlist,
                'parsed_playlist': parsed_playlist,
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
        
        # Step 1: Detect food type using Food-101 model
        food_name = detect_food_from_base64(image_base64)
        
        # Step 2: Get ingredients using Mistral/Gemini based on the detected food
        ingredients = getproductdescription(
            image_base64, 
            f"This is {food_name}. List the typical ingredients found in {food_name}. Return only the ingredient names, separated by commas."
        )
        
        # Get playlist based on ingredients
        playlist = get_playlist_from_ingredients(ingredients)
        
        # Parse playlist into structured format
        parsed_playlist = parse_playlist(playlist)
        
        return jsonify({
            'success': True,
            'food_name': food_name,  # Add detected food name
            'ingredients': ingredients,
            'playlist': playlist,
            'parsed_playlist': parsed_playlist,
            'source': 'api_image'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error analyzing random food image: {str(e)}'}), 500

@app.route('/playlist_navigation', methods=['POST'])
def playlist_navigation():
    """Handle playlist navigation (next/previous song)"""
    try:
        data = request.get_json()
        playlist = data.get('playlist', [])
        current_index = data.get('current_index', 0)
        direction = data.get('direction', 'next')  # 'next' or 'previous'
        
        if not playlist:
            return jsonify({'error': 'No playlist provided'}), 400
        
        if direction == 'next':
            next_song = get_next_song(playlist, current_index)
            if next_song:
                return jsonify({
                    'success': True,
                    'song': next_song,
                    'new_index': current_index + 1,
                    'has_next': current_index + 2 < len(playlist),
                    'has_previous': current_index >= 0
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'End of playlist reached'
                })
        
        elif direction == 'previous':
            prev_song = get_previous_song(playlist, current_index)
            if prev_song:
                return jsonify({
                    'success': True,
                    'song': prev_song,
                    'new_index': current_index - 1,
                    'has_next': current_index < len(playlist),
                    'has_previous': current_index - 1 > 0
                })
            else:
                return jsonify({
                    'success': False,
                    'message': 'Beginning of playlist reached'
                })
        
        else:
            return jsonify({'error': 'Invalid direction. Use "next" or "previous"'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Error navigating playlist: {str(e)}'}), 500

@app.route('/open_spotify', methods=['POST'])
def open_spotify():
    """Open a song in Spotify (simulated - returns the URL)"""
    try:
        data = request.get_json()
        song = data.get('song')
        artist = data.get('artist')
        
        if not song or not artist:
            return jsonify({'error': 'Song and artist are required'}), 400
        
        # Build Spotify URL (simulated)
        from spotify_playlist import _build_url
        spotify_url = _build_url(song, artist, "spotify")
        
        return jsonify({
            'success': True,
            'spotify_url': spotify_url,
            'message': f'Opening {song} by {artist} in Spotify'
        })
        
    except Exception as e:
        return jsonify({'error': f'Error opening Spotify: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
