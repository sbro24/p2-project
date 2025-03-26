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

const btnManuelInputBudget = document.querySelector("#btnManuelInputBudget");

btnManuelInputBudget.addEventListener("click", function() {
    generateTable("budget-revenue-table");
    generateTable("budget-expense-table", true);
});
