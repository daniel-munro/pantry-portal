(function (window) {
  const textColumn = {
    sortable: true,
    filter: true,
    filterParams: { filterOptions: ["contains", "equals"] },
  };

  function buildAgGridQuery(params) {
    let sortParams = "";
    if (params.sortModel && params.sortModel.length > 0) {
      sortParams = `&sort_by=${params.sortModel[0].colId}&order=${params.sortModel[0].sort}`;
    }

    let filterParams = "";
    const filterModel = params.filterModel || {};
    if (Object.keys(filterModel).length > 0) {
      filterParams = `&filterModel=${encodeURIComponent(
        JSON.stringify(filterModel)
      )}`;
    }

    return `limit=${params.endRow - params.startRow}&offset=${
      params.startRow
    }${sortParams}${filterParams}`;
  }

  function numberFormatter(params) {
    if (params.value == null) return "";
    return params.value.toLocaleString();
  }

  function pValueFormatter(params) {
    if (params.value == null) return "";
    return params.value.toExponential(2);
  }

  function selectColumn(headerName, field, values, flex = 1) {
    return {
      headerName,
      field,
      sortable: true,
      filter: SelectFilter,
      filterParams: { values },
      flex,
    };
  }

  function addRowCount(gridId, params) {
    const gridDiv = document.querySelector(`#${gridId}`);
    const countDiv = document.createElement("div");
    countDiv.style.padding = "8px";
    countDiv.style.color = "#666";
    gridDiv.parentNode.insertBefore(countDiv, gridDiv.nextSibling);

    params.api.addEventListener("modelUpdated", function () {
      const rowCount = params.api.getDisplayedRowCount();
      countDiv.innerHTML = `Showing ${rowCount.toLocaleString()} rows`;
    });
  }

  function buildDatasource(endpoint, onError) {
    return {
      getRows: function (params) {
        fetch(`${endpoint}?${buildAgGridQuery(params)}`)
          .then((response) => response.json())
          .then((data) => {
            params.successCallback(data.rows, data.totalCount);
          })
          .catch((error) => {
            if (onError) {
              onError(error, params);
              return;
            }
            console.error(`Error loading ${endpoint}:`, error);
            params.failCallback();
          });
      },
    };
  }

  function createInfiniteGrid(gridId, endpoint, columnDefs, options = {}) {
    const gridOptions = {
      columnTypes: {
        textColumn,
      },
      columnDefs,
      rowModelType: "infinite",
      datasource: buildDatasource(endpoint, options.onError),
      ...options.gridOptions,
    };

    if (options.showRowCount) {
      gridOptions.onGridReady = function (params) {
        addRowCount(gridId, params);
        if (options.gridOptions && options.gridOptions.onGridReady) {
          options.gridOptions.onGridReady(params);
        }
      };
    }

    return agGrid.createGrid(document.querySelector(`#${gridId}`), gridOptions);
  }

  window.PantryGrid = {
    addRowCount,
    buildAgGridQuery,
    buildDatasource,
    createInfiniteGrid,
    numberFormatter,
    pValueFormatter,
    selectColumn,
    textColumn,
  };
})(window);
