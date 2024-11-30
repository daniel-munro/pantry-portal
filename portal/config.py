"""Configuration settings (e.g., database URIs, debug mode, etc.)"""

import os
import pandas as pd

# Get data directory from environment or use default
DATA_DIR = os.getenv('DATA_DIR', '/data')
if not os.path.isabs(DATA_DIR):
    DATA_DIR = os.path.abspath(DATA_DIR)

# Database path
DB_PATH = os.path.join(DATA_DIR, 'data.db')
DATABASE_URI = f'sqlite:///{DB_PATH}'

with open(os.path.join(DATA_DIR, 'info/tissues.pheast.txt'), 'r') as f:
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
}).to_dict('records')
