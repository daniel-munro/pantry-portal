// Populate tissue select dropdown
fetch('/api/tissues')
    .then(response => response.json())
    .then(tissues => {
        ['rnaphenos-tissue-select', 'covariates-tissue-select'].forEach(selectId => {
            const tissueSelect = document.getElementById(selectId);
            tissueSelect.innerHTML = tissues
                .map(tissue => `<option value="${tissue}">${tissue}</option>`)
                .join('');
            
            // Trigger change event after populating options
            tissueSelect.dispatchEvent(new Event('change'));
        });
    });

const modalities = [
    { file: 'alt_polyA', label: 'Alternative polyA' },
    { file: 'alt_TSS', label: 'Alternative TSS' },
    { file: 'expression', label: 'Expression' },
    { file: 'isoforms', label: 'Isoform ratio' },
    { file: 'splicing', label: 'Intron excision ratio' },
    { file: 'stability', label: 'RNA stability' },
];

const modalities_combined = [
    { file: 'alt_polyA', label: 'Alternative polyA' },
    { file: 'alt_TSS', label: 'Alternative TSS' },
    { file: 'expression', label: 'Expression' },
    { file: 'isoforms', label: 'Isoform ratio' },
    { file: 'splicing', label: 'Intron excision ratio' },
    { file: 'stability', label: 'RNA stability' },
    { file: 'combined', label: 'Combined' }
];


// Build RNA phenotypes table
document.getElementById('rnaphenos-tissue-select').addEventListener('change', function() {
    const tissue = this.value;
    const tableBody = document.getElementById('rnaphenos-table-body');
    tableBody.innerHTML = '';

    modalities.forEach(mod => {
        const fileName = `${tissue}.${mod.file}.unnorm.bed.gz`;
        const row = `
            <tr>
                <td><a href="/static/data/RNA_phenotypes/${fileName}" download>${fileName}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
});

// Build covariates table
document.getElementById('covariates-tissue-select').addEventListener('change', function() {
    const tissue = this.value;
    const tableBody = document.getElementById('covariates-table-body');
    tableBody.innerHTML = '';

    modalities_combined.forEach(mod => {
        const fileName = `${tissue}.${mod.file}.covar.tsv`;
        const row = `
            <tr>
                <td><a href="/static/data/covariates/${fileName}" download>${fileName}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
});

// Build TWAS associations table
fetch('/api/traits')
    .then(response => response.json())
    .then(traits => {
        const rowData = traits.map(trait => ({
            file: `${trait}.tar.bz2`,
            trait: trait
        }));

        var gridOptions = {
            columnDefs: [
                { 
                    headerName: "File", 
                    field: "file", 
                    sortable: true, 
                    filter: true,
                    filterParams: { filterOptions: ['contains', 'equals'] },
                    cellRenderer: params => {
                        return `<a href="/static/data/TWAS_associations/${params.value}" download>${params.value}</a>`;
                    }
                },
                { 
                    headerName: "Trait", 
                    field: "trait", 
                    sortable: true, 
                    filter: true, 
                    filterParams: { filterOptions: ['contains', 'equals'] } 
                },
            ],
            rowData: rowData
        };
        
        var eGridDiv = document.querySelector('#twasassoc-table');
        const gridApi = agGrid.createGrid(eGridDiv, gridOptions);
    });
