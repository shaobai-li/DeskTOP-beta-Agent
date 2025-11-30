from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from services.article_service import ArticleService
from db import get_db

router = APIRouter()


class ArticleCreate(BaseModel):
    title: str
    date: str
    source_platform: str = "小红书"
    author_name: str = ""
    tags_by_author: str = ""


class ArticleUpdate(BaseModel):
    title: str | None = None
    date: str | None = None
    source_platform: str | None = None
    author_name: str | None = None
    tags_by_author: str | None = None


@router.get("/articles")
async def get_articles(db: AsyncSession = Depends(get_db)):
    """读取所有文章数据（包含关联的标签）"""
    try:
        return await ArticleService.get_all_articles(db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取文章失败: {str(e)}"
        )


@router.post("/articles", status_code=status.HTTP_201_CREATED)
async def create_article(article: ArticleCreate, db: AsyncSession = Depends(get_db)):
    """创建新文章"""
    try:
        return await ArticleService.create_article(
            title=article.title,
            date=article.date,
            source_platform=article.source_platform,
            author_name=article.author_name,
            tags_by_author=article.tags_by_author,
            db=db
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"创建文章失败: {str(e)}"
        )


@router.put("/articles/{article_id}", status_code=status.HTTP_200_OK)
async def update_article(article_id: int, update_data: ArticleUpdate, db: AsyncSession = Depends(get_db)):
    """更新指定 article_id 的文章"""
    try:
        return await ArticleService.update_article(
            article_id=article_id,
            title=update_data.title,
            date=update_data.date,
            source_platform=update_data.source_platform,
            author_name=update_data.author_name,
            tags_by_author=update_data.tags_by_author,
            db=db
        )
    except ValueError as e:
        status_code = status.HTTP_400_BAD_REQUEST if "已存在" in str(e) else status.HTTP_404_NOT_FOUND
        raise HTTPException(
            status_code=status_code,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"更新失败: {str(e)}"
        )


@router.delete("/articles/{article_id}", status_code=status.HTTP_200_OK)
async def delete_article(article_id: int, db: AsyncSession = Depends(get_db)):
    """删除指定 article_id 的文章"""
    try:
        return await ArticleService.delete_article(article_id, db)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"删除失败: {str(e)}"
        )

