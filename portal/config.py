"""Configuration settings (e.g., database URIs, debug mode, etc.)"""

import os

# Get the absolute path to the portal directory
PORTAL_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_URI = os.getenv(
    'DATABASE_URL',
    'sqlite:///' + os.path.join(PORTAL_DIR, 'data.db')  # fallback for local development
)

with open(os.path.join(PORTAL_DIR, 'static/data/info/tissues.pheast.txt'), 'r') as f:
    TISSUES = [line.strip() for line in f.readlines()]

with open(os.path.join(PORTAL_DIR, 'static/data/info/traits.txt'), 'r') as f:
    TRAITS = [line.strip() for line in f.readlines()]
