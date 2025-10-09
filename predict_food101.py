#!/usr/bin/env python3
"""
Food-101 Prediction Module

This script loads a pre-trained Food-101 model and makes predictions on food images.
Designed to be used as an alternative to Mistral API calls for food classification.
"""

import os
import base64
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.image import load_img
from tensorflow.keras.applications.xception import preprocess_input


class Food101Predictor:
    """Food-101 Prediction Class for loading and using trained models"""
    
    def __init__(self, model_path='food101_trained_model.h5', image_size=(299, 299)):
        self.model_path = model_path
        self.image_size = image_size
        self.model = None
        self.class_names = None
        self.load_model()
    
    def load_model(self):
        """Load the trained model and class names"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file not found: {self.model_path}")
        
        print(f"Loading model from {self.model_path}...")
        
        # Load the model
        self.model = keras.models.load_model(self.model_path)
        
        # Load class names - use hardcoded list to avoid downloading dataset
        self.class_names = self._get_food101_class_names()
        print(f"Loaded {len(self.class_names)} food classes")
        print("Model loaded successfully!")
    
    def _get_food101_class_names(self):
        """Get Food-101 class names without downloading the dataset"""
        return [
            'apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare',
            'beet_salad', 'beignets', 'bibimbap', 'bread_pudding', 'breakfast_burrito',
            'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake',
            'ceviche', 'cheese_plate', 'cheesecake', 'chicken_curry', 'chicken_quesadilla',
            'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder',
            'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes',
            'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict',
            'escargots', 'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras',
            'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice',
            'frozen_yogurt', 'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich',
            'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup',
            'hot_dog', 'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna',
            'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons', 'miso_soup',
            'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters',
            'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck',
            'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib',
            'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto',
            'samosa', 'sashimi', 'scallops', 'seaweed_salad', 'shrimp_and_grits',
            'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake',
            'sushi', 'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles'
        ]
    
    def preprocess_image(self, image_path):
        """Preprocess an image for prediction"""
        # Load and resize image
        img = load_img(image_path, target_size=self.image_size)
        
        # Convert to array and add batch dimension
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Apply Xception preprocessing
        img_array = preprocess_input(img_array)
        
        return img_array
    
    def preprocess_image_from_base64(self, image_base64):
        """Preprocess base64 image for prediction (for Flask app)"""
        # Decode base64 to image
        image_data = base64.b64decode(image_base64)
        img = Image.open(BytesIO(image_data))
        
        # Convert to RGB if needed
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to model input size
        img = img.resize(self.image_size)
        
        # Convert to array and add batch dimension
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Apply Xception preprocessing
        img_array = preprocess_input(img_array)
        
        return img_array
    
    def predict_single_image(self, image_path, top_k=5):
        """Predict the class of a single image"""
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Preprocess image
        img_array = self.preprocess_image(image_path)
        
        # Make prediction
        predictions = self.model.predict(img_array, verbose=0)
        
        # Get top-k predictions
        top_k_indices = np.argsort(predictions[0])[-top_k:][::-1]
        top_k_scores = predictions[0][top_k_indices]
        
        # Format results
        results = []
        for i, (idx, score) in enumerate(zip(top_k_indices, top_k_scores)):
            results.append({
                'rank': i + 1,
                'class_index': int(idx),
                'class_name': self.class_names[idx],
                'confidence': float(score)
            })
        
        return results
    
    def predict_food(self, image_path):
        """
        Main prediction function - returns the most likely food class
        Designed to be a simple interface for app integration
        """
        results = self.predict_single_image(image_path, top_k=1)
        
        if results:
            prediction = results[0]
            return {
                'food_name': prediction['class_name'],
                'confidence': prediction['confidence'],
                'class_index': prediction['class_index']
            }
        else:
            return None
    
    def predict_with_confidence(self, image_path, min_confidence=0.5):
        """
        Predict food with confidence threshold
        Returns None if confidence is below threshold
        """
        results = self.predict_single_image(image_path, top_k=1)
        
        if results and results[0]['confidence'] >= min_confidence:
            return self.predict_food(image_path)
        else:
            return None
    
    def get_top_predictions(self, image_path, top_k=5):
        """Get top-k predictions with details"""
        return self.predict_single_image(image_path, top_k)
    
    def batch_predict(self, image_paths):
        """Predict multiple images at once"""
        results = []
        
        for image_path in image_paths:
            try:
                result = self.predict_food(image_path)
                results.append({
                    'image_path': image_path,
                    'prediction': result,
                    'success': True
                })
            except Exception as e:
                results.append({
                    'image_path': image_path,
                    'prediction': None,
                    'success': False,
                    'error': str(e)
                })
        
        return results
    
    def predict_food_from_base64(self, image_base64, top_k=3):
        """
        Predict food from base64 image (for Flask app integration)
        Returns just the food name as a string
        """
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Preprocess image from base64
        img_array = self.preprocess_image_from_base64(image_base64)
        
        # Make prediction
        predictions = self.model.predict(img_array, verbose=0)
        
        # Get top prediction
        top_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][top_idx])
        food_name = self.class_names[top_idx]
        
        # Clean up food name (replace underscores with spaces)
        food_name_clean = food_name.replace('_', ' ')
        
        print(f"Detected: {food_name_clean} ({confidence:.2%} confidence)")
        
        return food_name_clean


# Global predictor instance (loaded once)
_predictor_instance = None

def get_predictor():
    """Get or create global predictor instance"""
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = Food101Predictor()
    return _predictor_instance


def detect_food_from_base64(image_base64):
    """
    Simple function for app.py to call
    Takes base64 image, returns food name as string
    """
    try:
        predictor = get_predictor()
        food_name = predictor.predict_food_from_base64(image_base64)
        return food_name
    except Exception as e:
        print(f"Error detecting food: {e}")
        return f"unknown food"


def test_predictor():
    """Test function to verify the predictor works"""
    try:
        predictor = Food101Predictor()
        
        # Test with a sample image (you'll need to provide a real image path)
        test_image = "test_food_image.jpg"  # Replace with actual image path
        
        if os.path.exists(test_image):
            print(f"\nTesting prediction on {test_image}...")
            result = predictor.predict_food(test_image)
            
            if result:
                print(f"Predicted food: {result['food_name']}")
                print(f"Confidence: {result['confidence']:.4f}")
            else:
                print("No prediction returned")
        else:
            print(f"Test image {test_image} not found")
            print("You can test with any food image by calling:")
            print("predictor.predict_food('path/to/your/image.jpg')")
    
    except Exception as e:
        print(f"Error testing predictor: {e}")


def main():
    """Main function for testing the predictor"""
    print("="*60)
    print("FOOD-101 PREDICTION MODULE")
    print("="*60)
    
    try:
        # Initialize predictor
        predictor = Food101Predictor()
        
        print("\nPredictor initialized successfully!")
        print("Ready to make predictions on food images.")
        print("\nUsage examples:")
        print("- predictor.predict_food('image.jpg')")
        print("- predictor.predict_with_confidence('image.jpg', min_confidence=0.7)")
        print("- predictor.get_top_predictions('image.jpg', top_k=3)")
        
        # Run test if possible
        test_predictor()
        
    except Exception as e:
        print(f"Error initializing predictor: {e}")
        print("Make sure you have trained the model first using food101_classification.py")


if __name__ == "__main__":
    main()
