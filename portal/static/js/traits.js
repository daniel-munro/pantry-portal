// Global variables for grid instances
let traitsGridApi;
let hitsGridApi;

// Traits table

fetch('/api/traits')
    .then(response => response.json())
    .then(traits => {
        const rowData = traits.map(trait => ({
            id: trait.id,
            trait: trait.name,
            category: trait.category,
            color: trait.color,
            n: trait.n,
            hits: trait.hits,
            genes: trait.genes
        }));

        const gridOptions = {
            columnDefs: [
                { 
                    headerName: "Trait",
                    field: "trait",
                    sortable: true,
                    filter: true,
                    filterParams: { filterOptions: ['contains', 'equals'] },
                    flex: 1,
                },
                {
                    headerName: "Category", 
                    field: "category",
                    sortable: true,
                    filter: SelectFilter,
                    filterParams: {
                        values: [
                            'Aging', 'Allergy', 'Anthropometric', 'Blood', 'Cancer',
                            'Cardiometabolic', 'Digestive system disease',
                            'Endocrine system', 'Hair morphology', 'Immune',
                            'Psychiatric-neurologic', 'Skeletal system disease',
                        ]
                    },
                    width: 240,
                    cellRenderer: params => {
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
                    }
                },
                {
                    headerName: "GWAS N",
                    field: "n",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    width: 125,
                },
                {
                    headerName: "Hits",
                    field: "hits",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    width: 125,
                },
                {
                    headerName: "Genes",
                    field: "genes",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    width: 125,
                },
            ],
            rowData: rowData,
            rowStyle: { cursor: 'pointer' },
            onRowClicked: (event) => {
                loadTraitHits(event.data.id, event.data.trait);
            },
        };
        
        var eGridDiv = document.querySelector('#traits-table');
        traitsGridApi = agGrid.createGrid(eGridDiv, gridOptions);
    });

// Function to load hits for a selected trait
function loadTraitHits(traitId, traitName) {
    // Show the hits section
    document.getElementById('hits-section').style.display = 'block';
    document.getElementById('hits-table').style.display = 'block';
    document.getElementById('selected-trait-title').textContent = `TWAS Hits for ${traitName}`;
    
    // Scroll to the hits section
    document.getElementById('hits-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Fetch hits data from the API
    fetch(`/api/trait-hits/${traitId}`)
        .then(response => response.json())
        .then(data => {
            const rowData = data.hits;
            
            // Extract unique values for each categorical column
            const uniqueTissueNames = [...new Set(rowData.map(row => row.tissue_name))].sort();
            const uniqueTissueIds = [...new Set(rowData.map(row => row.tissue))].sort();
            const uniqueChroms = [...new Set(rowData.map(row => row.gene_chrom))].sort((a, b) => {
                // Sort chromosomes numerically
                const aNum = parseInt(a.replace('chr', ''));
                const bNum = parseInt(b.replace('chr', ''));
                return aNum - bNum;
            });
            const uniqueModalities = [...new Set(rowData.map(row => row.modality))].sort();
            
            // Define columns for the hits table
            const gridOptions = {
                columnDefs: [
                    {
                        headerName: "Tissue",
                        field: "tissue_name",
                        sortable: true,
                        filter: SelectFilter,
                        filterParams: {
                            values: uniqueTissueNames
                        },
                        flex: 2
                    },
                    {
                        headerName: "Tissue ID",
                        field: "tissue",
                        sortable: true,
                        filter: SelectFilter,
                        filterParams: {
                            values: uniqueTissueIds
                        },
                        flex: 1
                    },
                    {
                        headerName: "Gene",
                        field: "gene_name",
                        sortable: true,
                        filter: true,
                        filterParams: { filterOptions: ['equals', 'contains'] },
                        flex: 1
                    },
                    {
                        headerName: "Gene ID",
                        field: "gene_id",
                        sortable: true,
                        filter: true,
                        filterParams: { filterOptions: ['contains', 'equals'] },
                        flex: 1
                    },
                    {
                        headerName: "Chrom",
                        field: "gene_chrom",
                        sortable: false,
                        filter: SelectFilter,
                        filterParams: {
                            values: uniqueChroms
                        },
                        flex: 1
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
                        flex: 1
                    },
                    {
                        headerName: "Modality",
                        field: "modality",
                        sortable: true,
                        filter: SelectFilter,
                        filterParams: {
                            values: uniqueModalities
                        },
                        flex: 1
                    },
                    {
                        headerName: "Phenotype ID",
                        field: "phenotype_id",
                        sortable: true,
                        filter: true,
                        filterParams: { filterOptions: ['equals', 'contains'] },
                        flex: 2
                    },
                    {
                        headerName: "P-value",
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
                ],
                rowData: rowData,
                pagination: true,
                paginationPageSize: 100,
                paginationPageSizeSelector: [50, 100, 200, 500],
            };
            
            // If grid already exists, destroy it first
            if (hitsGridApi) {
                hitsGridApi.destroy();
            }
            
            var eGridDiv = document.querySelector('#hits-table');
            hitsGridApi = agGrid.createGrid(eGridDiv, gridOptions);
        })
        .catch(error => {
            console.error('Error loading trait hits:', error);
            alert('Failed to load trait hits. Please try again.');
        });
}
