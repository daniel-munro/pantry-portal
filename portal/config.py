"""Configuration settings (e.g., database URIs, debug mode, etc.)"""

DATABASE_URI = 'sqlite:///data.db'

with open('static/data/info/tissues.pheast.txt', 'r') as f:
    TISSUES = [line.strip() for line in f.readlines()]

with open('static/data/info/traits.txt', 'r') as f:
    TRAITS = [line.strip() for line in f.readlines()]
