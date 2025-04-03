// Define the company object
const API_BASE_URL = 'http://localhost:8080';
const company = {
    id: null, // Will be set when saving to server
    name: "", // Will be set from the input field
    revenue: [], // Array to store revenue data for each year
    expenses: [] // Array to store expenses data for each year
};

// Wait for DOM to load before attaching events
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('company_name_id');
    
    // Attach form submission handler
    form.addEventListener('submit', formSubmitHandler);
});

function formSubmitHandler(event) {
    event.preventDefault();
    const companyName = document.getElementById("name_id").value;
    if (companyName) {
        alert("Virksomhed oprettet: " + companyName);
    } else {
        alert("Indtast venligst et virksomhedsnavn.");
        return;
    }
    
    company.name = companyName;

    saveToServer();
}
    
 /**
     * Saves data to the server in JSON format
     */
 async function saveToServer() {
    if (!company.name) {
        alert('Please enter a company name');
        companyNameInput.focus();
        return;
    }

    updateCompanyDataFromTables();

    try {
        // Save company - with response validation
        const companyResponse = await fetch(`${API_BASE_URL}/api/save-company`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                name: company.name,
                createdAt: new Date().toISOString() 
            })
        });

        // First check if we got any response at all
        if (!companyResponse.ok) {
            const error = await companyResponse.json();
            throw new Error(error.error || 'Failed to save company');
        }

        const companyResult = await companyResponse.json();
        company.id = companyResult.company.id;

        // Then check if the response indicates success
        if (!companyResponse.ok || !companyResult.success) {
            throw new Error(companyResult.error || 'Failed to save company');
        }

        company.id = companyResult.company.id;

        // Save metrics
        const metricsResponse = await fetch(`${API_BASE_URL}/api/save-metrics`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                companyId: company.id,
                companyName: company.name,
                revenue: company.revenue,
                expenses: company.expenses,
                updatedAt: new Date().toISOString()
            })
        });

        const metricsResult = await metricsResponse.json();
        
          if (!metricsResponse.ok) {
        const error = await metricsResponse.json();
        throw new Error(error.error || 'Failed to save metrics');
    }

        alert('Data successfully saved!');
        console.log('Saved data:', { company: companyResult, metrics: metricsResult });
    } catch (error) {
        console.error('Save error:', error);
        alert(`Error saving data: ${error.message}`);
    }
}
/**
 * Updates the company object with current table data
 */
function updateCompanyDataFromTables() {
    company.revenue = getTableData('revenue-table');
    company.expenses = getTableData('expense-table');
    console.log("Updated company data:", company);
}

/**
 * Extracts data from a table
 * @param {string} tableId - The ID of the table to extract from
 * @returns {Array} The extracted data
 */

function getTableData(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.querySelectorAll('tr');
    const data = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length > 0) {
            data.push({
                year: cells[0].textContent.trim(),
                monthlyData: Array.from(cells).slice(1).map(c => c.textContent.trim())
            });
        }
    }
    return data;
}