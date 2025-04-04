// Define the company object
const API_BASE_URL = 'http://localhost:8080';
const company = {
    id: null, // Will be set when saving to server
    name: "", // Will be set from the input field
    data: {},  // Array to store forecast data for each year
};

let companyNameInput;

// Wait for DOM to load before attaching events
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('company_name_id');
    companyNameInput = document.getElementById('name_id');

    // Attach form submission handler
    form.addEventListener('submit', formSubmitHandler);
});

function formSubmitHandler(event) {
    event.preventDefault();
    company.name = document.getElementById("name_id").value;
    alert("Virksomhed oprettet: " + company.name);
    saveToServer();
}
    
 /**
     * Saves data to the server in JSON format
     */
 async function saveToServer() {
    //updateCompanyDataFromTables();

    company.data = buildTableData();
    console.log(company)
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
                data: company.data,
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
 * Builds table data structure without HTML tables
 * returns {Array} Data in same format as old getTableData()
 */
function buildTableData() {
    // Creates array with same structure as old HTML-scraped data
    return {
        result: {
            revenue: createEmptyYearData(5, 2020),
            expenses: createEmptyYearData(5, 2020)
        },
        budget: {
            revenue: createEmptyYearData(6, 2020),
            expenses: createEmptyYearData(6, 2020)
        },
        forecast: {
            revenue: createEmptyYearData(1, 2025),
            expenses: createEmptyYearData(1, 2025)
        }
    };

}

function createEmptyYearData(yearCount, startYear) {
    const result = {};

    for (let i = 0; i < yearCount; i++) {
        result[(startYear + i).toString()] = new Array(12).fill(0);
    }
    
    return result;
}