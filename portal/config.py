"""Configuration settings (e.g., database URIs, debug mode, etc.)"""

import os

# Get data directory from environment or use default
DATA_DIR = os.getenv('DATA_DIR', '/data')
if not os.path.isabs(DATA_DIR):
    DATA_DIR = os.path.abspath(DATA_DIR)

# Database path
DB_PATH = os.path.join(DATA_DIR, 'data.db')
DATABASE_URI = f'sqlite:///{DB_PATH}'

with open(os.path.join(DATA_DIR, 'info/tissues.pheast.txt'), 'r') as f:
    TISSUES = [line.strip() for line in f.readlines()]

with open(os.path.join(DATA_DIR, 'info/traits.txt'), 'r') as f:
    TRAITS = [line.strip() for line in f.readlines()]
