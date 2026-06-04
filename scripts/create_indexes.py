#!/usr/bin/env python3
"""Create SQLite indexes used by interactive portal queries."""

from pathlib import Path

from sqlalchemy import create_engine, text

from sqlite_schema import INDEX_STATEMENTS

PROJECT_DIR = Path(__file__).parent.parent
DB_PATH = PROJECT_DIR / "data" / "data.db"


def main():
    """Create indexes in the existing portal SQLite database."""
    engine = create_engine(f"sqlite:///{DB_PATH}")
    with engine.begin() as conn:
        for statement in INDEX_STATEMENTS:
            conn.execute(text(statement))


if __name__ == "__main__":
    main()
