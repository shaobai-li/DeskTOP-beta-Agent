from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
from datetime import datetime
from models.article import Article
from models.tag import Tag
from utils import to_camel_case, uuid7
from config.settings import VECTOR_INDEX_PATH

# RAG related import
from sentence_transformers import SentenceTransformer
import faiss
from huggingface_hub import snapshot_download



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
                      author_name: str = "", tags_by_author: str = "", content: str = "", db: AsyncSession = None) -> Dict:
        """创建新文章"""
        # 检查标题是否已存在
        result = await db.execute(
            select(Article).where(Article.title == title.strip())
        )
        if result.scalar_one_or_none():
            raise ValueError("文章标题已存在")

        # 创建新文章
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

        if content is not None:
            article.content = content.strip()

        # 如果有任何更新，更新 updated_at
        if any([title is not None, date is not None, source_platform is not None, 
                author_name is not None, tags_by_author is not None, content is not None]):
            article.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            await db.commit()
            await db.refresh(article)
        
        return to_camel_case([article.to_dict()])[0]

    @staticmethod
    async def delete_article(article_id: str, db: AsyncSession = None) -> Dict:
        """删除指定 article_id 的文章"""
        article = await db.get(Article, article_id)
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")

        await db.delete(article)
        await db.commit()
        
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