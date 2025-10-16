const textColumn = {
    sortable: true,
    filter: true,
    filterParams: { filterOptions: ['contains', 'equals'] }
};

// TWAS hybrid phenotypes table

var twasHybridGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue_name", type: 'textColumn', flex: 2 },
        { headerName: "Tissue ID", field: "tissue", type: 'textColumn', flex: 1 },
        { headerName: "Trait", field: "trait", type: 'textColumn', flex: 2 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', flex: 1 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Chrom", 
            field: "gene_chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            flex: 1,
        },
        {
            headerName: "TSS",
            field: "gene_tss", 
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toLocaleString();
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
        { headerName: "Modality", field: "modality", type: 'textColumn', flex: 1 },
        { headerName: "Phenotype ID", field: "phenotype_id", type: 'textColumn', flex: 2 },
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
            flex: 1,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#twas-hybrid-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getDisplayedRowCount();
            countDiv.innerHTML = `Showing ${rowCount.toLocaleString()} rows`;
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

            fetch(`/api/twas-hybrid?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var twasHybridGridDiv = document.querySelector('#twas-hybrid-grid');
const twasHybridGridApi = agGrid.createGrid(twasHybridGridDiv, twasHybridGridOptions);

// TWAS DDP table

var twasDdpGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue_name", type: 'textColumn', flex: 2 },
        { headerName: "Tissue ID", field: "tissue", type: 'textColumn', flex: 1 },
        { headerName: "Trait", field: "trait", type: 'textColumn', flex: 2 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', flex: 1 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Chrom", 
            field: "gene_chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            flex: 1,
        },
        {
            headerName: "TSS",
            field: "gene_tss", 
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toLocaleString();
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
        {
            headerName: "DDP",
            field: "ddp", 
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
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
            flex: 1,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#twas-ddp-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getDisplayedRowCount();
            countDiv.innerHTML = `Showing ${rowCount.toLocaleString()} rows`;
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

            fetch(`/api/twas-ddp?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var twasDdpGridDiv = document.querySelector('#twas-ddp-grid');
const twasDdpGridApi = agGrid.createGrid(twasDdpGridDiv, twasDdpGridOptions);

// QTLs hybrid phenotype table

var qtlsHybridGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue_name", type: 'textColumn', flex: 2 },
        { headerName: "Tissue ID", field: "tissue", type: 'textColumn', flex: 1 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', flex: 1 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Rank",
            field: "rank",
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
        { headerName: "Modality", field: "modality", type: 'textColumn', flex: 1 },
        { headerName: "Phenotype ID", field: "phenotype_id", type: 'textColumn', flex: 2 },
        { headerName: "Variant ID", field: "variant_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Chrom",
            field: "chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            flex: 1,
        },
        {
            headerName: "Position",
            field: "pos",
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toLocaleString();
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
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
            flex: 1,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#qtls-hybrid-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getDisplayedRowCount();
            countDiv.innerHTML = `Showing ${rowCount.toLocaleString()} rows`;
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

            fetch(`/api/qtls-hybrid?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var qtlsHybridGridDiv = document.querySelector('#qtls-hybrid-grid');
const qtlsHybridGridApi = agGrid.createGrid(qtlsHybridGridDiv, qtlsHybridGridOptions);

// QTLs DDP table

var qtlsDdpGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        { headerName: "Tissue", field: "tissue_name", type: 'textColumn', flex: 2 },
        { headerName: "Tissue ID", field: "tissue", type: 'textColumn', flex: 1 },
        { headerName: "Gene", field: "gene_name", type: 'textColumn', flex: 1 },
        { headerName: "Gene ID", field: "gene_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Rank",
            field: "rank",
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
        {
            headerName: "DDP",
            field: "ddp", 
            type: 'numericColumn',
            cellDataType: 'number',
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
        },
        { headerName: "Variant ID", field: "variant_id", type: 'textColumn', flex: 1 },
        {
            headerName: "Chrom",
            field: "chrom",
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals'] },
            flex: 1,
        },
        {
            headerName: "Position",
            field: "pos",
            type: 'numericColumn',
            cellDataType: 'number',
            valueFormatter: params => {
                if (params.value == null) return '';
                return params.value.toLocaleString();
            },
            sortable: true,
            filter: true,
            filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
            flex: 1,
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
            flex: 1,
        },
    ],
    rowModelType: 'infinite',
    onGridReady: function(params) {
        // Add a div below the grid to show row counts
        const gridDiv = document.querySelector('#qtls-ddp-grid');
        const countDiv = document.createElement('div');
        countDiv.style.padding = '8px';
        countDiv.style.color = '#666';
        gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

        // Update count whenever data changes
        params.api.addEventListener('modelUpdated', function() {
            const rowCount = params.api.getDisplayedRowCount();
            countDiv.innerHTML = `Showing ${rowCount.toLocaleString()} rows`;
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

            fetch(`/api/qtls-ddp?limit=${params.endRow - params.startRow}&offset=${params.startRow}${sortParams}${filterParams}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data.rows, data.totalCount);
                });
        }
    },
};

var qtlsDdpGridDiv = document.querySelector('#qtls-ddp-grid');
const qtlsDdpGridApi = agGrid.createGrid(qtlsDdpGridDiv, qtlsDdpGridOptions);
