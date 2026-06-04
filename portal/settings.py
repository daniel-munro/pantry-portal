"""Path and database settings for the portal application."""

import os
from pathlib import Path

DATA_DIR = Path(os.getenv("DATA_DIR", "/data")).resolve()
DB_PATH = DATA_DIR / "data.db"
DATABASE_URI = f"sqlite:///{DB_PATH}"
