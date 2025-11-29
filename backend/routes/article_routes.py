import sqlite3
from config.settings import DB_DEV_PATH
from fastapi import APIRouter, HTTPException, status
from .utils import *
from pydantic import BaseModel
from datetime import datetime

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
def get_articles():
    """读取所有文章数据（包含关联的标签）"""
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    # 获取所有文章
    cur.execute("""
        SELECT article_id, title, date, source_platform, author_name, tags_by_author
        FROM articles
        ORDER BY article_id DESC
    """)
    articles = cur.fetchall()

    # 为每篇文章获取关联的标签名称
    for article in articles:
        cur.execute("""
            SELECT t.name
            FROM tags t
            INNER JOIN article_tags at ON t.tag_id = at.tag_id
            WHERE at.article_id = ?
        """, (article['article_id'],))
        tags = cur.fetchall()
        article['tags'] = ', '.join([tag['name'] for tag in tags]) if tags else ''

    conn.close()
    return to_camel_case(articles)

@router.post("/articles", status_code=status.HTTP_201_CREATED)
def create_article(article: ArticleCreate):
    """创建新文章"""
    if not DB_DEV_PATH.exists():
        raise HTTPException(status_code=500, detail="数据库文件不存在")

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    # 检查标题是否已存在
    cur.execute("SELECT article_id FROM articles WHERE title = ?", (article.title.strip(),))
    if cur.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="文章标题已存在")

    # 创建新文章
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    new_article = {
        "title": article.title.strip(),
        "date": article.date.strip(),
        "source_platform": article.source_platform.strip(),
        "author_name": article.author_name.strip(),
        "tags_by_author": article.tags_by_author.strip(),
        "created_at": now,
        "updated_at": now
    }

    try:
        cur.execute("""
            INSERT INTO articles (
                title, date, source_platform, author_name, tags_by_author,
                created_at, updated_at
            )
            VALUES (
                :title, :date, :source_platform, :author_name, :tags_by_author,
                :created_at, :updated_at
            )
        """, new_article)
        conn.commit()
        
        # 获取插入的ID
        article_id = cur.lastrowid
        new_article["article_id"] = article_id
        
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"创建文章失败: {str(e)}")
    
    conn.close()
    return to_camel_case(new_article)

@router.put("/articles/{article_id}", status_code=status.HTTP_200_OK)
def update_article(article_id: int, update_data: ArticleUpdate):
    """
    更新指定 article_id 的文章
    - 支持部分更新（只传想改的字段就行）
    """
    if not DB_DEV_PATH.exists():
        raise HTTPException(status_code=404, detail="数据库文件不存在")

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    # 检查文章是否存在
    cur.execute("SELECT title, date, source_platform, author_name, tags_by_author FROM articles WHERE article_id = ?", (article_id,))
    target_article = cur.fetchone()

    if not target_article:
        conn.close()
        raise HTTPException(status_code=404, detail=f"文章 {article_id} 不存在")

    # 准备更新的字段
    update_fields = []
    update_values = []

    if update_data.title is not None:
        new_title = update_data.title.strip()
        # 标题重复检查
        if new_title.lower() != target_article["title"].lower():
            cur.execute("SELECT article_id FROM articles WHERE title = ? AND article_id != ?", 
                       (new_title, article_id))
            if cur.fetchone():
                conn.close()
                raise HTTPException(status_code=400, detail="文章标题已存在")
        update_fields.append("title = ?")
        update_values.append(new_title)

    if update_data.date is not None:
        update_fields.append("date = ?")
        update_values.append(update_data.date.strip())

    if update_data.source_platform is not None:
        update_fields.append("source_platform = ?")
        update_values.append(update_data.source_platform.strip())

    if update_data.author_name is not None:
        update_fields.append("author_name = ?")
        update_values.append(update_data.author_name.strip())

    if update_data.tags_by_author is not None:
        update_fields.append("tags_by_author = ?")
        update_values.append(update_data.tags_by_author.strip())

    if not update_fields:
        conn.close()
        return to_camel_case(target_article)

    # 添加 updated_at
    update_fields.append("updated_at = ?")
    update_values.append(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    # 执行更新
    update_values.append(article_id)
    sql = f"UPDATE articles SET {', '.join(update_fields)} WHERE article_id = ?"
    
    try:
        cur.execute(sql, update_values)
        conn.commit()
        
        # 获取更新后的数据
        cur.execute("SELECT * FROM articles WHERE article_id = ?", (article_id,))
        updated_article = cur.fetchone()
        conn.close()
        
        return to_camel_case(updated_article)
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"更新失败: {str(e)}")

@router.delete("/articles/{article_id}", status_code=status.HTTP_200_OK)
def delete_article(article_id: int):
    """删除指定 article_id 的文章"""
    if not DB_DEV_PATH.exists():
        raise HTTPException(status_code=500, detail="数据库文件不存在")

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    # 检查文章是否存在
    cur.execute("SELECT article_id FROM articles WHERE article_id = ?", (article_id,))
    if not cur.fetchone():
        conn.close()
        raise HTTPException(status_code=404, detail=f"文章 {article_id} 不存在")

    try:
        cur.execute("DELETE FROM articles WHERE article_id = ?", (article_id,))
        conn.commit()
        conn.close()
        return {"message": f"文章 {article_id} 已删除"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=f"删除失败: {str(e)}")
