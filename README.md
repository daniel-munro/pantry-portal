# Pantry Portal

Web portal for Pantry's transcriptomic and genetic data.

Live site: [https://pantry.pejlab.org](https://pantry.pejlab.org)

## Overview

This repo powers a Flask-based web portal for browsing and downloading Pantry
multimodal RNA phenotyping and genetic analysis results. It serves static pages
for browsing xTWAS and cis-xQTL results and provides JSON APIs used by the
frontend tables.

## Architecture

- Flask app: `portal/app.py` initializes the app and SQLAlchemy engine.
- Views: `portal/routes/views.py` renders the HTML pages (home, browse, traits,
  genes, download).
- API: `portal/routes/api_routes.py` exposes JSON endpoints for tissues, traits,
  genes, and paginated table data.
- Data access: `portal/services/query_service.py` executes SQL queries, applies
  AG Grid-style filters, and returns paginated results.
- Frontend: Jinja templates in `portal/templates` plus JS/CSS in
  `portal/static`.

## Data layout and configuration

The app reads data from `DATA_DIR` (default `/data`). It expects a SQLite
database and a handful of precomputed metadata files:

- Database: `data.db` with tables like `twas_hybrid`, `twas_ddp`,
  `qtls_hybrid`, and `qtls_ddp`.
- Metadata files (relative to `DATA_DIR`):
  - `info/tissues.txt`
  - `info/gwas_metadata.txt`
  - `trait_stats.json`
  - `gene_stats.json`
  - `processed/pcg_and_lncrna.tsv`

In this repo, `data/` contains the SQLite database plus symlinks to an external
data repository (`info/`, `processed/`, `covariates/`, etc.).

## Repository structure

- `portal/app.py`: Flask app entrypoint.
- `portal/config.py`: loads metadata, stats, and gene/trait lists into memory.
- `portal/routes/`: view routes and JSON API routes.
- `portal/services/`: query utilities for SQL filtering/pagination.
- `portal/templates/`: HTML pages (home, browse, traits, genes, download).
- `portal/static/`: JS for AG Grid tables, CSS, and images.
- `scripts/`: data preparation, DB loading, and stats precomputation.
- `data/`: SQLite DB and symlinks to shared datasets.
- `tests/`: placeholder test files.

## Scripts

- `scripts/prepare_data.sh`: syncs source data into `data/` and builds
  aggregated files.
- `scripts/load_data.py`: loads TSV inputs into `data/data.db`.
- `scripts/compute_stats.py`: precomputes `trait_stats.json` and
  `gene_stats.json` from the DB.
- `scripts/inspect_tables.sh`: prints sample rows from each SQLite table.

## Running locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export DATA_DIR=./data
python portal/app.py
```

Production uses Gunicorn (see `Procfile`):

```bash
gunicorn "portal.app:app" --workers 2 --timeout 120 --bind 0.0.0.0:8080
```

## Tests

`tests/` currently contains empty placeholders (`test_routes.py`,
`test_services.py`).
