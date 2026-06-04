"""Shared SQLite schema details for portal database build scripts."""

INDEX_STATEMENTS = [
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_trait ON twas_hybrid(trait)",
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_trait_p ON twas_hybrid(trait, twas_p)",
    "CREATE INDEX IF NOT EXISTS idx_twas_hybrid_gene_id ON twas_hybrid(gene_id)",
    "CREATE INDEX IF NOT EXISTS idx_qtls_hybrid_gene_id ON qtls_hybrid(gene_id)",
]
