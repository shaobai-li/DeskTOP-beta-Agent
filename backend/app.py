import os
import json
import openai
import faiss
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer 
load_dotenv()

from agents import SearchAgent

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


system_prompt = ""


def main():

    print("加载 search_agent ...")
    search_agent = SearchAgent()
    print("加载成功\n")

    print(f"AI: 您好，今天的自媒体内容创作，您对什么样的选题感兴趣？")
    user_content = input("You: ")
    print(f"AI: 根据你的选题方向，我搜索一下本地数据库。")
    chunks = search_agent.local_search(user_content, 4)
    for text in chunks:
        print(f"AI: {text}")
    

if __name__ == "__main__":
    main()