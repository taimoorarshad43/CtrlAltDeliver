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
from tqdm import tqdm
import psutil
import gc

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
        self.gpu_available = False
        self.memory_info = None
        
        # Configure GPU and memory
        self._configure_gpu()
        self._check_system_resources()
    
    def _configure_gpu(self):
        """Configure GPU settings and check availability"""
        print("="*50)
        print("GPU CONFIGURATION")
        print("="*50)
        
        # Enable mixed precision for 2x speed boost
        try:
            from tensorflow.keras import mixed_precision
            mixed_precision.set_global_policy('mixed_float16')
            print("[OK] Mixed precision training ENABLED (2x speed boost)")
        except Exception as e:
            print(f"[WARNING] Could not enable mixed precision: {e}")
            print("[INFO] Continuing with full precision")
        
        # Check CUDA availability first
        print("Checking CUDA availability...")
        try:
            # Try to create a simple tensor to test GPU
            with tf.device('/GPU:0'):
                test_tensor = tf.constant([1.0, 2.0, 3.0])
                print("[OK] CUDA is available")
        except Exception as e:
            print(f"[WARNING] CUDA test failed: {e}")
            print("[INFO] This might be normal if no GPU is available")
        
        # Check for GPU availability
        gpus = tf.config.list_physical_devices('GPU')
        print(f"Physical GPUs found: {len(gpus)}")
        
        # Also check if CUDA is built into TensorFlow
        cuda_built = tf.test.is_built_with_cuda()
        print(f"TensorFlow built with CUDA: {cuda_built}")
        
        if gpus:
            try:
                # Enable memory growth to avoid allocating all GPU memory at once
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
                
                # Set logical device configuration
                logical_gpus = tf.config.list_logical_devices('GPU')
                print(f"[OK] {len(gpus)} Physical GPU(s) detected")
                print(f"[OK] {len(logical_gpus)} Logical GPU(s) available")
                
                # Print GPU details
                for i, gpu in enumerate(gpus):
                    print(f"   GPU {i}: {gpu.name}")
                
                self.gpu_available = True
                print("[OK] GPU acceleration ENABLED")
                
            except RuntimeError as e:
                print(f"[ERROR] GPU configuration error: {e}")
                self.gpu_available = False
        else:
            print("[WARNING] No GPU detected - using CPU")
            print("[INFO] Make sure you have:")
            print("   1. NVIDIA GPU with CUDA support")
            print("   2. CUDA drivers installed")
            print("   3. TensorFlow-GPU version installed")
            self.gpu_available = False
        
        print(f"TensorFlow version: {tf.__version__}")
        print("="*50)
    
    def _check_system_resources(self):
        """Check system memory and resources"""
        print("\nSYSTEM RESOURCES")
        print("="*30)
        
        # Check RAM
        memory = psutil.virtual_memory()
        self.memory_info = {
            'total_gb': memory.total / (1024**3),
            'available_gb': memory.available / (1024**3),
            'used_percent': memory.percent
        }
        
        print(f"Total RAM: {self.memory_info['total_gb']:.1f} GB")
        print(f"Available RAM: {self.memory_info['available_gb']:.1f} GB")
        print(f"RAM Usage: {self.memory_info['used_percent']:.1f}%")
        
        # Recommend batch size based on available memory
        if self.memory_info['available_gb'] < 4:
            recommended_batch_size = 8
        elif self.memory_info['available_gb'] < 8:
            recommended_batch_size = 16
        else:
            recommended_batch_size = 32
            
        print(f"Recommended batch size: {recommended_batch_size}")
        print("="*30)
        
    def _get_optimal_batch_size(self, base_batch_size=32):
        """Get optimal batch size based on available memory"""
        if self.memory_info['available_gb'] < 4:
            return min(base_batch_size, 8)
        elif self.memory_info['available_gb'] < 8:
            return min(base_batch_size, 16)
        else:
            return base_batch_size
        
    def load_food101_dataset(self, data_dir='./data', batch_size=32, validation_split=0.1, auto_adjust_batch_size=True, limit_samples=None):
        """Load and prepare the Food-101 dataset using tensorflow_datasets"""
        print("Loading Food-101 dataset...")
        
        # Use optimal batch size based on available memory (if enabled)
        if auto_adjust_batch_size:
            optimal_batch_size = self._get_optimal_batch_size(batch_size)
            if optimal_batch_size != batch_size:
                print(f"[WARNING] Adjusting batch size from {batch_size} to {optimal_batch_size} for optimal memory usage")
                batch_size = optimal_batch_size
        else:
            print(f"Using fixed batch size: {batch_size}")
        
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
        
        # Limit dataset size for testing if specified
        if limit_samples is not None:
            print(f"[TEST MODE] Limiting dataset to {limit_samples} training samples")
            train_dataset = train_dataset.take(limit_samples)
            test_dataset = test_dataset.take(min(limit_samples // 10, 100))  # Smaller test set
        
        # Split training data for validation
        train_size = int((1 - validation_split) * len(train_dataset))
        val_size = len(train_dataset) - train_size
        
        # Store original dataset before splitting
        original_train = train_dataset
        train_dataset = original_train.take(train_size)
        val_dataset = original_train.skip(train_size).take(val_size)
        
        # Preprocess function with data augmentation for training
        def preprocess_image(image, label, training=True):
            # Resize image to model input size
            image = tf.image.resize(image, self.image_size)
            # Normalize to [0, 1]
            image = tf.cast(image, tf.float32) / 255.0
            
            # Apply data augmentation during training
            if training:
                # Random horizontal flip
                image = tf.image.random_flip_left_right(image)
                # Random brightness
                image = tf.image.random_brightness(image, 0.1)
                # Random contrast
                image = tf.image.random_contrast(image, 0.9, 1.1)
                # Random saturation
                image = tf.image.random_saturation(image, 0.9, 1.1)
                # Ensure values stay in [0, 1]
                image = tf.clip_by_value(image, 0.0, 1.0)
            
            # Apply Xception preprocessing
            image = preprocess_input(image * 255.0)  # preprocess_input expects [0, 255]
            return image, label
        
        # Apply preprocessing with memory optimization
        self.train_ds = (train_dataset
                        .map(lambda img, lbl: preprocess_image(img, lbl, training=True), num_parallel_calls=tf.data.AUTOTUNE)
                        .batch(batch_size)
                        .prefetch(2))  # Reduced prefetch buffer
        
        self.val_ds = (val_dataset
                      .map(lambda img, lbl: preprocess_image(img, lbl, training=False), num_parallel_calls=tf.data.AUTOTUNE)
                      .batch(batch_size)
                      .prefetch(2))
        
        self.test_ds = (test_dataset
                       .map(lambda img, lbl: preprocess_image(img, lbl, training=False), num_parallel_calls=tf.data.AUTOTUNE)
                       .batch(batch_size)
                       .prefetch(2))
        
        # Get dataset sizes without converting to list (which causes memory issues)
        train_size = len(train_dataset)
        test_size = len(test_dataset)
        print(f"Training samples: {train_size}")
        print(f"Validation samples: {val_size}")
        print(f"Test samples: {test_size}")
        
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
        
        # Build custom model with better architecture
        inputs = keras.Input(shape=(*self.image_size, 3))
        base = base_model(inputs, training=False)
        
        # Global Average Pooling
        vectors = keras.layers.GlobalAveragePooling2D()(base)
        
        # Add BatchNormalization for better training stability
        bn1 = keras.layers.BatchNormalization()(vectors)
        
        # First dense layer with more neurons
        dense1 = keras.layers.Dense(512, activation='relu')(bn1)
        dropout1 = keras.layers.Dropout(0.3)(dense1)
        
        # Batch normalization after first dense layer
        bn2 = keras.layers.BatchNormalization()(dropout1)
        
        # Second dense layer
        dense2 = keras.layers.Dense(256, activation='relu')(bn2)
        dropout2 = keras.layers.Dropout(0.2)(dense2)
        
        # Final classification layer (with mixed precision fix)
        outputs = keras.layers.Dense(self.num_classes, activation='softmax', dtype='float32')(dropout2)
        
        self.model = keras.Model(inputs, outputs)
        
        return self.model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model with optimizer and loss function"""
        # Use AdamW optimizer (better than Adam)
        optimizer = keras.optimizers.AdamW(learning_rate=learning_rate, weight_decay=0.01)
        loss = keras.losses.SparseCategoricalCrossentropy()
        
        self.model.compile(
            optimizer=optimizer,
            loss=loss,
            metrics=['accuracy', 'sparse_top_k_categorical_accuracy']
        )
        
        return self.model
    
    def train_model(self, epochs=10, verbose=1, use_early_stopping=False): # To stop bottle neck, set use_early_stopping to False
        """Train the model with progress monitoring"""
        if self.model is None:
            raise ValueError("Model must be built and compiled before training")
        
        callbacks = []
        
        # Add progress monitoring callback
        class ProgressCallback(keras.callbacks.Callback):
            def __init__(self, total_epochs):
                self.total_epochs = total_epochs
                self.current_epoch = 0
                
            def on_epoch_begin(self, epoch, logs=None):
                self.current_epoch = epoch + 1
                print(f"\n[EPOCH] {self.current_epoch}/{self.total_epochs}")
                if self.gpu_available:
                    print("   Using GPU acceleration")
                else:
                    print("   Using CPU")
                    
            def on_epoch_end(self, epoch, logs=None):
                if logs:
                    print(f"   Loss: {logs.get('loss', 0):.4f} - Accuracy: {logs.get('accuracy', 0):.4f}")
                    if 'val_loss' in logs:
                        print(f"   Val Loss: {logs.get('val_loss', 0):.4f} - Val Accuracy: {logs.get('val_accuracy', 0):.4f}")
                
                # Memory cleanup every few epochs
                if (epoch + 1) % 3 == 0:
                    gc.collect()
                    if self.gpu_available:
                        tf.keras.backend.clear_session()
        
        progress_callback = ProgressCallback(epochs)
        progress_callback.gpu_available = self.gpu_available
        callbacks.append(progress_callback)
        
        if use_early_stopping:
            early_stopping = keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=3,
                restore_best_weights=True,
                verbose=1
            )
            callbacks.append(early_stopping)
        
        # Reduce learning rate on plateau (aggressive for better convergence)
        reduce_lr = keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.3,
            patience=1,
            min_lr=0.00001,
            verbose=1
        )
        callbacks.append(reduce_lr)
        
        print("="*60)
        print("STARTING TRAINING")
        print("="*60)
        print(f"Epochs: {epochs}")
        print(f"Batch size: {self.train_ds.element_spec[0].shape[0] if hasattr(self.train_ds, 'element_spec') else 'Unknown'}")
        print(f"GPU Available: {'Yes' if self.gpu_available else 'No'}")
        print("="*60)
        
        self.history = self.model.fit(
            self.train_ds,
            epochs=epochs,
            validation_data=self.val_ds,
            verbose=1,  # We handle verbose with our custom callback
            callbacks=callbacks
        )
        
        print("\n" + "="*60)
        print("TRAINING COMPLETE!")
        print("="*60)
        
        return self.history
    
    def fine_tune_model(self, epochs=5, learning_rate=0.0001):
        """Fine-tune the model by unfreezing some layers"""
        if self.model is None:
            raise ValueError("Model must be trained first")
        
        print("\n" + "="*60)
        print("STARTING FINE-TUNING")
        print("="*60)
        
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
            metrics=['accuracy', 'sparse_top_k_categorical_accuracy']
        )
        
        print(f"Fine-tuning from layer {fine_tune_at}")
        print(f"Learning rate: {learning_rate}")
        print(f"GPU Available: {'Yes' if self.gpu_available else 'No'}")
        print("="*60)
        
        # Add progress monitoring for fine-tuning
        class FineTuneProgressCallback(keras.callbacks.Callback):
            def __init__(self, total_epochs):
                self.total_epochs = total_epochs
                self.current_epoch = 0
                
            def on_epoch_begin(self, epoch, logs=None):
                self.current_epoch = epoch + 1
                print(f"\n[FINE-TUNE] Epoch {self.current_epoch}/{self.total_epochs}")
                    
            def on_epoch_end(self, epoch, logs=None):
                if logs:
                    print(f"   Loss: {logs.get('loss', 0):.4f} - Accuracy: {logs.get('accuracy', 0):.4f}")
                    if 'val_loss' in logs:
                        print(f"   Val Loss: {logs.get('val_loss', 0):.4f} - Val Accuracy: {logs.get('val_accuracy', 0):.4f}")
                
                # Memory cleanup
                gc.collect()
                if self.gpu_available:
                    tf.keras.backend.clear_session()
        
        fine_tune_callback = FineTuneProgressCallback(epochs)
        fine_tune_callback.gpu_available = self.gpu_available
        
        # Continue training
        fine_tune_history = self.model.fit(
            self.train_ds,
            epochs=epochs,
            validation_data=self.val_ds,
            verbose=0,
            callbacks=[fine_tune_callback]
        )
        
        print("\n" + "="*60)
        print("FINE-TUNING COMPLETE!")
        print("="*60)
        
        return fine_tune_history
    
    def plot_training_history(self):
        """Plot training and validation metrics"""
        if self.history is None:
            print("No training history available. Train the model first.")
            return
        
        history = self.history.history
        print(f"Available metrics: {list(history.keys())}")  # Debug: show available keys
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # Plot accuracy
        axes[0, 0].plot(history['accuracy'], label='Training Accuracy')
        if 'val_accuracy' in history:
            axes[0, 0].plot(history['val_accuracy'], label='Validation Accuracy')
        axes[0, 0].set_title('Model Accuracy')
        axes[0, 0].set_xlabel('Epoch')
        axes[0, 0].set_ylabel('Accuracy')
        axes[0, 0].legend()
        
        # Plot loss
        axes[0, 1].plot(history['loss'], label='Training Loss')
        if 'val_loss' in history:
            axes[0, 1].plot(history['val_loss'], label='Validation Loss')
        axes[0, 1].set_title('Model Loss')
        axes[0, 1].set_xlabel('Epoch')
        axes[0, 1].set_ylabel('Loss')
        axes[0, 1].legend()
        
        # Plot top-k accuracy if available
        if 'sparse_top_k_categorical_accuracy' in history:
            axes[1, 0].plot(history['sparse_top_k_categorical_accuracy'], label='Training Top-K Accuracy')
            if 'val_sparse_top_k_categorical_accuracy' in history:
                axes[1, 0].plot(history['val_sparse_top_k_categorical_accuracy'], label='Validation Top-K Accuracy')
            axes[1, 0].set_title('Top-K Accuracy')
            axes[1, 0].set_xlabel('Epoch')
            axes[1, 0].set_ylabel('Top-K Accuracy')
            axes[1, 0].legend()
        
        plt.tight_layout()
        plt.savefig('training_history.png')  # Save instead of show to avoid blocking
        print("Training history plot saved as 'training_history.png'")
    
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
        
        metrics = ['loss', 'accuracy', 'sparse_top_k_categorical_accuracy']
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
    
    # ====== TEST MODE SETTINGS ======
    # Set TEST_MODE = True to quickly test with a small dataset
    # Set TEST_MODE = False for full training
    TEST_MODE = False  # Change to False for full training
    
    if TEST_MODE:
        print("="*60)
        print("RUNNING IN TEST MODE - SMALL DATASET")
        print("="*60)
        limit_samples = 100
        epochs_initial = 2
        epochs_finetune = 1
    else:
        print("="*60)
        print("FOOD-101 MODEL TRAINING - OPTIMIZED SPEED")
        print("="*60)
        limit_samples = None
        epochs_initial = 4  # Increased for better accuracy (with speed optimizations)
        epochs_finetune = 3  # Increased for better fine-tuning
    
    # Initialize classifier
    classifier = Food101Classifier()
    
    # Load Food-101 dataset
    print("\n1. Loading Food-101 dataset...")
    classifier.load_food101_dataset(
        batch_size=64,  # Increased from 32 for faster training
        auto_adjust_batch_size=True,
        limit_samples=limit_samples
    )
    
    # Explore dataset
    print("\n2. Exploring dataset...")
    classifier.explore_dataset()
    
    # Visualize sample images (commented out to avoid blocking)
    # print("\n3. Visualizing sample images...")
    # classifier.visualize_samples()
    
    # Build and compile model
    print("\n3. Building and compiling model...")
    classifier.build_model(freeze_base=True)
    classifier.compile_model(learning_rate=0.002)  # Increased for faster convergence
    
    # Print model summary
    print("\nModel Summary:")
    classifier.model.summary()
    
    # Train model
    print(f"\n4. Starting initial training ({epochs_initial} epochs)...")
    classifier.train_model(epochs=epochs_initial)
    
    # Plot training history
    print("\n5. Plotting training history...")
    classifier.plot_training_history()
    
    # Fine-tune model
    print(f"\n6. Starting fine-tuning ({epochs_finetune} epochs)...")
    print("="*50)
    classifier.fine_tune_model(epochs=epochs_finetune)
    
    # Evaluate model
    print("\n7. Evaluating model...")
    classifier.evaluate_model()
    
    # Save model
    print("\n8. Saving trained model...")
    model_filename = 'food101_test_model.h5' if TEST_MODE else 'food101_trained_model.h5'
    classifier.save_model(model_filename)
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE!")
    print(f"Model saved as: {model_filename}")
    if not TEST_MODE:
        print("Use predict_food101.py to make predictions with this model")
    else:
        print("Test run complete! Set TEST_MODE = False for full training")
    print("="*60)


if __name__ == "__main__":
    main()