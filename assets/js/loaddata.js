'use strict';

function fetchData() {
    fetch("/api/financialMetrics")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Process the data and generate table
            generateTableBudgetForecast(data[0].data, 'revenue', '2025');
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            const p = document.createElement("p");
            p.textContent = `Error: ${error.message}`;
            document.getElementById("TestafData").appendChild(p);
        });
}

function generateTableBudgetForecast(data, metric, year) {
    // Clear previous content
    const container = document.getElementById("TestafData");
    container.innerHTML = '';
    
    // Get the data we need
    const budgetData = data.budget[metric][year];
    const forecastData = data.forecast[metric][year];
    
    // Create table element
    const table = document.createElement('table');
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const monthHeader = document.createElement('th');
    monthHeader.textContent = 'Month';
    
    const budgetHeader = document.createElement('th');
    budgetHeader.textContent = `Budget ${year}`;
    
    const forecastHeader = document.createElement('th');
    forecastHeader.textContent = `Forecast ${year}`;
    
    headerRow.appendChild(monthHeader);
    headerRow.appendChild(budgetHeader);
    headerRow.appendChild(forecastHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 12; i++) {
        const row = document.createElement('tr');
        
        // Month column
        const monthCell = document.createElement('td');
        monthCell.textContent = monthNames[i];
        
        // Budget column
        const budgetCell = document.createElement('td');
        budgetCell.textContent = budgetData[i]
        
        // Forecast column
        const forecastCell = document.createElement('td');
        forecastCell.textContent = forecastData[i]
        
        row.appendChild(monthCell);
        row.appendChild(budgetCell);
        row.appendChild(forecastCell);
        tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    document.getElementById("virkerDet").appendChild(table);
    container.appendChild(table);
}

fetchData();