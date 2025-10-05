import os
import json
import openai
import faiss
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer 
load_dotenv()


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


system_prompt = ""

embedding_model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
cg_chunks_index = faiss.read_index("database/cg_chunks_20251014.index")
with open("database/cg_chunks_20251014.json", "r", encoding="utf-8") as f:
    cg_chunks_json = json.load(f)
id_to_chunk = {c["id"]: c for c in cg_chunks_json}

def local_search(queries, k):
    queries_embedded = embedding_model.encode([queries])
    _, I = cg_chunks_index.search(queries_embedded, k=10)
    
    chunks = []
    for idx in I[0]:
        chunks.append(id_to_chunk[idx]["text"])
    return chunks

def main():
    print(f"AI: 您好，今天的自媒体内容创作，您对什么样的选题感兴趣？")
    user_content = input("You: ")
    print(f"AI: 根据你的选题方向，我搜索一下本地数据库。")
    chunks = local_search(user_content, 4)
    for text in chunks:
        print(f"AI: {text}")
    

if __name__ == "__main__":
    main()