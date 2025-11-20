from ollama import chat
from pydantic import BaseModel
import sys
from typing import Dict, Optional


class FoodInfo(BaseModel):
    food_history: str
    modern_culture: str
    fun_facts: str


# ReAct Prompting: First get the model to think and reason
REACT_PROMPT = """
You are a food expert using ReAct (Reasoning + Acting) methodology.

For the dish provided, follow these steps:

**Thought 1:** What do I know about the origins and historical context of this dish?
**Action 1:** Gather key historical facts (region of origin, time period, cultural significance, evolution, date of origin)

**Thought 2:** How has this dish evolved and what is its significance in modern times?
**Action 2:** Analyze current cultural impact, popularity, variations, and modern adaptations

**Thought 3:** What are some interesting, specific and lesser-known fun facts about this dish? 
**Action 3:** Gather three fun facts which are interesting, surprising and trivia points about the dish.

**Thought 4:** How can I best structure this information into three compelling paragraphs?
**Action 4:** Create three well-crafted paragraphs (each ~100 words). Below is the structure:

- Paragraph 1 (food_history): Focus on origins, traditional preparation, and historical journey
- Paragraph 2 (modern_culture): Focus on contemporary significance, global spread, and cultural impact
- Paragraph 3 (fun_facts): Focus on 3 surprising and fun facts about the dish. Please list each fun facts in bullets in separate lines. 

Now, provide the final structured output with your analysis.
"""


def get_food_history(
    food_name: str,
    model: str = 'qwen3:8b',
    verbose: bool = False
) -> Dict[str, str]:
    """
    Get comprehensive food history information using ollama.
    
    Args:
        food_name (str): Name of the food item to get history for
        model (str): Ollama model name to use. Default is 'qwen3:8b'.
                    Recommended faster models: 'llama3.2:3b', 'qwen2.5:3b', 'phi3:mini'
        verbose (bool): If True, print debug information. Default is False.
    
    Returns:
        Dict[str, str]: Dictionary with keys 'food_history', 'modern_culture', and 'fun_facts'
    
    Raises:
        ConnectionError: If unable to connect to ollama server
        ValueError: If the model response cannot be parsed
        Exception: For other errors during the API call
    """
    if verbose:
        print(f"🔍 Getting food history for: {food_name}")
        print(f"📦 Using model: {model}")
    
    # Generate the JSON schema
    schema = FoodInfo.model_json_schema()
    
    if verbose:
        print(f"⏳ Sending request to ollama...")
    
    try:
        response = chat(
            model=model,
            messages=[
                {
                    'role': 'system',
                    'content': REACT_PROMPT
                },
                {
                    'role': 'user',
                    'content': f'Apply ReAct methodology to provide comprehensive information about: {food_name}',
                },
            ],
            format=schema,
        )
        
        if verbose:
            print(f"✓ Received response from ollama!")
        
        # Parse the response
        food_info = FoodInfo.model_validate_json(response.message.content)
        
        # Return as dictionary for easy JSON serialization
        return {
            'food_history': food_info.food_history,
            'modern_culture': food_info.modern_culture,
            'fun_facts': food_info.fun_facts
        }
        
    except ConnectionError as e:
        error_msg = f"Connection error: Unable to connect to ollama server. Make sure ollama is running."
        if verbose:
            print(f"✗ {error_msg}")
            print(f"   Details: {e}")
        raise ConnectionError(error_msg) from e
    
    except Exception as e:
        if isinstance(e, ValueError) or 'json' in str(e).lower() or 'parse' in str(e).lower():
            error_msg = f"Failed to parse model response. The model might not have returned valid JSON."
            if verbose:
                print(f"✗ {error_msg}")
                print(f"   Raw response: {getattr(response, 'message', {}).get('content', 'N/A')}")
            raise ValueError(error_msg) from e
        else:
            error_msg = f"Error getting food history: {type(e).__name__}: {e}"
            if verbose:
                print(f"✗ {error_msg}")
            raise Exception(error_msg) from e


# Example usage and testing
if __name__ == "__main__":
    food_name = 'Chicken Chowmein'
    # model_name = 'qwen3:8b'
    model_name = 'llama3.2:3b'
    # model_name = 'phi3:mini'
    # model_name = 'qwen2.5:3b'
    
    try:
        result = get_food_history(food_name, model=model_name, verbose=True)
        
        print("\n" + "="*50)
        print("=== FOOD HISTORY ===")
        print("="*50)
        print(result['food_history'])
        print("\n" + "="*50)
        print("=== MODERN CULTURE ===")
        print("="*50)
        print(result['modern_culture'])
        print("\n" + "="*50)
        print("=== FUN FACTS ===")
        print("="*50)
        print(result['fun_facts'])
        print("="*50)
        
    except Exception as e:
        print(f"\n✗ Error: {e}")
        sys.exit(1)
