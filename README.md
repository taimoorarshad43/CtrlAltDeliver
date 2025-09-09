# CtrlAltDeliver - Mistral AI Image Description Tool

## Setup Instructions

### 1. Environment Setup

First, create a Python virtual environment to isolate the project dependencies:

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

Once everything is set up, run the application:

```bash
python3 mistraldescription.py
```

## What the Application Does

This tool uses Mistral AI's Pixtral model to analyze images and generate descriptions or tags. It:

1. Fetches a random image from Picsum Photos
2. Sends the image to Mistral AI for analysis
3. Returns descriptive tags for the image

## Troubleshooting

- **API Key Error**: Make sure your `.env` file contains a valid `MISTRAL_API_KEY`
- **Import Errors**: Ensure you've activated your virtual environment and installed requirements
- **Network Issues**: Check your internet connection for API calls and image fetching

## Project Structure

- `mistraldescription.py` - Main application script
- `requirements.txt` - Python dependencies
- `.env` - Environment variables (create this file)
- `venv/` - Virtual environment directory (created during setup)
