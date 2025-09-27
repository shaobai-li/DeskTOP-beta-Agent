import os
import openai
from dotenv import load_dotenv
load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


system_prompt = ""

def ai_response(prompt):
    llm_openai = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = llm_openai.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
    )
    completion = response.choices[0].message.content
    return completion

while True:
    user_content = input("You: ")
    if user_content in ["exit", "bye"]:
        print(f"AI: Bye!")
        break
    ai_content = ai_response(user_content)
    print(f"AI: {ai_content}")