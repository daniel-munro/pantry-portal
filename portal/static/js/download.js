// Populate tissue select dropdown
fetch('/api/tissues')
    .then(response => response.json())
    .then(tissues => {
        ['rnaphenos-tissue-select', 'covariates-tissue-select', 'qtls-tissue-select', 'twasmodels-tissue-select'].forEach(selectId => {
            const tissueSelect = document.getElementById(selectId);
            tissueSelect.innerHTML = tissues
                .map(tissue => `<option value="${tissue}">${tissue}</option>`)
                .join('');
            
            // Trigger change event after populating options
            tissueSelect.dispatchEvent(new Event('change'));
        });
    });

const modalities = [
    { id: 'alt_polyA', label: 'Alternative polyA' },
    { id: 'alt_TSS', label: 'Alternative TSS' },
    { id: 'expression', label: 'Expression' },
    { id: 'isoforms', label: 'Isoform ratio' },
    { id: 'splicing', label: 'Intron excision ratio' },
    { id: 'stability', label: 'RNA stability' },
];

const modalities_combined = [
    { id: 'alt_polyA', label: 'Alternative polyA' },
    { id: 'alt_TSS', label: 'Alternative TSS' },
    { id: 'expression', label: 'Expression' },
    { id: 'isoforms', label: 'Isoform ratio' },
    { id: 'splicing', label: 'Intron excision ratio' },
    { id: 'stability', label: 'RNA stability' },
    { id: 'combined', label: 'Combined' }
];


// Build RNA phenotypes table
document.getElementById('rnaphenos-tissue-select').addEventListener('change', function() {
    const tissue = this.value;
    const tableBody = document.getElementById('rnaphenos-table-body');
    tableBody.innerHTML = '';

    modalities.forEach(mod => {
        const fileName = `${tissue}.${mod.id}.unnorm.bed.gz`;
        const row = `
            <tr>
                <td><a href="/data/RNA_phenotypes/${fileName}" download>${fileName}</a></td>
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
        const fileName = `${tissue}.${mod.id}.covar.tsv`;
        const row = `
            <tr>
                <td><a href="/data/covariates/${fileName}" download>${fileName}</a></td>
                <td>${mod.label}</td>
                <td>tensorQTL</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
    modalities.forEach(mod => {
        const fileName = `${tissue}.${mod.id}.covar.plink.tsv`;
        const row = `
            <tr>
                <td><a href="/data/covariates/${fileName}" download>${fileName}</a></td>
                <td>${mod.label}</td>
                <td>PLINK</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
});

// Build xQTLs table
document.getElementById('qtls-tissue-select').addEventListener('change', function() {
    const tissue = this.value;
    const tableBody = document.getElementById('qtls-table-body');

    modalities_combined.forEach(mod => {
        const fileName1 = `${tissue}.${mod.id}.cis_qtl.txt.gz`;
        const row1 = `
            <tr>
                <td><a href="/data/QTLs/${fileName1}" download>${fileName1}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row1;
        const fileName2 = `${tissue}.${mod.id}.cis_independent_qtl.txt.gz`;
        const row2 = `
            <tr>
                <td><a href="/data/QTLs/${fileName2}" download>${fileName2}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row2;
    });
});

// Build TWAS models table
document.getElementById('twasmodels-tissue-select').addEventListener('change', function() {
    const tissue = this.value;
    const tableBody = document.getElementById('twasmodels-table-body');
    tableBody.innerHTML = '';

    modalities.forEach(mod => {
        const fileName1 = `${tissue}.${mod.id}.twas_weights.tar.bz2`;
        const row1 = `
            <tr>
                <td><a href="/data/TWAS_weights/${fileName1}" download>${fileName1}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row1;
        const fileName2 = `${tissue}.${mod.id}.twas_weights.profile`;
        const row2 = `
            <tr>
                <td><a href="/data/TWAS_weights/${fileName2}" download>${fileName2}</a></td>
                <td>${mod.label}</td>
            </tr>
        `;
        tableBody.innerHTML += row2;
    });
});

// Build TWAS associations table
fetch('/api/traits')
    .then(response => response.json())
    .then(traits => {
        const rowData = traits.map(trait => ({
            file: `${trait}.tar.bz2`,
            trait: trait,
        }));

        var gridOptions = {
            columnDefs: [
                { 
                    headerName: "File",
                    field: "file",
                    sortable: true,
                    filter: true,
                    filterParams: { filterOptions: ['contains', 'equals'] },
                    flex: 1,
                    cellRenderer: params => {
                        return `<a href="/data/TWAS_associations/${params.value}" download>${params.value}</a>`;
                    },
                },
                { 
                    headerName: "Trait",
                    field: "trait",
                    sortable: true,
                    filter: true,
                    flex: 1,
                    filterParams: { filterOptions: ['contains', 'equals'] } ,
                },
            ],
            rowData: rowData,
        };
        
        var eGridDiv = document.querySelector('#twasassoc-table');
        const gridApi = agGrid.createGrid(eGridDiv, gridOptions);
        gridApi.sizeColumnsToFit();
    });
