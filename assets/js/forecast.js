'use strict'

let companyForecast = {
    name: "Seasonal business",
    id: 1,
    revenue: {
        2020: [12000, 15000, 18000, 22000, 25000, 30000, 27000, 26000, 24000, 20000, 17000, 14000], 
        2021: [13000, 16000, 19000, 23000, 26000, 31000, 28000, 27000, 25000, 21000, 18000, 15000], 
        2022: [14000, 17000, 20000, 24000, 27000, 32000, 29000, 28000, 26000, 22000, 19000, 16000], 
        2023: [15000, 18000, 21000, 25000, 28000, 33000, 30000, 29000, 27000, 23000, 20000, 17000], 
        2024: [16000, 19000, 22000, 26000, 29000, 34000, 31000, 30000, 28000, 24000, 21000, 18000]
    },
    expenses: {
        2020: [8000, 9000, 10000, 11000, 12000, 15000, 14000, 13000, 12000, 11000, 10000, 9000],
        2021: [8500, 9500, 10500, 11500, 12500, 15500, 14500, 13500, 12500, 11500, 10500, 9500],
        2022: [9000, 10000, 11000, 12000, 13000, 16000, 15000, 14000, 13000, 12000, 11000, 10000],
        2023: [9500, 10500, 11500, 12500, 13500, 16500, 15500, 14500, 13500, 12500, 11500, 10500],
        2024: [10000, 11000, 12000, 13000, 14000, 17000, 16000, 15000, 14000, 13000, 12000, 11000]
    },
    forecastRevenue: {
        2025: [16800, 19950, 23100, 27300, 30450, 35700, 32550, 31500, 29400, 25200, 22050, 18900]
    },
    forecastExpenses: {
        2025: [10500, 11550, 12600, 13650, 14700, 17850, 16800, 15750, 14700, 13650, 12600, 11550]
    }
};

let labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

fetch('financialMetrics.json')
    .then(response => response.json()) // Parse JSON
    .then(data => {
        console.log(data); // Work with JSON data
        // do stuff with your json data here... 
        const dataForecastRevenue = {
            labels: labels,
            datasets: [
                {
                    label: 'Forecast (Omsætning)',
                    data: data.forecast.revenue[2025],
                    backgroundColor: 'rgb(66,0,245)'
                },
            ]
        };

        const dataForecastExpenses = {
            labels: labels,
            datasets: [
                {
                    label: 'Forecast (omkostninger)',
                    data: data.forecast.expenses[2025],
                    backgroundColor: 'rgb(66,0,0)'
                },
            ]
        };
    })
    .catch(error => console.error('Error fetching JSON:', error));

/* 
const dataForecastRevenue = {
    labels: labels,
    datasets: [
        {
            label: 'Forecast (Omsætning)',
            data: companyForecast.forecastRevenue[2025],
            backgroundColor: 'rgb(66,0,245)'
        },
    ]
};

const dataForecastExpenses = {
    labels: labels,
    datasets: [
        {
            label: 'Forecast (omkostninger)',
            data: companyForecast.forecastExpenses[2025],
            backgroundColor: 'rgb(66,0,0)'
        },
    ]
};
*/

const configForecastRevenue = {
    type: 'bar',
    data: dataForecastRevenue
};

const configForecastExpenses = {
    type: 'bar',
    data: dataForecastExpenses
};

function appendChart(sectionID, chartConfig) {
    let section = document.getElementById(sectionID);
    let canvas = document.createElement("canvas");
    section.appendChild(canvas);
    new Chart(canvas, chartConfig);
}

appendChart("sectionForecastRevenue", configForecastRevenue);
appendChart("sectionForecastExpenses", configForecastExpenses);