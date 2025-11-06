#!/usr/bin/env python3
"""
Food History CLI - Get historical and cultural information about any food dish.
"""

import argparse
import sys
import time
from ollama import chat
from pydantic import BaseModel


class FoodInfo(BaseModel):
    food_history: str
    modern_culture: str


# ReAct Prompting: First get the model to think and reason
react_prompt = """
You are a food expert using ReAct (Reasoning + Acting) methodology.

For the dish provided, follow these steps:

**Thought 1:** What do I know about the origins and historical context of this dish?
**Action 1:** Gather key historical facts (region of origin, time period, cultural significance, evolution)

**Thought 2:** How has this dish evolved and what is its significance in modern times?
**Action 2:** Analyze current cultural impact, popularity, variations, and modern adaptations

**Thought 3:** How can I best structure this information into two compelling paragraphs?
**Action 3:** Create two well-crafted paragraphs (each ~100 words):
- Paragraph 1 (food_history): Focus on origins, traditional preparation, and historical journey
- Paragraph 2 (modern_culture): Focus on contemporary significance, global spread, and cultural impact

Now, provide the final structured output with your analysis.
"""


def get_food_info(food_name, model='qwen3:8b', verbose=False):
    """
    Get food history and culture information for a given dish.
    
    Args:
        food_name: Name of the food dish
        model: Ollama model to use (default: qwen3:8b)
        verbose: If True, show raw response from the model
        
    Returns:
        FoodInfo object containing food_history and modern_culture
    """
    print(f"⏳ Using model '{model}' - generating response (this may take 1-2 minutes)...", flush=True)
    start_time = time.time()
    
    response = chat(
        model=model,
        messages=[
            {
                'role': 'system',
                'content': react_prompt
            },
            {
                'role': 'user',
                'content': f'Apply ReAct methodology to provide comprehensive information about: {food_name}',
            },
        ],
        format=FoodInfo.model_json_schema(),
    )
    
    elapsed_time = time.time() - start_time
    print(f"✓ Response generated in {elapsed_time:.1f} seconds\n", flush=True)
    
    if verbose:
        print("=== RAW RESPONSE ===")
        print(response.message.content)
        print("\n" + "="*50 + "\n")
    
    return FoodInfo.model_validate_json(response.message.content)


def main():
    """Main CLI function."""
    parser = argparse.ArgumentParser(
        description='Get historical and cultural information about any food dish.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s Biryani
  %(prog)s "Pad Thai" --verbose
  %(prog)s Pizza --json
  %(prog)s Tacos --model llama3.2:1b
  %(prog)s Sushi --model llama2:latest --verbose
        """
    )
    
    parser.add_argument(
        'food_name',
        type=str,
        help='Name of the food dish to research'
    )
    
    parser.add_argument(
        '-v', '--verbose',
        action='store_true',
        help='Show raw response from the model'
    )
    
    parser.add_argument(
        '-j', '--json',
        action='store_true',
        help='Output in JSON format'
    )
    
    parser.add_argument(
        '-m', '--model',
        type=str,
        default='qwen3:8b',
        help='Ollama model to use (default: qwen3:8b)'
    )
    
    args = parser.parse_args()
    
    try:
        print(f"Researching: {args.food_name}...\n")
        food_info = get_food_info(args.food_name, model=args.model, verbose=args.verbose)
        
        if args.json:
            # Output as JSON
            print(food_info.model_dump_json(indent=2))
        else:
            # Output formatted text
            print(f"=== FOOD HISTORY: {args.food_name.upper()} ===")
            print(food_info.food_history)
            print(f"\n=== MODERN CULTURE ===")
            print(food_info.modern_culture)
            
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
