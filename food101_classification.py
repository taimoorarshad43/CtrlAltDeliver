#!/usr/bin/env python3
"""
Food-101 Multi-Class Classification using Xception Transfer Learning

This script implements a multi-class classifier for 101 different food categories
using the Food-101 dataset and Xception pre-trained model with TensorFlow/Keras.
"""

import os
import shutil
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
import tensorflow_datasets as tfds

from tensorflow import keras
from tensorflow.keras import layers, models, optimizers
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, smart_resize
from tensorflow.keras.applications.xception import Xception, preprocess_input, decode_predictions


class Food101Classifier:
    """Food-101 Multi-Class Classifier using Xception"""
    
    def __init__(self, num_classes=101, image_size=(299, 299)):
        self.num_classes = num_classes
        self.image_size = image_size
        self.model = None
        self.train_ds = None
        self.val_ds = None
        self.test_ds = None
        self.history = None
        self.class_names = None
        self.dataset_info = None
        
    def load_food101_dataset(self, data_dir='./data', batch_size=32, validation_split=0.1):
        """Load and prepare the Food-101 dataset using tensorflow_datasets"""
        print("Loading Food-101 dataset...")
        
        # Load the dataset with info
        try:
            dataset, info = tfds.load(
                'food101',
                as_supervised=True,
                with_info=True,
                data_dir=data_dir
            )
            
            self.dataset_info = info
            self.class_names = info.features['label'].names
            
            print(f"Number of classes: {len(self.class_names)}")
            print(f"Available splits: {list(dataset.keys())}")
            
            # Get train and validation datasets (Food-101 uses 'validation' not 'test')
            train_dataset = dataset['train']
            test_dataset = dataset['validation']  # Food-101 uses 'validation' split
            
        except KeyError as e:
            print(f"Error: Split '{e}' not found in dataset")
            print(f"Available splits: {list(dataset.keys()) if 'dataset' in locals() else 'Dataset not loaded'}")
            raise
        
        # Split training data for validation
        train_size = int((1 - validation_split) * len(train_dataset))
        val_size = len(train_dataset) - train_size
        
        train_dataset = train_dataset.take(train_size)
        val_dataset = train_dataset.skip(train_size).take(val_size)
        
        # Preprocess function
        def preprocess_image(image, label):
            # Resize image to model input size
            image = tf.image.resize(image, self.image_size)
            # Normalize to [0, 1]
            image = tf.cast(image, tf.float32) / 255.0
            # Apply Xception preprocessing
            image = preprocess_input(image * 255.0)  # preprocess_input expects [0, 255]
            return image, label
        
        # Apply preprocessing with memory optimization
        self.train_ds = (train_dataset
                        .map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
                        .batch(batch_size)
                        .prefetch(2))  # Reduced prefetch buffer
        
        self.val_ds = (val_dataset
                      .map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
                      .batch(batch_size)
                      .prefetch(2))
        
        self.test_ds = (test_dataset
                       .map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
                       .batch(batch_size)
                       .prefetch(2))
        
        print(f"Training samples: {len(list(train_dataset))}")
        print(f"Validation samples: {val_size}")
        print(f"Test samples: {len(list(test_dataset))}")
        
        return self.train_ds, self.val_ds, self.test_ds
    
    def explore_dataset(self, num_samples=5):
        """Explore the dataset to understand the data structure"""
        print("Exploring dataset...")
        
        # Get a batch from training data
        for images, labels in self.train_ds.take(1):
            print(f"Batch shape: {images.shape}")
            print(f"Labels shape: {labels.shape}")
            print(f"First {num_samples} labels: {labels[:num_samples].numpy()}")
            
            # Show some class names
            print("Sample class names:")
            for i in range(min(num_samples, len(labels))):
                class_idx = labels[i].numpy()
                print(f"  Label {class_idx}: {self.class_names[class_idx]}")
            
            break
        
        return images, labels
    
    def visualize_samples(self, num_samples=8):
        """Visualize sample images from the dataset"""
        plt.figure(figsize=(15, 8))
        
        for images, labels in self.train_ds.take(1):
            for i in range(min(num_samples, len(images))):
                plt.subplot(2, 4, i + 1)
                
                # Denormalize image for display
                img = images[i].numpy()
                img = (img - img.min()) / (img.max() - img.min())  # Normalize to [0, 1]
                
                plt.imshow(img)
                class_idx = labels[i].numpy()
                plt.title(f'{self.class_names[class_idx]}')
                plt.axis('off')
            
            break
        
        plt.tight_layout()
        plt.show()
    
    def build_model(self, freeze_base=True):
        """Build the transfer learning model"""
        print("Building model...")
        
        # Create base model (Xception without top layer)
        base_model = Xception(
            weights='imagenet',
            include_top=False,
            input_shape=(*self.image_size, 3)
        )
        
        # Freeze base model weights if specified
        if freeze_base:
            base_model.trainable = False
            print("Base model frozen")
        else:
            base_model.trainable = True
            print("Base model trainable")
        
        # Build custom model
        inputs = keras.Input(shape=(*self.image_size, 3))
        base = base_model(inputs, training=False)
        vectors = keras.layers.GlobalAveragePooling2D()(base)
        
        # Add dropout for regularization
        dropout = keras.layers.Dropout(0.2)(vectors)
        
        # Dense layer for classification
        outputs = keras.layers.Dense(self.num_classes, activation='softmax')(dropout)
        
        self.model = keras.Model(inputs, outputs)
        
        return self.model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model with optimizer and loss function"""
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        loss = keras.losses.SparseCategoricalCrossentropy()
        
        self.model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=['accuracy', 'top_5_accuracy']
        )
        
        return self.model
    
    def train_model(self, epochs=10, verbose=1, use_early_stopping=True):
        """Train the model"""
        if self.model is None:
            raise ValueError("Model must be built and compiled before training")
        
        callbacks = []
        
        if use_early_stopping:
            early_stopping = keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=3,
                restore_best_weights=True
            )
            callbacks.append(early_stopping)
        
        # Reduce learning rate on plateau
        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=2,
            min_lr=0.0001
        )
        callbacks.append(reduce_lr)
        
        print("Starting training...")
        self.history = self.model.fit(
            self.train_ds,
            epochs=epochs,
            validation_data=self.val_ds,
            verbose=verbose,
            callbacks=callbacks
        )
        
        return self.history
    
    def fine_tune_model(self, epochs=5, learning_rate=0.0001):
        """Fine-tune the model by unfreezing some layers"""
        if self.model is None:
            raise ValueError("Model must be trained first")
        
        print("Starting fine-tuning...")
        
        # Unfreeze some layers
        base_model = self.model.layers[1]  # Xception base model
        base_model.trainable = True
        
        # Fine-tune from this layer onwards
        fine_tune_at = len(base_model.layers) - 30
        
        # Freeze all the layers before the `fine_tune_at` layer
        for layer in base_model.layers[:fine_tune_at]:
            layer.trainable = False
        
        # Recompile with lower learning rate
        self.model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
            loss=keras.losses.SparseCategoricalCrossentropy(),
            metrics=['accuracy', 'top_5_accuracy']
        )
        
        print(f"Fine-tuning from layer {fine_tune_at}")
        
        # Continue training
        fine_tune_history = self.model.fit(
            self.train_ds,
            epochs=epochs,
            validation_data=self.val_ds,
            verbose=1
        )
        
        return fine_tune_history
    
    def plot_training_history(self):
        """Plot training and validation metrics"""
        if self.history is None:
            print("No training history available. Train the model first.")
            return
        
        history = self.history.history
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Plot accuracy
        axes[0, 0].plot(history['accuracy'], label='Training Accuracy')
        axes[0, 0].plot(history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        
        # Plot loss
        axes[0, 1].plot(history['loss'], label='Training Loss')
        axes[0, 1].plot(history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        
        # Plot top-5 accuracy if available
        if 'top_5_accuracy' in history:
            axes[1, 0].plot(history['top_5_accuracy'], label='Training Top-5 Accuracy')
            axes[1, 0].plot(history['val_top_5_accuracy'], label='Validation Top-5 Accuracy')
            axes[1, 0].set_title('Top-5 Accuracy')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Top-5 Accuracy')
            axes[1, 0].legend()
        
        plt.tight_layout()
        plt.show()
    
    def save_model(self, filename='food101_model.h5'):
        """Save the entire model"""
        if self.model is None:
            raise ValueError("No model to save. Build and train the model first.")
        
        self.model.save(filename)
        print(f"Model saved to {filename}")
    
    def load_model(self, filename='food101_model.h5'):
        """Load a saved model"""
        self.model = keras.models.load_model(filename)
        print(f"Model loaded from {filename}")
        return self.model
    
    def predict_single_image(self, image_path, model_path=None, top_k=5):
        """Predict the class of a single image"""
        if self.model is None:
            if model_path and os.path.exists(model_path):
                self.load_model(model_path)
            else:
                raise ValueError("No model available for prediction")
        
        # Load and preprocess image
        img = load_img(image_path, target_size=self.image_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)
        
        # Make prediction
        predictions = self.model.predict(img_array)
        
        # Get top-k predictions
        top_k_indices = np.argsort(predictions[0])[-top_k:][::-1]
        top_k_scores = predictions[0][top_k_indices]
        
        print(f"Image: {image_path}")
        print("Top predictions:")
        for i, (idx, score) in enumerate(zip(top_k_indices, top_k_scores)):
            print(f"  {i+1}. {self.class_names[idx]}: {score:.4f}")
        
        return top_k_indices, top_k_scores
    
    def evaluate_model(self):
        """Evaluate the model on test data"""
        if self.model is None:
            raise ValueError("No model to evaluate. Build and train the model first.")
        
        print("Evaluating model on test data...")
        evaluation = self.model.evaluate(self.test_ds, verbose=1)
        
        metrics = ['loss', 'accuracy', 'top_5_accuracy']
        for metric, value in zip(metrics, evaluation):
            print(f"Test {metric}: {value:.4f}")
        
        return evaluation
    
    def get_class_distribution(self):
        """Get the distribution of classes in the dataset"""
        print("Analyzing class distribution...")
        
        class_counts = {}
        for _, labels in self.train_ds.unbatch():
            label = labels.numpy()
            class_name = self.class_names[label]
            class_counts[class_name] = class_counts.get(class_name, 0) + 1
        
        return class_counts


def main():
    """Main function to train and save the Food-101 classification model"""
    print("="*60)
    print("FOOD-101 MODEL TRAINING")
    print("="*60)
    
    # Initialize classifier
    classifier = Food101Classifier()
    
    # Load Food-101 dataset
    print("\n1. Loading Food-101 dataset...")
    classifier.load_food101_dataset(batch_size=16)  # Reduced from 32 to 16
    
    # Explore dataset
    print("\n2. Exploring dataset...")
    classifier.explore_dataset()
    
    # Visualize sample images
    print("\n3. Visualizing sample images...")
    classifier.visualize_samples()
    
    # Build and compile model
    print("\n4. Building and compiling model...")
    classifier.build_model(freeze_base=True)
    classifier.compile_model(learning_rate=0.001)
    
    # Print model summary
    print("\nModel Summary:")
    classifier.model.summary()
    
    # Train model
    print("\n5. Starting initial training...")
    print("="*50)
    classifier.train_model(epochs=5)
    
    # Plot training history
    print("\n6. Plotting training history...")
    classifier.plot_training_history()
    
    # Fine-tune model
    print("\n7. Starting fine-tuning...")
    print("="*50)
    classifier.fine_tune_model(epochs=3)
    
    # Evaluate model
    print("\n8. Evaluating model...")
    classifier.evaluate_model()
    
    # Save model
    print("\n9. Saving trained model...")
    classifier.save_model('food101_trained_model.h5')
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print("Model saved as: food101_trained_model.h5")
    print("Use predict_food101.py to make predictions with this model")
    print("="*60)


if __name__ == "__main__":
    main()