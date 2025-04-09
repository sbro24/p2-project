'use strict'

let labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

window.onload = function () {
    document.getElementById("companyForecastBtn").addEventListener("click", function() {
        if (document.getElementById("companyName").value === "") {
            alert("Please enter a company name");
            return;
        }
        let companyName = document.getElementById("companyName").value;
        fetch('/api/companies')
        .then(response => response.json()) // Parse JSON
        .then(data => {
            let company = data.find(c => c.name === companyName);
            if (company === undefined) {
                alert("could't find company");
                return;
            }
            displayChart(company.id)
        })
        .catch(error => console.error('Error fetching companies:', error));
    });
}

function appendChart(sectionID, chartConfig) {
    let section = document.getElementById(sectionID);
    let canvas = document.createElement("canvas");
    section.appendChild(canvas);
    new Chart(canvas, chartConfig);
}

function displayChart(id) {
    fetch('/api/metrics') // Fetch the JSON data from the server
    .then(response => response.json()) // Parse JSON
    .then(data => {
        let company = data.find(c => c.companyId === id);
        console.log(company);

        // do stuff with your json data here... 
        const dataForecastRevenue = {
            labels: labels,
            datasets: [
                {
                    label: 'Forecast (Omsætning)',
                    data: company.data.forecast.revenue[2025],
                    backgroundColor: 'rgb(66,0,245)'
                },
            ]
        };

        const dataForecastExpenses = {
            labels: labels,
            datasets: [
                {
                    label: 'Forecast (omkostninger)',
                    data: company.data.forecast.expenses[2025],
                    backgroundColor: 'rgb(66,0,0)'
                },
            ]
        };
        const configForecastRevenue = {
            type: 'line',
            data: dataForecastRevenue
        };
        
        const configForecastExpenses = {
            type: 'line',
            data: dataForecastExpenses
        };

        appendChart("sectionForecastRevenue", configForecastRevenue);
        appendChart("sectionForecastExpenses", configForecastExpenses);
    })
    .catch(error => console.error('Error fetching JSON:', error)
    );
};