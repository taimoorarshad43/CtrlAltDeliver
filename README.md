# CtrlAltDeliver - Food Ingredient Analyzer

A web application that uses Mistral AI's Pixtral model to analyze food images and identify ingredients. Upload your own food photos or analyze random food images from API services.

## 🍽️ Features

- **File Upload Interface**: Beautiful drag-and-drop web interface for uploading food images
- **Random Food Analysis**: Analyze random food images from API services as a fallback
- **AI-Powered Ingredient Detection**: Uses Mistral AI to identify ingredients in food photos
- **Modern Web UI**: Responsive design with loading states and error handling
- **Multiple API Fallbacks**: Robust system with multiple food image sources

## 🚀 Quick Start

### 1. Environment Setup

Create a Python virtual environment to isolate the project dependencies:

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 2. Install Dependencies

Install the required Python packages:

```bash
pip install -r requirements.txt
```

### 3. Mistral AI API Setup

1. Go to [Mistral AI Console](https://console.mistral.ai/) and create an account
2. Generate an API key from your dashboard
3. Create a `.env` file in the project root directory:

```bash
# Create .env file
touch .env
```

4. Add your Mistral API key to the `.env` file:

```
MISTRAL_API_KEY=your_actual_api_key_here
```

**Important:** Replace `your_actual_api_key_here` with your real API key from Mistral AI.

### 4. Running the Application

Start the Flask web server:

```bash
python3 app.py
```

Then open your browser and navigate to: `http://localhost:5000`

## 📁 Project Structure

```
CtrlAltDeliver/
├── app.py                          # Main Flask web application
├── mistraldescription.py           # Mistral AI integration module
├── requirements.txt                # Python dependencies
├── .env                           # Environment variables (create this)
├── .env.example                   # Environment variables template
├── templates/                     # HTML templates directory
│   └── index.html                 # Main web interface
├── uploads/                       # Temporary file upload directory (auto-created)
├── venv/                          # Virtual environment (created during setup)
└── README.md                      # This file
```

### File Descriptions

- **`app.py`**: The main Flask web application that handles:
  - File upload endpoints (`/upload`)
  - Random food image analysis (`/analyze_random`)
  - Web interface serving
  - Error handling and file management

- **`mistraldescription.py`**: Core AI integration module containing:
  - `getproductdescription()`: Function to analyze images with Mistral AI
  - `getimages()`: Function to fetch random images (legacy)
  - Mistral AI client configuration

- **`templates/index.html`**: Modern web interface featuring:
  - Drag-and-drop file upload
  - Two analysis modes (upload vs random)
  - Loading states and error handling
  - Responsive design

- **`requirements.txt`**: Python package dependencies including:
  - Flask (web framework)
  - Mistral AI SDK
  - Requests (HTTP client)
  - Other supporting libraries

- **`.env`**: Environment variables file (create this):
  - `MISTRAL_API_KEY`: Your Mistral AI API key

- **`uploads/`**: Temporary directory for uploaded files (auto-created and cleaned up)

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
1. Open `http://localhost:5000`
2. Upload a food image or click "Analyze Random Food Image"
3. View the identified ingredients

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