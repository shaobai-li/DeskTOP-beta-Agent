import os
import openai
from dotenv import load_dotenv
load_dotenv()

def create_llm_client(provider="chatgpt"):
    """
    Factory method for initializing LLM clients.
    """
    if provider == "chatgpt":
        return openai.OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
        )
    elif provider == "deepseek":
        return openai.OpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY"),
            base_url=os.environ.get("DEEPSEEK_BASE_URL")
        )
    else:
        raise ValueError(f"Unknown LLM provider: {provider}")