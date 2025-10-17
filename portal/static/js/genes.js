// Global variables for grid instances
let genesGridApi;
let hitsGridApi;

// Genes table

fetch('/api/genes')
    .then(response => response.json())
    .then(genes => {
        const rowData = genes.map(gene => ({
            id: gene.id,
            name: gene.name,
            biotype: gene.biotype,
            chrom: gene.chrom,
            start: gene.start,
            end: gene.end,
            strand: gene.strand,
            hits: gene.hits,
            traits: gene.traits
        }));

        // Extract unique values for categorical filters
        const uniqueBiotypes = [...new Set(rowData.map(row => row.biotype))].sort();
        const uniqueChroms = [...new Set(rowData.map(row => row.chrom))].sort((a, b) => {
            // Sort chromosomes numerically
            const aNum = parseInt(a.replace('chr', ''));
            const bNum = parseInt(b.replace('chr', ''));
            return aNum - bNum;
        });

        const gridOptions = {
            columnDefs: [
                { 
                    headerName: "ID",
                    field: "id",
                    sortable: true,
                    filter: true,
                    filterParams: { filterOptions: ['contains', 'equals'] },
                    flex: 1,
                },
                { 
                    headerName: "Name",
                    field: "name",
                    sortable: true,
                    filter: true,
                    filterParams: { filterOptions: ['equals', 'contains'] },
                    flex: 1,
                },
                {
                    headerName: "Type", 
                    field: "biotype",
                    sortable: true,
                    filter: SelectFilter,
                    filterParams: {
                        values: uniqueBiotypes
                    },
                    flex: 1,
                },
                {
                    headerName: "Chromosome",
                    field: "chrom",
                    sortable: false,
                    filter: SelectFilter,
                    filterParams: {
                        values: uniqueChroms
                    },
                    flex: 0.8,
                },
                {
                    headerName: "Start",
                    field: "start",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    valueFormatter: params => {
                        if (params.value == null) return '';
                        return params.value.toLocaleString();
                    },
                    flex: 1,
                },
                {
                    headerName: "End",
                    field: "end",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    valueFormatter: params => {
                        if (params.value == null) return '';
                        return params.value.toLocaleString();
                    },
                    flex: 1,
                },
                {
                    headerName: "Strand",
                    field: "strand",
                    sortable: true,
                    filter: SelectFilter,
                    filterParams: {
                        values: ['+', '-']
                    },
                    flex: 0.6,
                },
                {
                    headerName: "Hits",
                    field: "hits",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    flex: 0.7,
                },
                {
                    headerName: "Traits",
                    field: "traits",
                    sortable: true,
                    filter: true,
                    type: 'numericColumn',
                    filterParams: { filterOptions: ['equals', 'lessThan', 'greaterThan'] },
                    flex: 0.7,
                },
            ],
            rowData: rowData,
            rowStyle: { cursor: 'pointer' },
            pagination: true,
            paginationPageSize: 100,
            paginationPageSizeSelector: [50, 100, 200, 500],
            onRowClicked: (event) => {
                loadGeneHits(event.data.id, event.data.name);
            },
        };
        
        var eGridDiv = document.querySelector('#genes-table');
        genesGridApi = agGrid.createGrid(eGridDiv, gridOptions);
    });

// Function to load hits for a selected gene
function loadGeneHits(geneId, geneName) {
    // Show the hits section
    document.getElementById('hits-section').style.display = 'block';
    document.getElementById('hits-table').style.display = 'block';
    const displayName = geneName ? geneName : geneId;
    document.getElementById('selected-gene-title').textContent = `TWAS Hits for ${displayName}`;
    
    // Scroll to the hits section
    document.getElementById('hits-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Fetch hits data from the API
    fetch(`/api/gene-hits/${geneId}`)
        .then(response => response.json())
        .then(data => {
            const rowData = data.hits;
            
            // Extract unique values for each categorical column
            const uniqueTissueNames = [...new Set(rowData.map(row => row.tissue_name))].sort();
            const uniqueTissueIds = [...new Set(rowData.map(row => row.tissue))].sort();
            const uniqueTraits = [...new Set(rowData.map(row => row.trait))].sort();
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
                        headerName: "Trait",
                        field: "trait",
                        sortable: true,
                        filter: SelectFilter,
                        filterParams: {
                            values: uniqueTraits
                        },
                        flex: 2
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
            console.error('Error loading gene hits:', error);
            alert('Failed to load gene hits. Please try again.');
        });
}
