import os
import json
import faiss
import openai
from sentence_transformers import SentenceTransformer

from dotenv import load_dotenv
load_dotenv()



def get_llm_client(choice="chatgpt"):
    if choice == "chatgpt":
        return openai.OpenAI(
            api_key=os.environ.get("OPENAI_API_KEY")
            )
    elif choice == "deepseek":
        return openai.OpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY"), 
            base_url=os.environ.get("DEEPSEEK_BASE_URL")
            )
    else:
        raise ValueError(f"Undefined model choice '{choice}'")

class SearchAgent:
    
    def __init__(self):
        self.embedding_model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
        self.cg_chunks_index = faiss.read_index("database/cg_chunks_20251014.index")
        with open("database/cg_chunks_20251014.json", "r", encoding="utf-8") as f:
            cg_chunks_json = json.load(f)
        self.id_to_chunk = {c["id"]: c for c in cg_chunks_json}
        
        self.content_framework_module = {
            "llm_client": openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY")),
            "llm_model": "gpt-4o-2024-08-06"
        }

    def local_search(self, queries, k):
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.cg_chunks_index.search(queries_embedded, k=10)
        
        chunks = []
        for idx in I[0]:
            chunks.append(self.id_to_chunk[idx]["text"])
        return chunks

    def content_framework(self):
        messages=[
            {"role": "system", "content": ""},
            {"role": "assistant", "content": "搜索出来一句话<text>床前明月光</text>"}
            ]
        response = self.content_framework_module["llm_client"].chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=messages
            )
        completion = response.choices[0].message.content
        return completion