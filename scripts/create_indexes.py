#!/usr/bin/env python3
"""Create SQLite indexes used by interactive portal queries."""

from pathlib import Path

from sqlalchemy import create_engine, text

PROJECT_DIR = Path(__file__).parent.parent
DB_PATH = PROJECT_DIR / "data" / "data.db"

INDEX_STATEMENTS = [
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_trait ON twas_hybrid(trait)",
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_trait_p ON twas_hybrid(trait, twas_p)",
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_gene_id ON twas_hybrid(gene_id)",
    "CREATE INDEX IF NOT EXISTS idx_qtls_hybrid_gene_id ON qtls_hybrid(gene_id)",
]


def main():
    """Create indexes in the existing portal SQLite database."""
    engine = create_engine(f"sqlite:///{DB_PATH}")
    with engine.begin() as conn:
        for statement in INDEX_STATEMENTS:
            conn.execute(text(statement))


if __name__ == "__main__":
    main()
