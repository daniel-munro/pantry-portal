// Shared custom select filter component for AG Grid categorical columns
// This component provides a multi-select checkbox filter with Select All/Clear All functionality
class SelectFilter {
    init(params) {
        this.params = params;
        this.valueGetter = params.valueGetter;
        this.filterChangedCallback = params.filterChangedCallback;
        this.selectedValues = new Set();
        
        // Create the UI
        this.eGui = document.createElement('div');
        this.eGui.style.padding = '10px';
        this.eGui.style.width = '250px';
        
        // Add "Select All" / "Clear All" buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginBottom = '8px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '5px';
        
        const selectAllBtn = document.createElement('button');
        selectAllBtn.textContent = 'Select All';
        selectAllBtn.className = 'btn btn-sm btn-outline-primary';
        selectAllBtn.style.fontSize = '0.75rem';
        selectAllBtn.style.padding = '2px 8px';
        selectAllBtn.onclick = () => this.selectAll();
        
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.className = 'btn btn-sm btn-outline-secondary';
        clearAllBtn.style.fontSize = '0.75rem';
        clearAllBtn.style.padding = '2px 8px';
        clearAllBtn.onclick = () => this.clearAll();
        
        buttonContainer.appendChild(selectAllBtn);
        buttonContainer.appendChild(clearAllBtn);
        this.eGui.appendChild(buttonContainer);
        
        // Create checkboxes for each option
        this.checkboxes = [];
        const values = params.values || [];
        values.forEach(value => {
            const label = document.createElement('label');
            label.style.display = 'block';
            label.style.marginBottom = '5px';
            label.style.cursor = 'pointer';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = value;
            checkbox.style.marginRight = '5px';
            checkbox.onchange = () => this.onCheckboxChange();
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(value));
            this.eGui.appendChild(label);
            
            this.checkboxes.push(checkbox);
        });
    }
    
    onCheckboxChange() {
        this.selectedValues.clear();
        this.checkboxes.forEach(cb => {
            if (cb.checked) {
                this.selectedValues.add(cb.value);
            }
        });
        this.filterChangedCallback();
    }
    
    selectAll() {
        this.checkboxes.forEach(cb => cb.checked = true);
        this.onCheckboxChange();
    }
    
    clearAll() {
        this.checkboxes.forEach(cb => cb.checked = false);
        this.onCheckboxChange();
    }
    
    getGui() {
        return this.eGui;
    }
    
    doesFilterPass(params) {
        if (this.selectedValues.size === 0) {
            return true; // No filter applied
        }
        // Get the value from the row data
        const value = this.valueGetter ? this.valueGetter(params) : params.data[this.params.colDef.field];
        return this.selectedValues.has(value);
    }
    
    isFilterActive() {
        return this.selectedValues.size > 0;
    }
    
    getModel() {
        if (this.selectedValues.size === 0) {
            return null;
        }
        return {
            filterType: 'select',
            values: Array.from(this.selectedValues)
        };
    }
    
    setModel(model) {
        this.selectedValues.clear();
        this.checkboxes.forEach(cb => cb.checked = false);
        
        if (model && model.values) {
            model.values.forEach(value => {
                this.selectedValues.add(value);
                const checkbox = this.checkboxes.find(cb => cb.value === value);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
    }
}
