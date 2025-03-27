const API_BASE_URL = 'http://localhost:8080'; 

async function addCompany() {
    const companyName = document.getElementById('companyName').value.trim();
    
    if (!companyName) {
        alert('Please enter a company name');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/save-company`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                name: companyName,
                createdAt: new Date().toISOString() 
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            alert(`Company "${companyName}" added with ID: ${result.company.id}`);
            sessionStorage.setItem('currentCompanyId', result.company.id);
            updateCurrentCompanyDisplay();
        }
    } catch (error) {
        console.error('Error saving company:', error);
        alert(`Failed to save company: ${error.message}`);
    }
}

async function saveFinancialMetrics() {
    const currentCompanyId = sessionStorage.getItem('currentCompanyId');
    
    if (!currentCompanyId) {
        alert('Please add or select a company first');
        return;
    }

    const revenueData = getTableData('revenue-table');
    const expenseData = getTableData('expense-table');

    try {
        const response = await fetch(`${API_BASE_URL}/api/save-metrics`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                companyId: parseInt(currentCompanyId),
                revenue: revenueData,
                expenses: expenseData,
                updatedAt: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
            alert('Financial metrics saved successfully');
            // Verify by fetching the updated data
            console.log('Current companies:', await fetchCompanies());
        }
    } catch (error) {
        console.error('Error saving metrics:', error);
        alert(`Failed to save financial metrics: ${error.message}`);
    }
}

// Helper function to fetch companies (for verification)
async function fetchCompanies() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/companies`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
    }
}