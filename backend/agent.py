import json
import faiss
from sentence_transformers import SentenceTransformer 

class SearchAgent:
    def __init__(self):
        self.embedding_model = SentenceTransformer('BAAI/bge-large-zh-v1.5')
        self.cg_chunks_index = faiss.read_index("database/cg_chunks_20251014.index")
    with open("database/cg_chunks_20251014.json", "r", encoding="utf-8") as f:
        cg_chunks_json = json.load(f)
    id_to_chunk = {c["id"]: c for c in cg_chunks_json}

    def local_search(self, queries, k):
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.cg_chunks_index.search(queries_embedded, k=10)
        
        chunks = []
        for idx in I[0]:
            chunks.append(self.id_to_chunk[idx]["text"])
        return chunks