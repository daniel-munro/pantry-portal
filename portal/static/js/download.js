function populateTissueSelects(tissues) {
  [
    "rnaphenos-tissue-select",
    "covariates-tissue-select",
    "qtls-tissue-select",
    "twasmodels-tissue-select",
  ].forEach((selectId) => {
    const tissueSelect = document.getElementById(selectId);
    tissueSelect.innerHTML = tissues
      .map((tissue) => `<option value="${tissue}">${tissue}</option>`)
      .join("");

    tissueSelect.dispatchEvent(new Event("change"));
  });
}

function addDownloadRow(tableBody, folder, fileName, label, extraCells = "") {
  tableBody.innerHTML += `
    <tr>
      <td><a href="/data/${folder}/${fileName}" download>${fileName}</a></td>
      <td>${label}</td>
      ${extraCells}
    </tr>
  `;
}

function initializeDownloadTables(metadata) {
  const modalities = metadata.downloadModalities;
  const qtlModalities = metadata.downloadQtlModalities;

  document
    .getElementById("rnaphenos-tissue-select")
    .addEventListener("change", function () {
      const tissue = this.value;
      const tableBody = document.getElementById("rnaphenos-table-body");
      tableBody.innerHTML = "";

      modalities.forEach((mod) => {
        const fileName = `${tissue}.${mod.id}.bed.gz`;
        addDownloadRow(tableBody, "rna_phenotypes", fileName, mod.label);
      });
    });

  document
    .getElementById("covariates-tissue-select")
    .addEventListener("change", function () {
      const tissue = this.value;
      const tableBody = document.getElementById("covariates-table-body");
      tableBody.innerHTML = "";

      qtlModalities.forEach((mod) => {
        const fileName = `${tissue}.${mod.id}.covar.tsv`;
        addDownloadRow(tableBody, "covariates", fileName, mod.label, "<td>tensorQTL</td>");
      });
      modalities.forEach((mod) => {
        const fileName = `${tissue}.${mod.id}.covar.plink.tsv`;
        addDownloadRow(tableBody, "covariates", fileName, mod.label, "<td>PLINK</td>");
      });
    });

  document
    .getElementById("qtls-tissue-select")
    .addEventListener("change", function () {
      const tissue = this.value;
      const tableBody = document.getElementById("qtls-table-body");
      tableBody.innerHTML = "";

      qtlModalities.forEach((mod) => {
        const qtlFile = `${tissue}.${mod.id}.cis_qtl.txt.gz`;
        addDownloadRow(tableBody, "qtls", qtlFile, mod.label);

        const independentFile = `${tissue}.${mod.id}.cis_independent_qtl.txt.gz`;
        addDownloadRow(tableBody, "qtls", independentFile, mod.label);
      });
    });

  document
    .getElementById("twasmodels-tissue-select")
    .addEventListener("change", function () {
      const tissue = this.value;
      const tableBody = document.getElementById("twasmodels-table-body");
      tableBody.innerHTML = "";

      modalities.forEach((mod) => {
        const weightsFile = `${tissue}.${mod.id}.twas_weights.tar.bz2`;
        addDownloadRow(tableBody, "twas_weights", weightsFile, mod.label);

        const profileFile = `${tissue}.${mod.id}.twas_weights.profile`;
        addDownloadRow(tableBody, "twas_weights", profileFile, mod.label);
      });
    });

  populateTissueSelects(metadata.tissues);
}

function initializeTwasAssociationsTable(metadata, traits) {
  const rowData = traits.map((trait) => ({
    file: `${trait.id}.tar.bz2`,
    trait: trait.name,
    category: trait.category,
    color: trait.color,
    n: trait.n,
  }));

  const gridOptions = {
    columnDefs: [
      {
        headerName: "File",
        field: "file",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ["contains", "equals"] },
        flex: 1,
        cellRenderer: (params) => {
          return `<a href="/data/twas_associations/${params.value}" download>${params.value}</a>`;
        },
      },
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
    ],
    rowData: rowData,
  };

  const gridApi = agGrid.createGrid(
    document.querySelector("#twasassoc-table"),
    gridOptions
  );
  gridApi.sizeColumnsToFit();
}

Promise.all([
  fetch("/api/metadata").then((response) => response.json()),
  fetch("/api/traits").then((response) => response.json()),
])
  .then(([metadata, traits]) => {
    initializeDownloadTables(metadata);
    initializeTwasAssociationsTable(metadata, traits);
  })
  .catch((error) => {
    console.error("Error loading portal metadata:", error);
  });
