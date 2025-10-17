#!/usr/bin/env python3
"""
Compute statistics for traits and save to JSON file.
This script precomputes various statistics (hits, genes, etc.) for each trait
to avoid computing them on-the-fly in the web application.
"""

import sqlite3
import json
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DB_PATH = PROJECT_DIR / "data" / "data.db"
TRAIT_STATS_PATH = PROJECT_DIR / "data" / "trait_stats.json"
GENE_STATS_PATH = PROJECT_DIR / "data" / "gene_stats.json"


def compute_trait_stats():
    """
    Compute statistics for each trait from the twas_hybrid table.
    Returns a dictionary with trait codes as keys and stats as values.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Query to compute hits and unique genes per trait
    query = """
    SELECT 
        trait,
        COUNT(*) as hits,
        COUNT(DISTINCT gene_id) as genes
    FROM twas_hybrid
    GROUP BY trait
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    # Convert to dictionary
    stats = {}
    for trait_code, hits, genes in results:
        stats[trait_code] = {
            "hits": hits,
            "genes": genes
        }
    
    return stats


def compute_gene_stats():
    """
    Compute statistics for each gene from the twas_hybrid table.
    Returns a dictionary with gene_ids as keys and stats as values.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Query to compute hits and unique traits per gene
    query = """
    SELECT 
        gene_id,
        COUNT(*) as hits,
        COUNT(DISTINCT trait) as traits
    FROM twas_hybrid
    GROUP BY gene_id
    """
    
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    
    # Convert to dictionary
    stats = {}
    for gene_id, hits, traits in results:
        stats[gene_id] = {
            "hits": hits,
            "traits": traits
        }
    
    return stats


def main():
    """Main function to compute and save trait and gene statistics."""
    print("Computing trait statistics...")
    trait_stats = compute_trait_stats()
    print(f"Computed stats for {len(trait_stats)} traits")
    
    print("\nComputing gene statistics...")
    gene_stats = compute_gene_stats()
    print(f"Computed stats for {len(gene_stats)} genes")
    
    # Ensure output directory exists
    TRAIT_STATS_PATH.parent.mkdir(parents=True, exist_ok=True)
    
    # Save trait stats to JSON
    with open(TRAIT_STATS_PATH, 'w') as f:
        json.dump(trait_stats, f, indent=2)
    print(f"\nTrait stats saved to {TRAIT_STATS_PATH}")
    
    # Save gene stats to JSON
    with open(GENE_STATS_PATH, 'w') as f:
        json.dump(gene_stats, f, indent=2)
    print(f"Gene stats saved to {GENE_STATS_PATH}")
    
    # Print a few examples
    print("\nExample trait stats:")
    for i, (trait, data) in enumerate(list(trait_stats.items())[:5]):
        print(f"  {trait}: {data['hits']} hits, {data['genes']} genes")
        if i >= 4:
            break
    
    print("\nExample gene stats:")
    for i, (gene_id, data) in enumerate(list(gene_stats.items())[:5]):
        print(f"  {gene_id}: {data['hits']} hits, {data['traits']} traits")
        if i >= 4:
            break


if __name__ == "__main__":
    main()
