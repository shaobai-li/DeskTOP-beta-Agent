import os
import openai
import faiss
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer 
load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


system_prompt = ""

embedding_model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
index = faiss.read_index("database/cg_chunks_20251014.index")

def local_search(queries, k):
    queries_embedded = embedding_model.encode([queries])
    D, I = index.search(queries_embedded, k=10)
    return ["我是中国人", "我爱中国"]

def main():
    print(f"AI: 您好，今天的自媒体内容创作，您对什么样的选题感兴趣？")
    user_content = input("You: ")
    print(f"AI: 根据你的选题方向，我搜索一下本地数据库。")
    texts = local_search(user_content, 4)
    for text in texts:
        print(f"AI: {text}")

if __name__ == "__main__":
    main()