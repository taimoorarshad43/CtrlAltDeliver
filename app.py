import base64
import os

import requests
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

from ingredients_playlist import analyze_food_image, get_playlist_from_ingredients, getproductdescription
from spotify_playlist import get_next_song, get_previous_song, parse_playlist
from food_history import get_food_history

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size
app.config["UPLOAD_FOLDER"] = "uploads"

os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "webp"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def get_food_image_from_api():
    """Fallback: Get a random food image from an API service."""
    try:
        unsplash_url = "https://api.unsplash.com/photos/random"
        params = {
            "query": "food",
            "client_id": os.environ.get("UNSPLASH_ACCESS_KEY", ""),
        }

        response = requests.get(unsplash_url, params=params, timeout=10)

        if response.status_code == 200:
            data = response.json()
            image_url = data["urls"]["regular"]
            img_data = requests.get(image_url, timeout=10).content
            return base64.b64encode(img_data).decode("utf-8")

        img_url = "https://picsum.photos/400/300"
        img_data = requests.get(img_url, timeout=10).content
        return base64.b64encode(img_data).decode("utf-8")

    except Exception as err:  # pragma: no cover - network fallback
        print(f"Error fetching food image from API: {err}")
        img_url = "https://picsum.photos/400/300"
        img_data = requests.get(img_url).content
        return base64.b64encode(img_data).decode("utf-8")


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/api/analyze-image", methods=["POST"])
def analyze_image():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Please upload an image file."}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    try:
        with open(filepath, "rb") as handle:
            image_bytes = handle.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        analysis = analyze_food_image(image_base64)
        food_name = analysis.get("dish_name", "Unknown")
        ingredients = analysis.get("ingredients", "")

        if not ingredients:
            ingredients = getproductdescription(
                image_base64,
                "Identify this dish's key ingredients. Only return the ingredient names, separated by commas.",
            )

        playlist = get_playlist_from_ingredients(ingredients)

        parsed_playlist = parse_playlist(playlist)

        return jsonify(
            {
                "success": True,
                "food_name": food_name,
                "ingredients": ingredients,
                "playlist": playlist,
                "parsed_playlist": parsed_playlist,
                "source": "uploaded_image",
            }
        )

    except Exception as exc:
        return jsonify({"error": f"Error processing image: {exc}"}), 500

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


@app.route("/api/analyze-random", methods=["POST"])
def analyze_random_food():
    try:
        image_base64 = get_food_image_from_api()

        analysis = analyze_food_image(image_base64)
        food_name = analysis.get("dish_name", "Unknown")
        ingredients = analysis.get("ingredients", "")

        if not ingredients:
            ingredients = getproductdescription(
                image_base64,
                f"This is {food_name}. List the typical ingredients found in {food_name}. Return only the ingredient names, separated by commas.",
            )

        playlist = get_playlist_from_ingredients(ingredients)
        parsed_playlist = parse_playlist(playlist)

        return jsonify(
            {
                "success": True,
                "food_name": food_name,
                "ingredients": ingredients,
                "playlist": playlist,
                "parsed_playlist": parsed_playlist,
                "source": "api_image",
            }
        )

    except Exception as exc:
        return jsonify({"error": f"Error analyzing random food image: {exc}"}), 500


@app.route("/api/playlist/navigation", methods=["POST"])
def playlist_navigation():
    try:
        data = request.get_json(force=True)
        playlist = data.get("playlist", [])
        current_index = data.get("current_index", 0)
        direction = data.get("direction", "next")

        if not playlist:
            return jsonify({"error": "No playlist provided"}), 400

        if direction == "next":
            next_song = get_next_song(playlist, current_index)
            if next_song:
                return jsonify(
                    {
                        "success": True,
                        "song": next_song,
                        "new_index": current_index + 1,
                        "has_next": current_index + 2 < len(playlist),
                        "has_previous": current_index >= 0,
                    }
                )
            return jsonify({"success": False, "message": "End of playlist reached"})

        if direction == "previous":
            prev_song = get_previous_song(playlist, current_index)
            if prev_song:
                return jsonify(
                    {
                        "success": True,
                        "song": prev_song,
                        "new_index": current_index - 1,
                        "has_next": current_index < len(playlist),
                        "has_previous": current_index - 1 > 0,
                    }
                )
            return jsonify({"success": False, "message": "Beginning of playlist reached"})

        return jsonify({"error": 'Invalid direction. Use "next" or "previous"'}), 400

    except Exception as exc:
        return jsonify({"error": f"Error navigating playlist: {exc}"}), 500


@app.route("/api/open-spotify", methods=["POST"])
def open_spotify():
    try:
        data = request.get_json(force=True)
        song = data.get("song")
        artist = data.get("artist")

        if not song or not artist:
            return jsonify({"error": "Song and artist are required"}), 400

        from spotify_playlist import _build_url

        spotify_url = _build_url(song, artist, "spotify")

        return jsonify(
            {
                "success": True,
                "spotify_url": spotify_url,
                "message": f"Opening {song} by {artist} in Spotify",
            }
        )

    except Exception as exc:
        return jsonify({"error": f"Error opening Spotify: {exc}"}), 500


@app.route("/api/food-history", methods=["POST"])
def food_history():
    """
    Get food history, modern culture, and fun facts for a given food item.
    
    Request body:
        {
            "food_name": "Chicken Chowmein",
            "model": "qwen3:8b"  # optional, defaults to qwen3:8b
        }
    """
    try:
        data = request.get_json(force=True)
        food_name = data.get("food_name")
        model = data.get("model", "qwen3:8b")  # Default to qwen3:8b
        
        if not food_name:
            return jsonify({"error": "food_name is required"}), 400
        
        # Get food history information
        history_data = get_food_history(food_name, model=model, verbose=False)
        
        return jsonify(
            {
                "success": True,
                "food_name": food_name,
                "model": model,
                "food_history": history_data["food_history"],
                "modern_culture": history_data["modern_culture"],
                "fun_facts": history_data["fun_facts"],
            }
        )
        
    except ConnectionError as exc:
        return jsonify({"error": f"Connection error: {exc}"}), 503
    except ValueError as exc:
        return jsonify({"error": f"Parsing error: {exc}"}), 500
    except Exception as exc:
        return jsonify({"error": f"Error getting food history: {exc}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
