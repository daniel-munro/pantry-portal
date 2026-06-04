import importlib
import json
import sqlite3
import sys

from flask import Flask, request
from sqlalchemy import create_engine


def _write_config_data(data_dir):
    """Create the minimal DATA_DIR files needed to import portal.config."""
    info_dir = data_dir / "info"
    processed_dir = data_dir / "processed"
    info_dir.mkdir()
    processed_dir.mkdir()

    (info_dir / "tissues.txt").write_text("T1\n")
    (info_dir / "gwas_metadata.txt").write_text(
        "\t".join(["Tag", "Phenotype", "Category", "Sample_Size", "color"]) + "\n"
        "trait_a\tTrait A\tBlood\t100\t#000000\n"
    )
    (data_dir / "trait_stats.json").write_text(
        json.dumps({"Trait A": {"hits": 0, "genes": 0}})
    )
    (data_dir / "gene_stats.json").write_text("{}")
    (processed_dir / "pcg_and_lncrna.tsv").write_text(
        "\t".join([
            "gene_id",
            "gene_name",
            "gene_biotype",
            "chrom",
            "start",
            "end",
            "strand",
        ]) + "\n"
        "GENE1\tGene One\tprotein_coding\tchr1\t1\t2\t+\n"
    )


def _write_query_table(db_path):
    """Create a small table for ag_grid_query tests."""
    conn = sqlite3.connect(db_path)
    conn.execute(
        """
        CREATE TABLE example_hits (
            id INTEGER,
            label TEXT,
            category TEXT,
            value REAL
        )
        """
    )
    conn.executemany(
        "INSERT INTO example_hits VALUES (?, ?, ?, ?)",
        [
            (1, "alpha", "A", 0.30),
            (2, "beta", "B", 0.10),
            (3, "alphabet", "A", 0.20),
            (4, "gamma", "C", 0.40),
        ],
    )
    conn.commit()
    conn.close()


def _clear_portal_modules():
    """Force query_service to import with this test's DATA_DIR."""
    for module_name in list(sys.modules):
        if module_name == "portal" or module_name.startswith("portal."):
            del sys.modules[module_name]


def _load_ag_grid_query(tmp_path, monkeypatch):
    _write_config_data(tmp_path)
    db_path = tmp_path / "data.db"
    _write_query_table(db_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    query_service = importlib.import_module("portal.services.query_service")
    engine = create_engine(f"sqlite:///{db_path}")
    return query_service.ag_grid_query, engine


def test_ag_grid_query_paginates_and_sorts(tmp_path, monkeypatch):
    ag_grid_query, engine = _load_ag_grid_query(tmp_path, monkeypatch)
    app = Flask(__name__)

    with app.test_request_context("/?limit=2&offset=1&sort_by=value&order=desc"):
        response = ag_grid_query(engine, "example_hits", request)

    assert response["totalCount"] == 4
    assert [row["label"] for row in response["rows"]] == ["alpha", "alphabet"]


def test_ag_grid_query_applies_contains_filter(tmp_path, monkeypatch):
    ag_grid_query, engine = _load_ag_grid_query(tmp_path, monkeypatch)
    app = Flask(__name__)
    filter_model = json.dumps({
        "label": {
            "filterType": "text",
            "type": "contains",
            "filter": "alpha",
        }
    })

    with app.test_request_context(
        "/",
        query_string={
            "limit": 10,
            "offset": 0,
            "sort_by": "id",
            "order": "asc",
            "filterModel": filter_model,
        },
    ):
        response = ag_grid_query(engine, "example_hits", request)

    assert response["totalCount"] == 2
    assert [row["label"] for row in response["rows"]] == ["alpha", "alphabet"]


def test_ag_grid_query_applies_compound_numeric_filter(tmp_path, monkeypatch):
    ag_grid_query, engine = _load_ag_grid_query(tmp_path, monkeypatch)
    app = Flask(__name__)
    filter_model = json.dumps({
        "value": {
            "filterType": "number",
            "operator": "AND",
            "conditions": [
                {"type": "greaterThan", "filter": 0.15},
                {"type": "lessThan", "filter": 0.35},
            ],
        }
    })

    with app.test_request_context(
        "/",
        query_string={
            "limit": 10,
            "offset": 0,
            "sort_by": "value",
            "order": "asc",
            "filterModel": filter_model,
        },
    ):
        response = ag_grid_query(engine, "example_hits", request)

    assert response["totalCount"] == 2
    assert [row["label"] for row in response["rows"]] == ["alphabet", "alpha"]
