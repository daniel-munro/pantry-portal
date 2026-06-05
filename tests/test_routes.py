import importlib
import json
import re
import sqlite3
import sys


def _write_test_data(data_dir):
    """Create the minimum DATA_DIR contents needed to import the Flask app."""
    info_dir = data_dir / "info"
    processed_dir = data_dir / "processed"
    info_dir.mkdir()
    processed_dir.mkdir()

    (info_dir / "tissues.txt").write_text("T1\nT2\n")
    (info_dir / "gwas_metadata.txt").write_text(
        "\t".join(["Tag", "Phenotype", "Category", "Sample_Size", "color"]) + "\n"
        "trait_a\tTrait A\tBlood\t100\t#000000\n"
        "trait_b\tTrait B\tImmune\t200\t#111111\n"
    )
    (data_dir / "trait_stats.json").write_text(
        json.dumps({
            "Trait A": {"hits": 3, "genes": 3},
            "Trait B": {"hits": 1, "genes": 1},
        })
    )
    (data_dir / "gene_stats.json").write_text(
        json.dumps({"GENE1": {"hits": 1, "traits": 1, "qtls": 0}})
    )
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
        "GENE2\t\tlncRNA\tchr2\t3\t4\t-\n"
    )

    conn = sqlite3.connect(data_dir / "data.db")
    conn.execute(
        """
        CREATE TABLE twas_hybrid (
            id INTEGER,
            trait TEXT,
            tissue_name TEXT,
            tissue TEXT,
            gene_name TEXT,
            gene_id TEXT,
            gene_chrom TEXT,
            gene_tss INTEGER,
            modality TEXT,
            phenotype_id TEXT,
            twas_p REAL
        )
        """
    )
    conn.executemany(
        "INSERT INTO twas_hybrid VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            (
                1, "Trait A", "Tissue One", "T1", "Gene One", "GENE1",
                "chr1", 10, "Expression", "GENE1__x", 0.03,
            ),
            (
                2, "Trait A", "Tissue Two", "T2", "Gene Two", "GENE2",
                "chr2", 20, "RNA stability", "GENE2__x", 0.01,
            ),
            (
                3, "Trait A", "Tissue One", "T1", "Gene Three", "GENE3",
                "chr3", 30, "Expression", "GENE3__x", 0.02,
            ),
            (
                4, "Trait B", "Tissue One", "T1", "Gene Four", "GENE4",
                "chr4", 40, "Expression", "GENE4__x", 0.04,
            ),
        ],
    )
    conn.execute("CREATE TABLE twas_ddp (id INTEGER)")
    conn.execute("CREATE TABLE qtls_hybrid (id INTEGER, gene_id TEXT)")
    conn.execute("CREATE TABLE qtls_ddp (id INTEGER)")
    conn.commit()
    conn.close()


def _clear_portal_modules():
    """Force portal modules to reload after each test sets DATA_DIR."""
    for module_name in list(sys.modules):
        if module_name == "portal" or module_name.startswith("portal."):
            del sys.modules[module_name]


def test_trait_hits_endpoint_paginates_and_sorts(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get(
        "/api/trait-hits/trait_a?limit=2&offset=0&sort_by=twas_p&order=asc"
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["totalCount"] == 3
    assert [row["gene_id"] for row in data["rows"]] == ["GENE2", "GENE3"]


def test_trait_hits_endpoint_filters_with_total_count(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    filter_model = json.dumps({
        "modality": {
            "filterType": "select",
            "values": ["Expression"],
        }
    })
    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get(
        "/api/trait-hits/trait_a",
        query_string={"limit": 10, "offset": 0, "filterModel": filter_model},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["totalCount"] == 2
    assert {row["gene_id"] for row in data["rows"]} == {"GENE1", "GENE3"}


def test_trait_hits_endpoint_returns_empty_page_for_unknown_trait(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get("/api/trait-hits/not_a_trait")

    assert response.status_code == 200
    assert response.get_json() == {"rows": [], "totalCount": 0}


def test_metadata_endpoint_returns_frontend_option_lists(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get("/api/metadata")

    assert response.status_code == 200
    data = response.get_json()
    assert data["tissues"] == ["T1", "T2"]
    assert data["tissueNames"] == ["Tissue One", "Tissue Two"]
    assert data["chromosomes"][:2] == ["chr1", "chr2"]
    assert "Blood" in data["traitCategories"]
    assert {"id": "expression", "label": "Expression"} in data["downloadModalities"]
    assert "Expression" in data["browseModalities"]


def test_genes_endpoint_serializes_missing_gene_names_as_null(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get("/api/genes")

    assert response.status_code == 200
    genes = response.get_json()
    gene_by_id = {gene["id"]: gene for gene in genes}
    assert gene_by_id["GENE2"]["name"] is None


def test_view_routes_render_shared_nav_with_active_state(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    client = app_module.app.test_client()
    pages = [
        ("/", "Pantry Portal", "/"),
        ("/browse", "Browse - Pantry Portal", "/browse"),
        ("/traits", "Traits - Pantry Portal", "/traits"),
        ("/genes", "Genes - Pantry Portal", "/genes"),
        ("/download", "Download - Pantry Portal", "/download"),
    ]

    for path, title, active_href in pages:
        response = client.get(path)
        html = response.get_data(as_text=True)

        assert response.status_code == 200
        assert f"<title>{title}</title>" in html
        assert html.count("navbar navbar-expand-lg navbar-dark bg-dark") == 1
        assert re.findall(
            r'class="nav-link active"\s+href="([^"]+)"\s+aria-current="page"',
            html,
        ) == [active_href]


def test_browse_route_renders_lazy_grid_tabs(tmp_path, monkeypatch):
    _write_test_data(tmp_path)
    monkeypatch.setenv("DATA_DIR", str(tmp_path))
    _clear_portal_modules()

    app_module = importlib.import_module("portal.app")
    response = app_module.app.test_client().get("/browse")
    html = response.get_data(as_text=True)

    assert response.status_code == 200
    assert 'id="browse-tabs"' in html
    assert html.count('data-bs-toggle="tab"') == 4
    for label in [
        "xTWAS hybrid",
        "xTWAS data-driven",
        "cis-xQTL hybrid",
        "cis-xQTL data-driven",
    ]:
        assert label in html
