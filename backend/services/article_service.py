from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Dict, Optional
from datetime import datetime
from models.article import Article
from models.tag import Tag
from utils import to_camel_case, uuid7


class ArticleService:
    """文章业务逻辑服务层"""

    @staticmethod
    async def get_all_articles(db: AsyncSession) -> List[Dict]:
        """获取所有文章数据（包含关联的标签）"""
        result = await db.execute(
            select(Article)
            .options(selectinload(Article.tags))
            .order_by(Article.article_id.desc())
        )
        articles = result.scalars().all()
        
        articles_list = []
        for article in articles:
            article_dict = article.to_dict()
            # 添加标签名称字符串
            tags_names = [tag.name for tag in article.tags]
            article_dict['tags'] = ', '.join(tags_names) if tags_names else ''
            articles_list.append(article_dict)
        
        return to_camel_case(articles_list)

    @staticmethod
    async def create_article(title: str, date: str, source_platform: str = "小红书", 
                      author_name: str = "", tags_by_author: str = "", db: AsyncSession = None) -> Dict:
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
            created_at=now,
            updated_at=now
        )
        
        db.add(new_article)
        await db.commit()
        await db.refresh(new_article)
        
        return to_camel_case([new_article.to_dict()])[0]

    @staticmethod
    async def update_article(article_id: int, title: Optional[str] = None, date: Optional[str] = None,
                      source_platform: Optional[str] = None, author_name: Optional[str] = None,
                      tags_by_author: Optional[str] = None, db: AsyncSession = None) -> Dict:
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

        # 如果有任何更新，更新 updated_at
        if any([title is not None, date is not None, source_platform is not None, 
                author_name is not None, tags_by_author is not None]):
            article.updated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            await db.commit()
            await db.refresh(article)
        
        return to_camel_case([article.to_dict()])[0]

    @staticmethod
    async def delete_article(article_id: int, db: AsyncSession = None) -> Dict:
        """删除指定 article_id 的文章"""
        article = await db.get(Article, article_id)
        if not article:
            raise ValueError(f"文章 {article_id} 不存在")

        await db.delete(article)
        await db.commit()
        
        return {"message": f"文章 {article_id} 已删除"}

