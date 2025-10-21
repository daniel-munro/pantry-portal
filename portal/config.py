"""Configuration settings (e.g., database URIs, debug mode, etc.)"""

import os
import pandas as pd
import json

# Get data directory from environment or use default
DATA_DIR = os.getenv('DATA_DIR', '/data')
if not os.path.isabs(DATA_DIR):
    DATA_DIR = os.path.abspath(DATA_DIR)

# Database path
DB_PATH = os.path.join(DATA_DIR, 'data.db')
DATABASE_URI = f'sqlite:///{DB_PATH}'

with open(os.path.join(DATA_DIR, 'info/tissues.txt'), 'r') as f:
    TISSUES = [line.strip() for line in f.readlines()]

TRAITS = pd.read_csv(
    os.path.join(DATA_DIR, 'info/gwas_metadata.txt'),
    sep='\t',
    usecols=['Tag', 'Phenotype', 'Category', 'Sample_Size', 'color']
).rename(columns={
    'Tag': 'id',
    'Phenotype': 'name',
    'Category': 'category',
    'Sample_Size': 'n'
})

# Load precomputed trait statistics
with open(os.path.join(DATA_DIR, 'trait_stats.json'), 'r') as f:
    trait_stats = json.load(f)
TRAITS['hits'] = TRAITS['name'].map(lambda x: trait_stats.get(x, {}).get('hits', 0))
TRAITS['genes'] = TRAITS['name'].map(lambda x: trait_stats.get(x, {}).get('genes', 0))

TRAITS = TRAITS.to_dict('records')

# Load genes from pcg_and_lncrna.tsv
GENES = pd.read_csv(
    os.path.join(DATA_DIR, 'processed/pcg_and_lncrna.tsv'),
    sep='\t',
).rename(columns={
    'gene_id': 'id',
    'gene_name': 'name',
    'gene_biotype': 'biotype'
})
GENES['biotype'] = GENES['biotype'].replace({'protein_coding': 'protein-coding'})
allowed = {f'chr{i}' for i in range(1, 23)}
GENES = GENES[GENES['chrom'].isin(allowed)].copy()

# Ensure missing values become None so they JSONify to null
GENES = GENES.where(pd.notna(GENES), None)

# Load precomputed gene statistics
with open(os.path.join(DATA_DIR, 'gene_stats.json'), 'r') as f:
    gene_stats = json.load(f)
GENES['hits'] = GENES['id'].map(lambda x: gene_stats.get(x, {}).get('hits', 0))
GENES['traits'] = GENES['id'].map(lambda x: gene_stats.get(x, {}).get('traits', 0))
GENES['qtls'] = GENES['id'].map(lambda x: gene_stats.get(x, {}).get('qtls', 0))

GENES = GENES.to_dict('records')
