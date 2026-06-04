// Global variables for grid instances
let traitsGridApi;
let hitsGridApi;
let portalMetadata;

function buildAgGridQuery(params) {
  let sortParams = "";
  if (params.sortModel && params.sortModel.length > 0) {
    sortParams = `&sort_by=${params.sortModel[0].colId}&order=${params.sortModel[0].sort}`;
  }

  let filterParams = "";
  if (Object.keys(params.filterModel).length > 0) {
    filterParams = `&filterModel=${encodeURIComponent(
      JSON.stringify(params.filterModel)
    )}`;
  }

  return `limit=${params.endRow - params.startRow}&offset=${
    params.startRow
  }${sortParams}${filterParams}`;
}

// Traits table

Promise.all([
  fetch("/api/metadata").then((response) => response.json()),
  fetch("/api/traits").then((response) => response.json()),
]).then(([metadata, traits]) => {
    portalMetadata = metadata;

    const rowData = traits.map((trait) => ({
      id: trait.id,
      trait: trait.name,
      category: trait.category,
      color: trait.color,
      n: trait.n,
      hits: trait.hits,
      genes: trait.genes,
    }));

    const gridOptions = {
      columnDefs: [
        {
          headerName: "Trait",
          field: "trait",
          sortable: true,
          filter: true,
          filterParams: { filterOptions: ["contains", "equals"] },
          flex: 1,
        },
        {
          headerName: "Category",
          field: "category",
          sortable: true,
          filter: SelectFilter,
          filterParams: {
            values: metadata.traitCategories,
          },
          width: 240,
          cellRenderer: (params) => {
            const circle = `<span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: ${params.data.color};
              margin-right: 8px;
              vertical-align: middle;
            "></span>`;
            return circle + params.value;
          },
        },
        {
          headerName: "GWAS N",
          field: "n",
          sortable: true,
          filter: true,
          type: "numericColumn",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan"],
          },
          width: 125,
        },
        {
          headerName: "Hits",
          field: "hits",
          sortable: true,
          filter: true,
          type: "numericColumn",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan"],
          },
          width: 125,
        },
        {
          headerName: "Genes",
          field: "genes",
          sortable: true,
          filter: true,
          type: "numericColumn",
          filterParams: {
            filterOptions: ["equals", "lessThan", "greaterThan"],
          },
          width: 125,
        },
      ],
      rowData: rowData,
      rowStyle: { cursor: "pointer" },
      onRowClicked: (event) => {
        loadTraitHits(event.data.id, event.data.trait);
      },
    };

    var eGridDiv = document.querySelector("#traits-table");
    traitsGridApi = agGrid.createGrid(eGridDiv, gridOptions);
  });

// Function to load hits for a selected trait
function loadTraitHits(traitId, traitName) {
  // Show the hits section
  document.getElementById("hits-section").style.display = "block";
  document.getElementById("hits-table").style.display = "block";
  document.getElementById(
    "selected-trait-title"
  ).textContent = `TWAS Hits for ${traitName}`;

  // Scroll to the hits section
  document
    .getElementById("hits-section")
    .scrollIntoView({ behavior: "smooth", block: "start" });

  // If grid already exists, destroy it first
  if (hitsGridApi) {
    hitsGridApi.destroy();
  }

  const gridOptions = {
    columnDefs: [
      {
        headerName: "Tissue",
        field: "tissue_name",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["contains", "equals"] },
        flex: 2,
      },
      {
        headerName: "Tissue ID",
        field: "tissue",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["contains", "equals"] },
        flex: 1,
      },
      {
        headerName: "Gene",
        field: "gene_name",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["equals", "contains"] },
        flex: 1,
      },
      {
        headerName: "Gene ID",
        field: "gene_id",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["contains", "equals"] },
        flex: 1,
      },
      {
        headerName: "Chrom",
        field: "gene_chrom",
        sortable: false,
        filter: SelectFilter,
        filterParams: {
          values: portalMetadata.chromosomes,
        },
        flex: 1,
      },
      {
        headerName: "TSS",
        field: "gene_tss",
        type: "numericColumn",
        cellDataType: "number",
        valueFormatter: (params) => {
          if (params.value == null) return "";
          return params.value.toLocaleString();
        },
        sortable: true,
        filter: true,
        filterParams: {
          filterOptions: ["equals", "lessThan", "greaterThan"],
        },
        flex: 1,
      },
      {
        headerName: "Modality",
        field: "modality",
        sortable: true,
        filter: SelectFilter,
        filterParams: {
          values: portalMetadata.browseModalities,
        },
        flex: 1,
      },
      {
        headerName: "Phenotype ID",
        field: "phenotype_id",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["equals", "contains"] },
        flex: 2,
      },
      {
        headerName: "P-value",
        field: "twas_p",
        type: "numericColumn",
        cellDataType: "number",
        valueFormatter: (params) => {
          if (params.value == null) return "";
          return params.value.toExponential(2);
        },
        sortable: true,
        filter: true,
        filterParams: {
          filterOptions: ["lessThan", "greaterThan"],
          maxFiltersCount: 1,
        },
        flex: 1,
      },
    ],
    rowModelType: "infinite",
    cacheBlockSize: 100,
    maxBlocksInCache: 3,
    datasource: {
      getRows: function (params) {
        fetch(`/api/trait-hits/${traitId}?${buildAgGridQuery(params)}`)
          .then((response) => response.json())
          .then((data) => {
            params.successCallback(data.rows, data.totalCount);
          })
          .catch((error) => {
            console.error("Error loading trait hits:", error);
            params.failCallback();
            alert("Failed to load trait hits. Please try again.");
          });
      },
    },
  };

  var eGridDiv = document.querySelector("#hits-table");
  hitsGridApi = agGrid.createGrid(eGridDiv, gridOptions);
}
