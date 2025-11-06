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

food_name = 'Biryani'

response = chat(
    model='qwen3:8b',
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


print("=== RAW RESPONSE ===")
print(response.message.content)
print("\n" + "="*50 + "\n")

food_info = FoodInfo.model_validate_json(response.message.content)

print("=== FOOD HISTORY ===")
print(food_info.food_history)
print("\n=== MODERN CULTURE ===")
print(food_info.modern_culture)
