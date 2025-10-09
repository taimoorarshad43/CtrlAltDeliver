#!/usr/bin/env python3
"""
GPU Detection Test Script
This script tests GPU detection and CUDA availability
"""

import tensorflow as tf
import sys

print("="*60)
print("GPU DETECTION TEST")
print("="*60)

# Basic TensorFlow info
print(f"TensorFlow version: {tf.__version__}")
print(f"Python version: {sys.version}")
print()

# Check if TensorFlow was built with CUDA
print("CUDA Support:")
print(f"  Built with CUDA: {tf.test.is_built_with_cuda()}")
print()

# Check for physical GPU devices
print("Physical GPU Devices:")
gpus = tf.config.list_physical_devices('GPU')
print(f"  Found {len(gpus)} GPU(s)")
for i, gpu in enumerate(gpus):
    print(f"  GPU {i}: {gpu}")
print()

# Check for logical GPU devices
print("Logical GPU Devices:")
logical_gpus = tf.config.list_logical_devices('GPU')
print(f"  Found {len(logical_gpus)} logical GPU(s)")
for i, gpu in enumerate(logical_gpus):
    print(f"  Logical GPU {i}: {gpu}")
print()

# Try to create a tensor on GPU
print("GPU Tensor Test:")
try:
    with tf.device('/GPU:0'):
        test_tensor = tf.constant([1.0, 2.0, 3.0])
        print(f"  Successfully created tensor on GPU: {test_tensor}")
        print(f"  Tensor device: {test_tensor.device}")
except Exception as e:
    print(f"  Failed to create tensor on GPU: {e}")
print()

# Check available devices
print("All Available Devices:")
devices = tf.config.list_physical_devices()
for device in devices:
    print(f"  {device}")
print()

# Check CUDA runtime version
print("CUDA Runtime Info:")
try:
    print(f"  CUDA runtime version: {tf.sysconfig.get_build_info()['cuda_version']}")
    print(f"  cuDNN version: {tf.sysconfig.get_build_info()['cudnn_version']}")
except Exception as e:
    print(f"  Could not get CUDA info: {e}")

print("="*60)
print("TEST COMPLETE")
print("="*60)
