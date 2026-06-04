"""Load portal metadata catalogs from DATA_DIR."""

import json

import pandas as pd

from portal.settings import DATA_DIR


def load_tissues() -> list[str]:
    """Load tissue IDs used by download menus and metadata endpoints."""
    with open(DATA_DIR / "info/tissues.txt", "r") as f:
        return [line.strip() for line in f.readlines()]


def load_traits() -> list[dict]:
    """Load GWAS trait metadata and precomputed summary statistics."""
    traits = pd.read_csv(
        DATA_DIR / "info/gwas_metadata.txt",
        sep="\t",
        usecols=["Tag", "Phenotype", "Category", "Sample_Size", "color"],
    ).rename(
        columns={
            "Tag": "id",
            "Phenotype": "name",
            "Category": "category",
            "Sample_Size": "n",
        }
    )

    with open(DATA_DIR / "trait_stats.json", "r") as f:
        trait_stats = json.load(f)

    traits["hits"] = traits["name"].map(
        lambda trait: trait_stats.get(trait, {}).get("hits", 0)
    )
    traits["genes"] = traits["name"].map(
        lambda trait: trait_stats.get(trait, {}).get("genes", 0)
    )
    return traits.to_dict("records")


def load_genes() -> list[dict]:
    """Load gene metadata and precomputed xTWAS/xQTL summary statistics."""
    genes = pd.read_csv(
        DATA_DIR / "processed/pcg_and_lncrna.tsv",
        sep="\t",
    ).rename(
        columns={
            "gene_id": "id",
            "gene_name": "name",
            "gene_biotype": "biotype",
        }
    )
    genes["biotype"] = genes["biotype"].replace({"protein_coding": "protein-coding"})

    allowed_chromosomes = {f"chr{i}" for i in range(1, 23)}
    genes = genes[genes["chrom"].isin(allowed_chromosomes)].copy()

    # Ensure missing values become None so they JSONify to null.
    genes = genes.where(pd.notna(genes), None)

    with open(DATA_DIR / "gene_stats.json", "r") as f:
        gene_stats = json.load(f)

    genes["hits"] = genes["id"].map(
        lambda gene_id: gene_stats.get(gene_id, {}).get("hits", 0)
    )
    genes["traits"] = genes["id"].map(
        lambda gene_id: gene_stats.get(gene_id, {}).get("traits", 0)
    )
    genes["qtls"] = genes["id"].map(
        lambda gene_id: gene_stats.get(gene_id, {}).get("qtls", 0)
    )
    return genes.to_dict("records")


TISSUES = load_tissues()
TRAITS = load_traits()
GENES = load_genes()
