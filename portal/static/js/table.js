var gridOptions = {
    columnDefs: [
        { headerName: "ID", field: "id" },
        { headerName: "Gene", field: "gene" },
        // Add more columns as needed
    ],
    rowModelType: 'infinite',
    datasource: {
        getRows: function (params) {
            fetch(`/api/twas?limit=${params.endRow - params.startRow}&offset=${params.startRow}`)
                .then(response => response.json())
                .then(data => {
                    params.successCallback(data, data.totalCount);
                });
        }
    }
};

var eGridDiv = document.querySelector('#myGrid');
new agGrid.Grid(eGridDiv, gridOptions);
