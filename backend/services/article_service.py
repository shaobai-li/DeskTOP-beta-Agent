from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
from datetime import datetime
from models.article import Article
from models.tag import Tag
from utils import to_camel_case, uuid7
from config.settings import VECTOR_INDEX_PATH, BGE_MODEL_PATH
import re
import numpy as np

# RAG related import
from sentence_transformers import SentenceTransformer
import faiss
from huggingface_hub import snapshot_download

# Crawler related import
from infra.parser.factory import get_parser
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig
from crawl4ai.content_scraping_strategy import LXMLWebScrapingStrategy



class ArticleService:
    """文章业务逻辑服务层"""

    @staticmethod
    async def get_all_articles(db: AsyncSession) -> List[Dict]:
        """获取所有文章数据（包含关联的标签）"""
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.tags))
            .order_by(Article.created_at.desc())
        )
        articles = result.scalars().all()
        
        articles_list = []
        for article in articles:
            article_dict = article.to_dict()
            # 添加标签详细信息（包含tagId和name）用于编辑
            tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in article.tags]
            article_dict['tagsInfo'] = tags_info
            # 标签名称字符串用于表格显示
            tags_names = [tag.name for tag in article.tags]
            article_dict['tags'] = ', '.join(tags_names) if tags_names else ''
            articles_list.append(article_dict)
        
        return to_camel_case(articles_list)

    @staticmethod
    async def get_articles_for_embedding(db: AsyncSession) -> List[Dict]:
        """获取用于向量检索的精简文章数据（仅 embedding_id, title, content）
        
        注意：按 embedding_id 升序排列，与 faiss 索引顺序一致
        """
        result = await db.execute(
            select(Article).order_by(Article.embedding_id.asc())
        )
        articles = result.scalars().all()
        return [
            {
                "embedding_id": article.embedding_id,
                "title": article.title,
                "content": article.content
            }
            for article in articles
        ]

    @staticmethod
    async def create_article(title: str, date: str, source_platform: str = "小红书", 
                      author_name: str = "", tags_by_author: str = "", content: str = "", 
                      db: AsyncSession = None, auto_embed: bool = True) -> Dict:
        """创建新文章
        """
        result = await db.execute(
            select(Article).where(Article.title == title.strip())
        )
        if result.scalar_one_or_none():
            raise ValueError("文章标题已存在")

        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        new_article = Article(
            article_id=uuid7(),
            title=title.strip(),
            date=date.strip(),
            source_platform=source_platform.strip(),
            author_name=author_name.strip(),
            tags_by_author=tags_by_author.strip(),
            content=content.strip(),
            created_at=now,
            updated_at=now
        )
        
        db.add(new_article)
        await db.commit()
        await db.refresh(new_article)
        
        if auto_embed and content.strip():
            try:
                print(f"# 自动向量化并添加到索引...")
                await ArticleService.add_article_to_vector_index(
                    new_article.article_id, db
                )
                await db.refresh(new_article)
            except Exception as e:
                print(f"⚠️  向量化失败: {str(e)}")
        
        return to_camel_case([new_article.to_dict()])[0]

    @staticmethod
    async def update_article(article_id: str, title: Optional[str] = None, date: Optional[str] = None,
                      source_platform: Optional[str] = None, author_name: Optional[str] = None,
                      tags_by_author: Optional[str] = None, content: Optional[str] = None, db: AsyncSession = None) -> Dict:
        """更新指定 article_id 的文章"""
        article = await db.get(Article, article_id)
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")

        if title is not None:
            new_title = title.strip()
            # 标题重复检查
            if new_title.lower() != article.title.lower():
                result = await db.execute(
                    select(Article).where(Article.title == new_title, Article.article_id != article_id)
                )
                if result.scalar_one_or_none():
                    raise ValueError("文章标题已存在")
            article.title = new_title

        if date is not None:
            article.date = date.strip()

        if source_platform is not None:
            article.source_platform = source_platform.strip()

        if author_name is not None:
            article.author_name = author_name.strip()

        if tags_by_author is not None:
            article.tags_by_author = tags_by_author.strip()

        content_changed = content is not None and content.strip() != article.content
        if content is not None:
            article.content = content.strip()

        # 如果有任何更新，更新 updated_at
        if any([title is not None, date is not None, source_platform is not None, 
                author_name is not None, tags_by_author is not None, content is not None]):
            article.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            await db.commit()
            await db.refresh(article)

        # content 有变化时，同步更新向量索引
        if content_changed and article.embedding_id is not None and VECTOR_INDEX_PATH.exists():
            try:
                index = faiss.read_index(str(VECTOR_INDEX_PATH))
                if isinstance(index, faiss.IndexIDMap):
                    embedding_model = SentenceTransformer(str(BGE_MODEL_PATH), device="cpu")
                    new_embedding = embedding_model.encode([article.content], normalize_embeddings=True)
                    index.remove_ids(np.array([article.embedding_id], dtype=np.int64))
                    index.add_with_ids(new_embedding, np.array([article.embedding_id], dtype=np.int64))
                    faiss.write_index(index, str(VECTOR_INDEX_PATH))
                    print(f"# 已更新向量索引 embedding_id={article.embedding_id}")
            except Exception as e:
                print(f"⚠️  向量索引更新失败: {str(e)}")

        return to_camel_case([article.to_dict()])[0]

    @staticmethod
    async def delete_article(article_id: str, db: AsyncSession = None) -> Dict:
        """删除指定 article_id 的文章，同时删除对应的向量索引数据"""
        article = await db.get(Article, article_id)
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")

        embedding_id = article.embedding_id

        await db.delete(article)
        await db.commit()

        if embedding_id is not None and VECTOR_INDEX_PATH.exists():
            index = faiss.read_index(str(VECTOR_INDEX_PATH))
            index.remove_ids(np.array([embedding_id], dtype=np.int64))
            faiss.write_index(index, str(VECTOR_INDEX_PATH))
            print(f"# 已从向量索引中删除 embedding_id={embedding_id}")

        return {"message": f"文章 {article_id} 已删除"}

    @staticmethod
    async def update_article_tags(article_id: str, tag_ids: List[str], db: AsyncSession) -> Dict:
        """更新文章的标签关联"""
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.tags))
            .where(Article.article_id == article_id)
        )
        article = result.scalar_one_or_none()
        
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")
        
        # 获取要关联的标签
        if tag_ids:
            result = await db.execute(
                select(Tag).where(Tag.tag_id.in_(tag_ids))
            )
            tags = result.scalars().all()
            if len(tags) != len(tag_ids):
                raise ValueError("部分标签不存在")
        else:
            tags = []
        
        # 更新关联关系
        article.tags = tags
        await db.commit()
        await db.refresh(article)
        
        article_dict = article.to_dict()
        tags_info = [{"tagId": tag.tag_id, "name": tag.name} for tag in article.tags]
        article_dict['tags'] = tags_info
        return to_camel_case([article_dict])[0]

    @staticmethod
    async def add_article_to_vector_index(article_id: str, db: AsyncSession):
        """增量添加单篇文章到向量索引
        
        功能步骤：
        1. 获取文章并验证
        2. 生成 embedding_id（当前最大ID + 1）
        3. 向量化文章内容
        4. 加载/创建 IndexIDMap 索引
        5. 添加向量到索引
        6. 更新数据库中的 embedding_id
        7. 保存索引文件
        """
        article = await db.get(Article, article_id)
        if not article:
            raise ValueError(f"文章不存在: {article_id}")
        
        if article.embedding_id is not None:
            raise ValueError(f"文章已有 embedding_id ({article.embedding_id})，无需重复添加")
        
        if not article.content or article.content.strip() == "":
            raise ValueError("文章内容为空，无法向量化")
        
        result = await db.execute(
            select(func.max(Article.embedding_id))
        )
        max_embedding_id = result.scalar()
        new_embedding_id = (max_embedding_id + 1) if max_embedding_id is not None else 0
        
        if not VECTOR_INDEX_PATH.exists():
            raise ValueError(
                "向量索引文件不存在，无法增量添加。"
            )
        
        index = faiss.read_index(str(VECTOR_INDEX_PATH))
        if not isinstance(index, faiss.IndexIDMap):
            raise ValueError(
                "现有索引不是 IndexIDMap 类型，无法增量添加。"
            )
        
        embedding_model = SentenceTransformer(str(BGE_MODEL_PATH), device="cpu")
        embedding = embedding_model.encode([article.content], normalize_embeddings=True)
        
        embedding_id_array = np.array([new_embedding_id], dtype=np.int64)
        index.add_with_ids(embedding, embedding_id_array)
        
        article.embedding_id = new_embedding_id
        await db.commit()
        
        faiss.write_index(index, str(VECTOR_INDEX_PATH))

    @staticmethod
    async def update_embedding_ids(embedding_id_list: List[int], db: AsyncSession = None):
        """批量更新所有文章的 embedding_id，与 embedding_id_list 长度必须一致"""
        # assumption: embedding_id_list is a list of embedding_id in新的顺序和 Article 记录顺序严格一致
        
        articles = await db.execute(select(Article).order_by(Article.article_id.asc()))
        articles_list = articles.scalars().all()

        if len(articles_list) != len(embedding_id_list):
            raise ValueError(f"传入的 embedding_id_list 长度({len(embedding_id_list)})和当前文章数({len(articles_list)})不一致")

        for article, embedding_id in zip(articles_list, embedding_id_list):
            article.embedding_id = embedding_id
            db.add(article)  # 显式标记对象需要更新

        await db.flush()  # 强制将修改刷新到数据库
        await db.commit()

    @staticmethod
    async def rebuild_articles_embedding(db: AsyncSession = None, tagIds: List[str] = None) -> Dict:
        # 从配置文件读取路径，生成向量索引文件的完整路径
        import time
        tic = time.time()

        print("# 读取所有文章")
        result = await db.execute(
            select(Article).order_by(Article.article_id.asc())
        )
        articles = result.scalars().all()
        article_contents = [article['content'] if article['content'] else "" for article in articles]
        
        print("# 加载embedding模型")
        local_path = snapshot_download("BAAI/bge-large-zh-v1.5")
        embedding_model = SentenceTransformer(local_path, device="cpu")
        print("# 对文章进行向量化")
        embedding = embedding_model.encode(article_contents, normalize_embeddings=True)
        print("# 创建index")
        index = faiss.IndexFlatL2(embedding.shape[1])
        print("# 添加向量到index")
        index.add(embedding)
        print("# 写入index文件")
        faiss.write_index(index, str(VECTOR_INDEX_PATH))
        print("# 写入index文件完成")

        print("# 更新embedding_id到数据库中")
        embedding_id_list = [i for i in range(len(articles))]
        await ArticleService.update_embedding_ids(embedding_id_list, db)

        toc = time.time()
        return {"message": f"重建文章向量数据库成功，索引文件: {VECTOR_INDEX_PATH}", "duration": {toc - tic}}

    @staticmethod
    async def fetch_article_from_url(url: str) -> Dict:
        parser = get_parser(url)
        if not parser:
            raise ValueError("不支持的平台，目前仅支持小红书")
        
        headers = {
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) "
                         "AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 XiaoHongShu/8.25.0"
        }
        config = CrawlerRunConfig(
            scraping_strategy=LXMLWebScrapingStrategy(),
            verbose=False
        )
        
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(url=url, config=config, magic=True, headers=headers)
            if not result.success or not result.html:
                raise Exception("页面抓取失败或内容为空")
            html = result.html
        
        data = await parser.parse(html, url)
        
        words = data["words"]
        if not words:
            raise ValueError("无法提取文章内容")
        
        parts = words.split()
        title = parts[0] if parts else "无标题"
        content = words
        
        tags = re.findall(r'#(\S+)', words)
        tags_by_author = " ".join(f"#{tag}" for tag in tags)
        
        date_match = re.search(r'(\d{2}-\d{2})', words)
        date = date_match.group(1) if date_match else datetime.now().strftime("%m-%d")
        
        return to_camel_case([{
            "title": title,
            "date": date,
            "source_platform": data["source_platform"],
            "author_name": data["author_name"],
            "tags_by_author": tags_by_author,
            "content": content
        }])[0]