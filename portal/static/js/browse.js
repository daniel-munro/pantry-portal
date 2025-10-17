// Column type definitions
const textColumn = {
    sortable: true,
    filter: true,
    filterParams: { filterOptions: ['contains', 'equals'] }
};

// Reusable column definitions
const COLUMNS = {
    tissue_name: {
        headerName: "Tissue",
        field: "tissue_name",
        sortable: true,
        filter: SelectFilter,
        filterParams: {
            values: [
                'Adipose - Subcutaneous', 'Adipose - Visceral (Omentum)', 'Adrenal Gland',
                'Artery - Aorta', 'Artery - Coronary', 'Artery - Tibial',
                'Brain - Amygdala', 'Brain - Anterior cingulate cortex (BA24)',
                'Brain - Caudate (basal ganglia)', 'Brain - Cerebellar Hemisphere',
                'Brain - Cerebellum', 'Brain - Cortex', 'Brain - Frontal Cortex (BA9)',
                'Brain - Hippocampus', 'Brain - Hypothalamus',
                'Brain - Nucleus accumbens (basal ganglia)',
                'Brain - Putamen (basal ganglia)', 'Brain - Spinal cord (cervical c-1)',
                'Brain - Substantia nigra', 'Breast - Mammary Tissue',
                'Cells - EBV-transformed lymphocytes', 'Cells - Cultured fibroblasts',
                'Colon - Sigmoid', 'Colon - Transverse',
                'Esophagus - Gastroesophageal Junction', 'Esophagus - Mucosa',
                'Esophagus - Muscularis', 'Heart - Atrial Appendage',
                'Heart - Left Ventricle', 'Kidney - Cortex', 'Liver', 'Lung',
                'Minor Salivary Gland', 'Muscle - Skeletal', 'Nerve - Tibial', 'Ovary',
                'Pancreas', 'Pituitary', 'Prostate',
                'Skin - Not Sun Exposed (Suprapubic)', 'Skin - Sun Exposed (Lower leg)',
                'Small Intestine - Terminal Ileum', 'Spleen', 'Stomach', 'Testis',
                'Thyroid', 'Uterus', 'Vagina', 'Whole Blood',
            ]
        },
        flex: 2
    },
    tissue: {
        headerName: "Tissue ID",
        field: "tissue",
        sortable: true,
        filter: SelectFilter,
        filterParams: {
            values: [
                'ADPSBQ', 'ADPVSC', 'ADRNLG', 'ARTAORT', 'ARTCRN', 'ARTTBL', 'BREAST',
                'BRNACC', 'BRNAMY', 'BRNCDT', 'BRNCHA', 'BRNCHB', 'BRNCTXA', 'BRNCTXB',
                'BRNHPP', 'BRNHPT', 'BRNNCC', 'BRNPTM', 'BRNSNG', 'BRNSPC', 'CLNSGM',
                'CLNTRN', 'ESPGEJ', 'ESPMCS', 'ESPMSL', 'FIBRBLS', 'HRTAA', 'HRTLV',
                'KDNCTX', 'LCL', 'LIVER', 'LUNG', 'MSCLSK', 'NERVET', 'OVARY', 'PNCREAS',
                'PRSTTE', 'PTTARY', 'SKINNS', 'SKINS', 'SLVRYG', 'SNTTRM', 'SPLEEN', 
                'STMACH', 'TESTIS', 'THYROID', 'UTERUS', 'VAGINA', 'WHLBLD',
            ]
        },
        flex: 1
    },
    trait: {
        headerName: "Trait",
        field: "trait",
        type: 'textColumn',
        flex: 2
    },
    gene_name: {
        headerName: "Gene",
        field: "gene_name",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ['equals', 'contains'] },
        flex: 1
    },
    gene_id: {
        headerName: "Gene ID",
        field: "gene_id",
        type: 'textColumn',
        flex: 1
    },
    gene_chrom: {
        headerName: "Chrom",
        field: "gene_chrom",
        sortable: false,
        filter: SelectFilter,
        filterParams: {
            values: [
                'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9',
                'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17',
                'chr18', 'chr19', 'chr20', 'chr21', 'chr22',
            ]
        },
        flex: 1
    },
    gene_tss: {
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
        flex: 1
    },
    modality: {
        headerName: "Modality",
        field: "modality",
        sortable: true,
        filter: SelectFilter,
        filterParams: {
            values: [
                'Alternative polyA',
                'Alternative TSS',
                'Expression',
                'Isoform ratio',
                'Intron excision ratio',
                'RNA stability',
                'Latent residual'
            ]
        },
        flex: 1
    },
    phenotype_id: {
        headerName: "Phenotype ID",
        field: "phenotype_id",
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ['equals', 'contains'] },
        flex: 2
    },
    twas_p: {
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
        flex: 1
    },
    ddp: {
        headerName: "DDP",
        field: "ddp",
        type: 'numericColumn',
        cellDataType: 'number',
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
        flex: 1
    },
    rank: {
        headerName: "Rank",
        field: "rank",
        type: 'numericColumn',
        cellDataType: 'number',
        sortable: true,
        filter: true,
        filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
        flex: 1
    },
    variant_id: {
        headerName: "Variant ID",
        field: "variant_id",
        type: 'textColumn',
        flex: 1
    },
    chrom: {
        headerName: "Chrom",
        field: "chrom",
        sortable: false,
        filter: SelectFilter,
        filterParams: {
            values: [
                'chr1', 'chr2', 'chr3', 'chr4', 'chr5', 'chr6', 'chr7', 'chr8', 'chr9',
                'chr10', 'chr11', 'chr12', 'chr13', 'chr14', 'chr15', 'chr16', 'chr17',
                'chr18', 'chr19', 'chr20', 'chr21', 'chr22',
            ]
        },
        flex: 1
    },
    pos: {
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
        flex: 1
    },
    pval_beta: {
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
        flex: 1
    }
};

// TWAS hybrid phenotypes table

var twasHybridGridOptions = {
    columnTypes: {
        textColumn: textColumn,
    },
    columnDefs: [
        COLUMNS.tissue_name,
        COLUMNS.tissue,
        COLUMNS.trait,
        COLUMNS.gene_name,
        COLUMNS.gene_id,
        COLUMNS.gene_chrom,
        COLUMNS.gene_tss,
        COLUMNS.modality,
        COLUMNS.phenotype_id,
        COLUMNS.twas_p,
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
        COLUMNS.tissue_name,
        COLUMNS.tissue,
        COLUMNS.trait,
        COLUMNS.gene_name,
        COLUMNS.gene_id,
        COLUMNS.gene_chrom,
        COLUMNS.gene_tss,
        COLUMNS.ddp,
        COLUMNS.twas_p,
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
        COLUMNS.tissue_name,
        COLUMNS.tissue,
        COLUMNS.gene_name,
        COLUMNS.gene_id,
        COLUMNS.rank,
        COLUMNS.modality,
        COLUMNS.phenotype_id,
        COLUMNS.variant_id,
        COLUMNS.chrom,
        COLUMNS.pos,
        COLUMNS.pval_beta,
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
        COLUMNS.tissue_name,
        COLUMNS.tissue,
        COLUMNS.gene_name,
        COLUMNS.gene_id,
        COLUMNS.rank,
        COLUMNS.ddp,
        COLUMNS.variant_id,
        COLUMNS.chrom,
        COLUMNS.pos,
        COLUMNS.pval_beta,
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
