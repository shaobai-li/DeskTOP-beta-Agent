from pathlib import Path
import os
from dotenv import load_dotenv

load_dotenv()
BASE_DIR = Path(os.getenv("BASE_DIR"))
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

# 数据库
DB_DEV_PATH = DATA_DIR / "app_dev.db"
DB_PROD_PATH = DATA_DIR / "app.db"
JSON_DEV_AGENTS_PATH = DATA_DIR / "app_dev_agents.json"
JSON_DEV_TAGS_PATH = DATA_DIR / "app_dev_tags.json"
VECTOR_INDEX_PATH = DATA_DIR / "app_vectors_dev.index"

# 模型库
MODEL_PATH = MODELS_DIR /  "bge-v1.5-final"