
import json
import faiss
from sentence_transformers import SentenceTransformer
from agents.utils.llm_client import create_llm_client
from agents.utils.prompt_loader import load_prompt

SYSTEM_PROMPT_CONTENT_TOPIC = load_prompt("content_topic")


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
            "llm_client": create_llm_client("deepseek"),
            "llm_model": "deepseek-chat"
        }

    def local_search(self, queries, k):
        print("Entering local_search...")
        self.topic = queries
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.cg_chunks_index.search(queries_embedded, k=10)
        
        self.texts_retrieved = ""
        for idx in I[0]:
            self.texts_retrieved += f"<text>{self.id_to_chunk[idx]["text"]}</text>\n\n"

        return self.texts_retrieved

    def content_framework(self, chunks):
        print("Entering content_framework...")
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT_CONTENT_TOPIC},
            {"role": "user", "content": f"{self.texts_retrieved}"}
            ]
        print("Sending messages to LLM...")
        response = self.content_framework_module["llm_client"].chat.completions.create(
            model=self.content_framework_module["llm_model"],
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        print(completion)
        return completion