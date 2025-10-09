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
        self.topic = ""
        self.texts_retrieved = ""
        self.content_framework_module = {
            "llm_client": openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY")),
            "llm_model": "gpt-4o-2024-08-06"
        }

    def local_search(self, queries, k):
        self.topic = queries
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.cg_chunks_index.search(queries_embedded, k=10)
        
        self.texts_retrieved = ""
        for idx in I[0]:
            self.texts_retrieved += f"<text>{self.id_to_chunk[idx]["text"]}</text>\n\n"

        return self.texts_retrieved

    def content_framework(self, chunks):
        
        messages=[
            {"role": "system", "content": ""},
            {"role": "assistant", "content": f"{self.texts_retrieved}用户想做<topic>{self.topic}</topic>相关的自媒体内容，请根据上面给予的文字材料。提取与<topic>{self.topic}</topic>角度最相关的核心观点（3个），重要结论（4个）"}
            ]
        response = self.content_framework_module["llm_client"].chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=messages
            )
        completion = response.choices[0].message.content
        return completion