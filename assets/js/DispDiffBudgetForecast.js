'use strict'

let dataMetrics = [];
let currentCompanyId = null;
const btnDetailsRevenue = document.querySelector("#btnDetailsRevenue");

//listeners

document.getElementById("submitAlteredBudget").addEventListener("click", () => {
    saveToServer();
    generateCharts();
});

btnDetailsRevenue.addEventListener("click", () => {
    if (btnDetailsRevenue.textContent === "Se detaljer") {
        document.querySelector("#graphRevenueTotal").style.display = "block";
        document.querySelector("#graphRevenueDifference").style.display = "block";
        document.querySelector("#sectionTableBudgetForecast").style.display = "block"
        btnDetailsRevenue.textContent = "Fjern detaljer";
    } else {
        document.querySelector("#graphRevenueTotal").style.display = "none";
        document.querySelector("#graphRevenueDifference").style.display = "none";
        document.querySelector("#sectionTableBudgetForecast").style.display = "none"
     
        btnDetailsRevenue.textContent = "Se detaljer";
    }
});

document.querySelector("#sectionTableBudgetForecast").addEventListener("change", () =>{
    document.querySelector("#saveChangesTableBudgetForecast").style.display = "block"   
});

//fetch and post data
function fetchData() {
    fetch("/api/metrics")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            dataMetrics = data;
            if (dataMetrics.length > 0) {
                const companyData = dataMetrics.find(item => item.companyId === 1);
                if (companyData) {
                    currentCompanyId = companyData.companyId;
                    displayDataInTable(companyData.data);
                }
            }
            generateCharts();
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            const p = document.createElement("p");
            p.textContent = `Error: ${error.message}`;
            document.getElementById("TestafData").appendChild(p);
        });
}

async function saveToServer() {

    updateCompanyDataFromTableRows();

    // Find the company data in dataMetrics
    let companyData = dataMetrics.find(item => item.companyId === currentCompanyId);

    try {
        const response = await fetch("/api/save-metrics", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        console.log("Save successful:", result);
        alert("Data saved successfully!");

    } catch (error) {
        console.error("Error saving data:", error);
        alert(`Error saving data: ${error.message}`);
    }
}

//display data on webpage
function displayDataInTable(data) {
    let table = document.getElementById("tableBudgetForecast");
    table.innerHTML = ''; // Clear existing table content

    // Table headers
    let headers = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    headers.forEach(element => {
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th);
    });

    // Table body
    let tbody = document.createElement("tbody");
    const year = "2025";

    // Row with Budget Revenue
    const rowBudgetRevenue = document.createElement('tr');
    rowBudgetRevenue.id = "rowBudgetRevenue";

    let budgetRevenue = document.createElement("td");
    budgetRevenue.textContent = "Budget for omsætning";
    rowBudgetRevenue.appendChild(budgetRevenue);

    // Check if data exists and has the expected structure
    data.budget.revenue[year].forEach(element => {
            rowBudgetRevenue.appendChild(createInputCell(element));
    });

    // Row with Forecast Revenue
    const rowForecastRevenue = document.createElement('tr');
    rowForecastRevenue.id = "rowForecastRevenue";

    let forecastRevenue = document.createElement("td");
    forecastRevenue.textContent = "Forecast for omsætning";
    rowForecastRevenue.appendChild(forecastRevenue);

    data.forecast.revenue[year].forEach(element => {
            rowForecastRevenue.appendChild(createInputCell(element));
    });

    // Put together the table
    thead.appendChild(headerRow);
    table.appendChild(thead);
    tbody.appendChild(rowBudgetRevenue);
    tbody.appendChild(rowForecastRevenue);
    table.appendChild(tbody);
}

// Helper function to create input cells
const createInputCell = (value) => {
    let input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.placeholder = value;
    input.style.width = "80px";
    input.style.textAlign = "right";

    let td = document.createElement("td");
    td.appendChild(input);
    return td;
};


function updateCompanyDataFromTableRows() {
    const year = "2025";
    
    // Find or create the company data structure
    let companyData = dataMetrics.find(item => item.companyId === currentCompanyId);
    if (!companyData) {
        companyData = {
            companyId: currentCompanyId,
            data: {
                budget: { revenue: {} },
                forecast: { revenue: {} }
            }
        };
        dataMetrics.push(companyData);
    }

    // Initialize data structure if it doesn't exist
    if (!companyData.data) companyData.data = {};
    if (!companyData.data.budget) companyData.data.budget = { revenue: {} };
    if (!companyData.data.forecast) companyData.data.forecast = { revenue: {} };

    // Update the values
    companyData.data.budget.revenue[year] = getTableData("rowBudgetRevenue");
    companyData.data.forecast.revenue[year] = getTableData("rowForecastRevenue");
}

function getTableData(rowId) {
    const row = document.getElementById(rowId);
    const inputs = row.querySelectorAll("input");

    return Array.from(inputs).map(input => {
        const value = parseFloat(input.value);
        return isNaN(value) ? 0 : value;
    });
}

function generateCharts(){

    let companyData = dataMetrics.find(item => item.companyId === currentCompanyId);

    console.log(companyData);


    let forecastRevenue = companyData.data.forecast.revenue["2025"];
    let budgetRevenue = companyData.data.budget.revenue["2025"];
    let diffBudgetForecastRevenue = [];

    for (let i = 0; i<12; i++) {
        diffBudgetForecastRevenue[i] = budgetRevenue[i] - forecastRevenue[i];
    };

    let labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

    const dataBudgetForecast = {
        labels: labels,
        datasets: [
            {
                label: 'Forecast (Omsætning)',
                data: forecastRevenue,
                backgroundColor: 'rgb(66,0,245)'
            },
            {
                label: 'Budget (omsætning)',
                data: budgetRevenue,
                backgroundColor: 'rgb(66,0,0)'
            },
        ]
    };
    
    const dataDiffBudgetForecast = {
        labels: labels,
        datasets: [
            {
                label: 'Difference between sales and budget',
                data: diffBudgetForecastRevenue,
                backgroundColor: 'rgb(66,221,245)'
            },
        ]
    };
    
    const configBudgetForecast = {
        type: 'bar',
        data: dataBudgetForecast
    };
    
    const configDiffBudgetForecast = {
        type: 'line',
        data: dataDiffBudgetForecast
    };
    
    const chartBudgetForecast = new Chart(
        document.getElementById('budgetForecastChart'),
        configBudgetForecast
    );            
    
    const chartDiffBudgetForecast = new Chart(
        document.getElementById('diffBudgetForecastChart'),
        configDiffBudgetForecast
    );
}


// Initialize
fetchData();