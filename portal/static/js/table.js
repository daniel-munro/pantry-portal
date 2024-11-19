// TWAS results table

var gridOptions = {
    columnDefs: [
        { headerName: "Tissue", field: "tissue", sortable: true, filter: true, filterParams: { filterOptions: ['contains', 'equals'] } },
        { headerName: "Trait", field: "trait", sortable: true, filter: true, filterParams: { filterOptions: ['contains', 'equals'] } },
        { headerName: "Gene ID", field: "gene_id", sortable: true, filter: true, filterParams: { filterOptions: ['contains', 'equals'] } },
        { headerName: "Modality", field: "modality", sortable: true, filter: true, filterParams: { filterOptions: ['contains', 'equals'] } },
        { headerName: "Phenotype ID", field: "phenotype_id", sortable: true, filter: true, filterParams: { filterOptions: ['contains', 'equals'] } },
        { headerName: "TWAS p-value", field: "twas_p", sortable: true, filter: true, filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'], maxFiltersCount: 1 } },
    ],
    rowModelType: 'infinite',
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
    }
};

var eGridDiv = document.querySelector('#myGrid');
const gridApi = agGrid.createGrid(eGridDiv, gridOptions);
