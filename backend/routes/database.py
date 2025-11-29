# database.py
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from config.settings import DB_DEV_PATH
from pathlib import Path


# 异步 SQLite 引擎（完美支持你现有的 app_dev.db）
engine = create_async_engine(
    f"sqlite+aiosqlite:///{DB_DEV_PATH}",
    echo=False,
    future=True,
    connect_args={"check_same_thread": False}  # SQLite 必须加这行
)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session