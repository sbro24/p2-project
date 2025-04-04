'use strict'

function fetchData() {
    fetch("/api/metrics")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            calcYearlyDiffToTable(data[0].data);
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            const p = document.createElement("p");
            p.textContent = `Error: ${error.message}`;
            document.getElementById("TestafData").appendChild(p);
        });
}


function calcYearlyDiffToTable(data) {
    
    let year = "2025";
    
    let yearlyDiffRevenue = calcYearlyTotal(data.budget.revenue[year]) - calcYearlyTotal(data.forecast.revenue[year]);
    document.getElementById("diffRevenueTotal").textContent = yearlyDiffRevenue;

    let yearlyDiffExpenses = calcYearlyTotal(data.budget.expenses[year]) - calcYearlyTotal(data.forecast.expenses[year]);
    document.getElementById("diffExpensesTotal").textContent = yearlyDiffExpenses;

}

function calcYearlyTotal(data) {
    let yearlyTotal = 0;
    data.forEach(element => {
        yearlyTotal += element
    });
    return yearlyTotal;
}

fetchData();
