import sqlite3
from config.settings import DB_DEV_PATH
from fastapi import APIRouter
from .utils import *

router = APIRouter()

@router.get("/articles")
def get_articles():
    """读取所有文章数据"""
    if not DB_DEV_PATH.exists():
        return {"error": "数据库文件不存在"}

    conn = sqlite3.connect(DB_DEV_PATH)
    conn.row_factory = dict_factory
    cur = conn.cursor()

    cur.execute("""
        SELECT *
        FROM articles
        ORDER BY article_id ASC
    """)

    data = cur.fetchall()
    conn.close()

    return to_camel_case(data)
