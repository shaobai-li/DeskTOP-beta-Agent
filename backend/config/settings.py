from pathlib import Path

BASE_DIR = Path(__file__).parent.parent
DB_DEV_PATH = BASE_DIR / "database" / "app_dev.db"
DB_PROD_PATH = BASE_DIR / "database" / "app.db"
JSON_DEV_AGENTS_PATH = BASE_DIR / "database" / "app_dev_agents.json"
JSON_DEV_TAGS_PATH = BASE_DIR / "database" / "app_dev_tags.json"

# 向量数据库索引文件存储目录
VECTOR_INDEX_PATH = BASE_DIR / "database" / "app_vectors_dev.index"


# DATABASE_URL = f"sqlite:///{DB_PROD_PATH}"
DATABASE_URL = f"sqlite:///{DB_DEV_PATH}"