'use strict'

let labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

const dataBudgetForecast = {
    labels: labels,
    datasets: [
        {
            label: 'Forecast (Omsætning)',
            data: revenue,
            backgroundColor: 'rgb(66,0,245)'
        },
        {
            label: 'Budget (omsætning)',
            data: budget,
            backgroundColor: 'rgb(66,0,0)'
        },
    ]
};

const dataDiffBudgetForecast = {
    labels: labels,
    datasets: [
        {
            label: 'Difference between sales and budget',
            data: diffActualBudget,
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