'use strict'

let company = {
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
    },
    budget: {
        revenue: {
            2020: [12500, 15500, 18500, 22500, 25500, 30500, 27500, 26500, 24500, 20500, 17500, 14500],
            2021: [13500, 16500, 19500, 23500, 26500, 31500, 28500, 27500, 25500, 21500, 18500, 15500],
            2022: [14500, 17500, 20500, 24500, 27500, 32500, 29500, 28500, 26500, 22500, 19500, 16500],
            2023: [15500, 18500, 21500, 25500, 28500, 33500, 30500, 29500, 27500, 23500, 20500, 17500],
            2024: [16500, 19500, 22500, 26500, 29500, 34500, 31500, 30500, 28500, 24500, 21500, 18500],
            2025: [17200, 20200, 23200, 27400, 30600, 35800, 32800, 31800, 29600, 25400, 22200, 19000]
        },
        expenses: {
            2020: [8200, 9200, 10200, 11200, 12200, 15200, 14200, 13200, 12200, 11200, 10200, 9200],
            2021: [8700, 9700, 10700, 11700, 12700, 15700, 14700, 13700, 12700, 11700, 10700, 9700],
            2022: [9200, 10200, 11200, 12200, 13200, 16200, 15200, 14200, 13200, 12200, 11200, 10200],
            2023: [9700, 10700, 11700, 12700, 13700, 16700, 15700, 14700, 13700, 12700, 11700, 10700],
            2024: [10200, 11200, 12200, 13200, 14200, 17200, 16200, 15200, 14200, 13200, 12200, 11200],
            2025: [10700, 11700, 12700, 13700, 14700, 17700, 16700, 15700, 14700, 13700, 12700, 11700]
        }
    }
};

function calcYearlyTotal(metric) {
    let yearlyTotal = 0;
    metric.forEach(element => {
        yearlyTotal += element
    });
    return yearlyTotal;
}

function calcYearlyDiffToTable(forecastMetric, BudgetMetric, elementID) {
    let yearlyDiff = calcYearlyTotal(BudgetMetric) - calcYearlyTotal(forecastMetric);
    document.getElementById(elementID).textContent = yearlyDiff;
}

calcYearlyDiffToTable(company.forecastExpenses[2025], company.budget.expenses[2025], "diffExpensesTotal");
calcYearlyDiffToTable(company.forecastRevenue[2025], company.budget.revenue[2025], "diffRevenueTotal");

let years = [2025];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function generateTable(sectionId, isExpense = false) {
    let table = document.getElementById(sectionId);
    let count = 0;
    years.forEach(year => {
        let row = `<tr><td>${year}</td>`;
        months.forEach(month => {
            let inputName = isExpense ? `exp_${month.toLowerCase()}${year}` : `${month.toLowerCase()}${year}`;
            row += `<td><input type='number' name='${inputName}' placeholder="0.00"></td>`;
            count++;
        });
        row += `</tr>`;
        table.innerHTML += row;
    });
}

generateTable("tableBudgetForecast");

let tableBudgetForecast = document.getElementById("tableBudgetForecast");

tableBudgetForecast.addEventListener("input", function(){
    document.getElementById("saveChangesTableBudgetForecast").style.display = "block";
} );