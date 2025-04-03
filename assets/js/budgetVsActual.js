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







// table (not done yet)

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