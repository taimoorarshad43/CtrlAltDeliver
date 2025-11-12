# CtrlAltDeliver - Food Ingredient Analyzer

A web application that uses Mistral AI's Pixtral model to analyze food images and identify ingredients. Upload your own food photos or analyze random food images from API services.

## 🍽️ Features

- **File Upload Interface**: Beautiful drag-and-drop web interface for uploading food images
- **Random Food Analysis**: Analyze random food images from API services as a fallback
- **AI-Powered Ingredient Detection**: Uses Mistral AI to identify ingredients in food photos
- **Modern Web UI**: Responsive design with loading states and error handling
- **Multiple API Fallbacks**: Robust system with multiple food image sources

## 🚀 Quick Start

The project now runs as two services:

- **Flask backend** – JSON API that talks to Mistral and Spotify helpers.
- **React frontend** – Vite-powered UI that consumes the backend API.

### 1. Prerequisites

- Python 3.10+  
- Node.js 18+ (or any recent LTS) & npm

### 2. Backend Setup

```bash
# Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env              # if you have an example file
```

Edit `.env` in the project root and provide at least:

```
MISTRAL_API_KEY=your_mistral_key

```

Run the API:

```bash
flask run
```

By default the backend listens on `http://0.0.0.0:5000` and exposes endpoints under `/api/*`.

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Optionally create `frontend/.env.local` to override the backend URL (defaults to `http://localhost:5000`):

```
VITE_API_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`). Open it in the browser; the UI will proxy API calls to the Flask backend.

### 4. Production Builds (optional)

- **Backend**: deploy `app.py` with your preferred WSGI server (Gunicorn, uvicorn, etc.).
- **Frontend**: `npm run build` creates static assets in `frontend/dist`. Serve them via your hosting provider or a CDN; ensure `VITE_API_BASE_URL` points at the deployed backend.

## 📁 Project Structure

```
CtrlAltDeliver/
├── app.py                       # Flask API server
├── ingredients_playlist.py      # Mistral helpers for dish + playlist generation
├── spotify_playlist.py          # Playlist parsing utilities
├── requirements.txt             # Python dependencies
├── frontend/                    # React + Vite UI
│   ├── package.json
│   └── src/...
├── uploads/                     # Temporary file upload directory (auto-created)
└── README.md                    # This file
```

### File Descriptions

- **`app.py`** – Flask API that exposes:
  - `POST /api/analyze-image` for uploaded photos
  - `POST /api/analyze-random` for random imagery
  - `POST /api/playlist/navigation` helpers
  - `POST /api/open-spotify` link generation

- **`ingredients_playlist.py`** – Mistral integration layer:
  - `analyze_food_image()` -> dish + ingredient JSON via Pixtral
  - `get_playlist_from_ingredients()` -> curated playlist text

- **`frontend/`** – React UI that calls the backend API and renders analysis results.

- **`uploads/`** – Temporary folder for incoming files (cleared after processing).

## 🎯 How It Works

1. **Upload Mode**: Users can drag and drop or select food images to upload
2. **Random Mode**: System fetches random food images from API services (Unsplash, Picsum)
3. **AI Analysis**: Images are sent to Mistral AI's Pixtral model for ingredient identification
4. **Results Display**: Identified ingredients are displayed in a clean, readable format

## 🔧 API Integration

The application uses multiple food image sources as fallbacks:

1. **Primary**: Unsplash API (high-quality food images)
2. **Fallback 1**: Picsum Photos (if Unsplash fails)
3. **Fallback 2**: Final Picsum fallback (for any errors)

To use Unsplash API (optional), add to your `.env`:
```
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

## 🛠️ Development

### Running in Development Mode

The Flask app runs in debug mode by default:
```bash
python3 app.py
```

### Testing the Core Module

You can also test the Mistral AI integration directly:
```bash
python3 mistraldescription.py
```

## 🐛 Troubleshooting

- **API Key Error**: Make sure your `.env` file contains a valid `MISTRAL_API_KEY`
- **Import Errors**: Ensure you've activated your virtual environment and installed requirements
- **Network Issues**: Check your internet connection for API calls and image fetching
- **File Upload Issues**: Ensure the `uploads/` directory has proper permissions
- **Port Already in Use**: Change the port in `app.py` if 5000 is occupied

## 📝 Usage Examples

### Web Interface
1. Run both backend (`python app.py`) and frontend (`npm run dev`).
2. Open the Vite URL (e.g. `http://localhost:5173`).
3. Upload a food image or trigger a random analysis to see ingredients, playlists, and cultural context.

### Direct API Usage
```python
from mistraldescription import getproductdescription
import base64

# Load and encode an image
with open('food_image.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

# Get ingredients
ingredients = getproductdescription(
    image_data, 
    "Analyze this food image and list all the ingredients you can identify."
)
print(ingredients)
```

## 🔮 Future Enhancements

- Recipe suggestions based on identified ingredients
- Nutritional information lookup
- Ingredient substitution recommendations
- Batch image processing
- User accounts and image history
- Mobile app integration