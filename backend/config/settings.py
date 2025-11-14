from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DB_DEV_PATH = BASE_DIR / "database" / "app_dev.db"
DB_PROD_PATH = BASE_DIR / "database" / "app.db"

# DATABASE_URL = f"sqlite:///{DB_PROD_PATH}"
DATABASE_URL = f"sqlite:///{DB_DEV_PATH}"