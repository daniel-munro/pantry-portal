function buildColumns(metadata) {
  return {
    trait: {
      headerName: "Trait",
      field: "trait",
      type: "textColumn",
      flex: 2,
    },
    tissue_name: PantryGrid.selectColumn(
      "Tissue",
      "tissue_name",
      metadata.tissueNames,
      2
    ),
    tissue: PantryGrid.selectColumn("Tissue ID", "tissue", metadata.tissues),
    gene_name: {
      headerName: "Gene",
      field: "gene_name",
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "contains"] },
      flex: 1,
    },
    gene_id: {
      headerName: "Gene ID",
      field: "gene_id",
      type: "textColumn",
      flex: 1,
    },
    gene_chrom: {
      headerName: "Chrom",
      field: "gene_chrom",
      sortable: false,
      filter: SelectFilter,
      filterParams: { values: metadata.chromosomes },
      flex: 1,
    },
    gene_tss: {
      headerName: "TSS",
      field: "gene_tss",
      type: "numericColumn",
      cellDataType: "number",
      valueFormatter: PantryGrid.numberFormatter,
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "lessThan", "greaterThan"] },
      flex: 1,
    },
    modality: PantryGrid.selectColumn(
      "Modality",
      "modality",
      metadata.browseModalities
    ),
    phenotype_id: {
      headerName: "Phenotype ID",
      field: "phenotype_id",
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "contains"] },
      flex: 2,
    },
    twas_p: {
      headerName: "TWAS p-value",
      field: "twas_p",
      type: "numericColumn",
      cellDataType: "number",
      valueFormatter: PantryGrid.pValueFormatter,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ["lessThan", "greaterThan"],
        maxFiltersCount: 1,
      },
      flex: 1,
    },
    ddp: {
      headerName: "DDP",
      field: "ddp",
      type: "numericColumn",
      cellDataType: "number",
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "lessThan", "greaterThan"] },
      flex: 1,
    },
    rank: {
      headerName: "Rank",
      field: "rank",
      type: "numericColumn",
      cellDataType: "number",
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "lessThan", "greaterThan"] },
      flex: 1,
    },
    variant_id: {
      headerName: "Variant ID",
      field: "variant_id",
      type: "textColumn",
      flex: 1,
    },
    chrom: {
      headerName: "Chrom",
      field: "chrom",
      sortable: false,
      filter: SelectFilter,
      filterParams: { values: metadata.chromosomes },
      flex: 1,
    },
    pos: {
      headerName: "Position",
      field: "pos",
      type: "numericColumn",
      cellDataType: "number",
      valueFormatter: PantryGrid.numberFormatter,
      sortable: true,
      filter: true,
      filterParams: { filterOptions: ["equals", "lessThan", "greaterThan"] },
      flex: 1,
    },
    pval_beta: {
      headerName: "P-value (beta)",
      field: "pval_beta",
      type: "numericColumn",
      cellDataType: "number",
      valueFormatter: PantryGrid.pValueFormatter,
      sortable: true,
      filter: true,
      filterParams: {
        filterOptions: ["lessThan", "greaterThan"],
        maxFiltersCount: 1,
      },
      flex: 1,
    },
  };
}

function createInfiniteGrid(gridId, endpoint, columnDefs) {
  PantryGrid.createInfiniteGrid(gridId, endpoint, columnDefs, {
    showRowCount: true,
  });
}

function initializeBrowseTables(metadata) {
  const columns = buildColumns(metadata);

  createInfiniteGrid("twas-hybrid-grid", "/api/twas-hybrid", [
    columns.trait,
    columns.tissue_name,
    columns.tissue,
    columns.gene_name,
    columns.gene_id,
    columns.gene_chrom,
    columns.gene_tss,
    columns.modality,
    columns.phenotype_id,
    columns.twas_p,
  ]);

  createInfiniteGrid("twas-ddp-grid", "/api/twas-ddp", [
    columns.trait,
    columns.tissue_name,
    columns.tissue,
    columns.gene_name,
    columns.gene_id,
    columns.gene_chrom,
    columns.gene_tss,
    columns.ddp,
    columns.twas_p,
  ]);

  createInfiniteGrid("qtls-hybrid-grid", "/api/qtls-hybrid", [
    columns.tissue_name,
    columns.tissue,
    columns.gene_name,
    columns.gene_id,
    columns.rank,
    columns.modality,
    columns.phenotype_id,
    columns.variant_id,
    columns.chrom,
    columns.pos,
    columns.pval_beta,
  ]);

  createInfiniteGrid("qtls-ddp-grid", "/api/qtls-ddp", [
    columns.tissue_name,
    columns.tissue,
    columns.gene_name,
    columns.gene_id,
    columns.rank,
    columns.ddp,
    columns.variant_id,
    columns.chrom,
    columns.pos,
    columns.pval_beta,
  ]);
}

fetch("/api/metadata")
  .then((response) => response.json())
  .then(initializeBrowseTables)
  .catch((error) => {
    console.error("Error loading portal metadata:", error);
  });
