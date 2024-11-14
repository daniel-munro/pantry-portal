"""Initialize the database."""

import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_dir)
from portal.models.models import Base
from portal.config import DATABASE_URI

engine = create_engine(DATABASE_URI)

# Create all tables
def setup_database():
    Base.metadata.create_all(engine)

if __name__ == '__main__':
    setup_database()
