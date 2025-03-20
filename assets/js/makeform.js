let years = [2020, 2021, 2022, 2023, 2024];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let data = [12270, 18249, 17095, 16671, 17914, 17448, 16931, 12708, 14447, 17242, 10499, 11886];

function generateTable(sectionId, isExpense = false) {
    let table = document.getElementById(sectionId);
    let count = 0;
    years.forEach(year => {
        let row = `<tr><td>${year}</td>`;
        months.forEach(month => {
            let inputName = isExpense ? `exp_${month.toLowerCase()}${year}` : `${month.toLowerCase()}${year}`;
            row += `<td><input type='number' name='${inputName}' placeholder=${data[count]}></td>`;
            count++;
        });
        row += `</tr>`;
        table.innerHTML += row;
    });
}

// Ensure DOM is loaded before running scripts
document.addEventListener("DOMContentLoaded", function() {
    generateTable("revenue-table");
    generateTable("expense-table", true);
});
