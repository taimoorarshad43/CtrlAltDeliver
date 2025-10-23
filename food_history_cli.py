#!/usr/bin/env python3
"""
Food History CLI Component

A simple command-line interface that uses Ollama to get the history of food items.
"""

import argparse
import sys
from ollama import chat
from ollama import ChatResponse

def get_food_history(food_item: str, model: str = 'llama2') -> str:
    """
    Get the history of a food item using Ollama.
    
    Args:
        food_item: The name of the food item to research
        model: The Ollama model to use for the query
        
    Returns:
        A string containing the food history information
    """
    prompt = f"""Please provide a comprehensive history of {food_item}. Include:

1. Origin and early history
2. Cultural significance and traditions  
3. Evolution and spread across different regions
4. Historical events that influenced its development
5. Modern variations and contemporary significance
6. Interesting historical facts or anecdotes

Format your response in a clear, engaging way suitable for someone interested in food history."""

    try:
        response: ChatResponse = chat(model=model, messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        
        return response.message.content
        
    except Exception as e:
        print(f"Error querying Ollama: {str(e)}", file=sys.stderr)
        return None

def main():
    """Main function to parse arguments and run the CLI."""
    parser = argparse.ArgumentParser(
        description="Get the history of food items using Ollama AI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python food_history_cli.py pizza
  python food_history_cli.py "chocolate cake" --model llama3.2
  python food_history_cli.py sushi -m gemma3
        """
    )
    
    parser.add_argument(
        'food_item',
        type=str,
        help='The food item to research'
    )
    
    parser.add_argument(
        '--model', '-m',
        type=str,
        default='gemma3',
        help='Ollama model to use (default: llama2)'
    )
    
    args = parser.parse_args()
    
    print(f"🍽️  Researching history of: {args.food_item}")
    print("=" * 50)
    
    history = get_food_history(args.food_item, args.model)
    
    if history:
        print(history)
    else:
        print("Failed to retrieve food history.", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
