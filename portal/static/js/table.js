// TWAS results table

const textColumn = {
    sortable: true,
    filter: true,
    filterParams: { filterOptions: ['contains', 'equals'] }
};

var twasGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue", type: 'textColumn', width: 120 },
        { headerName: "Trait", field: "trait", type: 'textColumn', flex: 1 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', width: 120 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', width: 80 },
        {
            headerName: "Chrom",
            field: "gene_chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            width: 100,
        },
        {
            headerName: "TSS",
            field: "gene_tss",
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            width: 80,
        },
        { headerName: "Modality", field: "modality", type: 'textColumn', width: 130 },
        { headerName: "Phenotype ID", field: "phenotype_id", type: 'textColumn', flex: 1 },
        { 
            headerName: "TWAS p-value",
            field: "twas_p",
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toExponential(2);
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['lessThan', 'greaterThan'], maxFiltersCount: 1 },
            width: 170,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#twas-hits-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getModel().getRowCount();
            countDiv.innerHTML = `Showing ${rowCount} rows`;
        });
    },
    datasource: {
        getRows: function (params) {
            // Get sort information
            let sortModel = params.sortModel;
            let sortParams = '';
            if (sortModel && sortModel.length > 0) {
                sortParams = `&sort_by=${sortModel[0].colId}&order=${sortModel[0].sort}`;
            }

            // Get filter information
            let filterModel = params.filterModel;
            let filterParams = '';
            if (Object.keys(filterModel).length > 0) {
                filterParams = `&filterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
            }

            fetch(`/api/twas?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var twasGridDiv = document.querySelector('#twas-hits-grid');
const twasGridApi = agGrid.createGrid(twasGridDiv, twasGridOptions);

// QTLs table

var qtlsGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue", type: 'textColumn', width: 120 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', width: 120 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', width: 80 },
        {
            headerName: "Rank",
            field: "rank",
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            width: 110,
        },
        { headerName: "Modality", field: "modality", type: 'textColumn', width: 130 },
        { headerName: "Phenotype ID", field: "phenotype_id", type: 'textColumn', flex: 1 },
        { headerName: "Variant ID", field: "variant_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Chrom",
            field: "chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            width: 115,
        },
        {
            headerName: "Position",
            field: "pos",
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            width: 130,
        },
        { 
            headerName: "P-value (beta)",
            field: "pval_beta",
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toExponential(2);
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['lessThan', 'greaterThan'], maxFiltersCount: 1 },
            width: 165,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#qtls-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getModel().getRowCount();
            countDiv.innerHTML = `Showing ${rowCount} rows`;
        });
    },
    datasource: {
        getRows: function (params) {
            // Get sort information
            let sortModel = params.sortModel;
            let sortParams = '';
            if (sortModel && sortModel.length > 0) {
                sortParams = `&sort_by=${sortModel[0].colId}&order=${sortModel[0].sort}`;
            }

            // Get filter information
            let filterModel = params.filterModel;
            let filterParams = '';
            if (Object.keys(filterModel).length > 0) {
                filterParams = `&filterModel=${encodeURIComponent(JSON.stringify(filterModel))}`;
            }

            fetch(`/api/qtls-combined?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var qtlsGridDiv = document.querySelector('#qtls-grid');
const qtlsGridApi = agGrid.createGrid(qtlsGridDiv, qtlsGridOptions);
