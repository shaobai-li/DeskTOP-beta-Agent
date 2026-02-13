import json
import asyncio
import faiss
import os
from sentence_transformers import SentenceTransformer
from agents.utils.llm_client import create_llm_client
from agents.utils.prompt_loader import load_prompt
from config.settings import VECTOR_INDEX_PATH, BGE_MODEL_PATH
from services.article_service import ArticleService
from db.session import AsyncSessionLocal


class SearchAgent:
    
    def __init__(self, agent_config: dict = None):
        """
        初始化 SearchAgent（同步部分）
        请使用 SearchAgent.create() 工厂方法来创建实例
        
        Args:
            agent_config: 智能体配置，包含 default_prompt_dir
        """

        self.embedding_model = SentenceTransformer(str(BGE_MODEL_PATH), device="cpu")
        self.vector_index = faiss.read_index(os.path.relpath(str(VECTOR_INDEX_PATH)))
        self.topic = ""
        self.texts_retrieved = ""
        self.content_framework_module = {
            "llm_client": create_llm_client("deepseek"),
            "llm_model": "deepseek-chat"
        }
        self.agent_config = agent_config or {}
        # 以下属性需要通过 _async_init() 初始化
        self.articles_table = []
        self.id_to_article = {}
    
    @classmethod
    async def create(cls, agent_config: dict = None):
        """
        异步工厂方法，用于创建 SearchAgent 实例
        
        Args:
            agent_config: 智能体配置，包含 default_prompt_dir
        
        Returns:
            SearchAgent: 完全初始化的实例
        """
        instance = cls(agent_config)
        await instance._async_init()
        return instance
    
    async def _async_init(self):
        """异步初始化：从数据库加载文章数据"""
        async with AsyncSessionLocal() as db:
            self.articles_table = await ArticleService.get_articles_for_embedding(db)
        self.id_to_article = {c["embedding_id"]: c for c in self.articles_table}
    
    def _get_system_prompt(self) -> str:
        """获取系统提示词，使用 default_prompt_dir 加载"""
        prompt_dir = self.agent_config.get("default_prompt_dir", "agents/prompts/")
        return load_prompt("content_topic", prompt_dir)

    def local_search(self, queries, k):
        print("Entering local_search...")
        self.topic = queries
        queries_embedded = self.embedding_model.encode([queries])
        _, I = self.vector_index.search(queries_embedded, k=k)
        
        self.texts_retrieved = ""
        for idx in I[0]:
            article = self.id_to_article.get(idx)
            if article:
                self.texts_retrieved += f"<text>{article['content']}</text>\n\n"
            else:
                print(f"Warning: embedding_id {idx} not found in articles table")

        return self.texts_retrieved

    def content_framework(self, chunks):
        print("Entering content_framework...")
        system_prompt = self._get_system_prompt()
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"{self.texts_retrieved}"}
            ]
        print("Sending messages to LLM...")
        response = self.content_framework_module["llm_client"].chat.completions.create(
            model=self.content_framework_module["llm_model"],
            messages=messages
            )
        print("Received response from LLM...")
        completion = response.choices[0].message.content
        
        return completion