(function () {
    var DELIMITER = ';';
    var NEWLINE = '\n';
    var i = document.getElementById('file');
    var revenueTable = document.getElementById('budget-revenue-table'); // Revenue table element
    var expenseTable = document.getElementById('budget-expense-table'); // Expenses table element
    var exportButton = document.getElementById('btnExportBudget'); // Add a save button in your HTML

    // Define the company object
    const company = {
        name: "Your Company Name", // Replace with the actual company name
        revenue: [], // Array to store revenue data for each year
        expenses: [] // Array to store expenses data for each year
    };

    // Test if the file, tables, or save button is available, if not don't move any further in the program.
    if (!i || !revenueTable || !expenseTable || !exportButton) {
        console.error("Required elements not found!");
        return;
    }

    // The event listener checks if the file input has any selected files. If the 
    i.addEventListener('change', function () {
        // If both conditions are true: If file is selected and the file selected is more than 0 (ie atleast 1 file)
        if (!!i.files && i.files.length > 0) {
            // The parseCSV function is called and parses the selected file: reads the contents and parses it as CSV 
            parseCSV(i.files[0]);
        }
    });

    // Event listener that is triggered by a click of the mouse button
    exportButton.addEventListener('click', function () {
        // This function saves the edited table and converts it into CSV for the ability to download.
        saveChanges();
    });

    // This function overall is used to process the data from the selected file
    // The parseCSV function takes one argument "file", which is defined in the html document. 
    function parseCSV(file) {
        // An if statement to check that the file is valid: not undefined or NULL, while FileReader ensures that the api is supported by the browser
        if (!file || !FileReader) {
            // Exits early if statements are not true
            return;
        }

        // Defines a new FileReader variable
        var reader = new FileReader();

        // This part of the code is the onload process of the code. Onload is a function inside the FileReader API, that executes when the file is read to completion
        // The function has an argument "e", which is the event and the file, read as text strings, is passed to "e.target.result", where it is then stored in both the
        // HTML "to Table" function and also the "populateCompanyObject", which is the object where there are arrays defined to store the data from the file
        reader.onload = function (e) {
            toTable(e.target.result);
            populateCompanyObject(e.target.result); // Populate the company object
        };

        // Reads the content of the file as a text string, once the whole file is read the ".onload" function is executed 
        reader.readAsText(file);
    }

    // Function that takes "text" as an argument, where it is expected that it stores the CSV files contents as a string
    function toTable(text) {
        // Check that text is not: undefined or NULL, while table checks if the table has been defined in the (DOM) html 
        if (!text || !revenueTable || !expenseTable) {
            console.error("No text or tables found!");
            return;
        }

        // Clear tables
        while (!!revenueTable.lastElementChild) {
            revenueTable.removeChild(revenueTable.lastElementChild);
        }
        while (!!expenseTable.lastElementChild) {
            expenseTable.removeChild(expenseTable.lastElementChild);
        }

        // Splits the text string into arrays of rows defined by the NEWLINE character "\n"
        var rows = text.split(NEWLINE);

        // Defines the table headers based on year and months
        var headers = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers to both tables
        addHeaders(revenueTable, headers);
        addHeaders(expenseTable, headers);

        // Function that processes each row of the CSV file
        rows.forEach(function (r) {
            // .trim removes any whitespaces from the row
            r = r.trim();

            // If statement that skips any empty rows
            if (!r) {
                return;
            }

            // Variable columns that splits each row into columns using the DELIMITER: ";"
            var cols = r.split(DELIMITER);

            // If the row has no columns it skips it
            if (cols.length === 0) {
                return;
            }

            // Extract the type (Revenue or Expenses) and year from the row
            var type = cols[0]; // First column: "Omsætning" (Revenue) or "Omkostning" (Expenses)
            var year = cols[1]; // Second column: Year
            var data = cols.slice(2); // Remaining columns: Monthly data

            // Populate the correct table based on the type
            if (type === "Omsaetning") { // Revenue
                addRow(revenueTable, year, data); // Add the row to the revenue table
            } else if (type === "Omkostning") { // Expenses
                addRow(expenseTable, year, data); // Add the row to the expenses table
            }
        });
    }

    // Function to add headers to a table
    function addHeaders(table, headers) {
        // Creates a new table row (tr) for the header row
        var htr = document.createElement('tr');

        // The function iterates over the headers array and creates a table header ("th") for each element
        headers.forEach(function (h) {
            var th = document.createElement('th');
            th.textContent = h;
            // Appends the table headers to the header row (htr)
            htr.appendChild(th);
        });

        // This appends the header row to the table
        table.appendChild(htr);
    }

    // Function to add a row to a table
    function addRow(table, year, data) {
        // Creates a new table row
        var rtr = document.createElement('tr');

        // Add year column
        var yearTd = document.createElement('td');
        yearTd.textContent = year; // Set the year text
        rtr.appendChild(yearTd); // Append the year cell to the row

        // Add monthly data columns
        data.forEach(function (d) {
            var td = document.createElement('td');
            td.textContent = d.trim(); // Set the monthly data text
            td.setAttribute('contenteditable', 'true'); // Make the cell editable
            rtr.appendChild(td); // Append the data cell to the row
        });

        // Append the row to the table
        table.appendChild(rtr);
    }

    // Function that adds the data from CSV file into the object "company"
    function populateCompanyObject(text) {
        // Splits the data into rows using the NEWLINE character "\n"
        var rows = text.split(NEWLINE);

        // Iterates over each row
        rows.forEach(function (r) {
            // Trims the data so each row avoids whitespaces
            r = r.trim();

            // If row is empty skip
            if (!r) {
                return;
            }

            // Creates arrays based on the rows using the DELIMITER: ";"
            var cols = r.split(DELIMITER);

            // Checks if the columns are empty
            if (cols.length === 0) {
                return;
            }

            // Stores the data based on if it is either expenses or revenue
            var type = cols[0]; // First column: "Omsætning" (Revenue) or "Omkostning" (Expenses)
            var year = cols[1]; // Second column: Year
            var data = cols.slice(2).map(Number); // Remaining columns: Monthly data (converted to numbers)

            // Stores the data "Revenue" into the object "company". The data is represented as an object containing two elements: Year (2020-2024) and the data
            if (type === "Omsaetning") { // Revenue
                company.revenue.push({ year: year, data: data });
            }
            // Stores the data "Expenses" into the object "company". The data is represented as an object containing two elements: Year (2020-2024) and the data
            else if (type === "Omkostning") { // Expenses
                company.expenses.push({ year: year, data: data });
            }
        });

        console.log(company); // Log the company object to verify the data
    }

    // Function to save changes and download the updated CSV
    function saveChanges() {
        var rows = []; // Array to store the CSV rows
        var headers = ["Type", "Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers to the CSV
        rows.push(headers.join(DELIMITER));

        // Collect data from the revenue table
        var revenueRows = revenueTable.querySelectorAll('tr');
        revenueRows.forEach(function (tr, rowIndex) {
            if (rowIndex === 0) return; // Skip the header row

            var cols = tr.querySelectorAll('td');
            var rowData = ["Omsaetning"]; // Add type (Revenue)

            // Collect data from each cell in the row
            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            // Add the row data to the CSV
            rows.push(rowData.join(DELIMITER));
        });

        // Collect data from the expense table
        var expenseRows = expenseTable.querySelectorAll('tr');
        expenseRows.forEach(function (tr, rowIndex) {
            if (rowIndex === 0) return; // Skip the header row

            var cols = tr.querySelectorAll('td');
            var rowData = ["Omkostning"]; // Add type (Expenses)

            // Collect data from each cell in the row
            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            // Add the row data to the CSV
            rows.push(rowData.join(DELIMITER));
        });

        // Convert rows to CSV format
        var csvContent = rows.join(NEWLINE);

        // Create a downloadable CSV file
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'edited_data.csv'; // Set the file name
        link.click(); // Trigger the download
    }
})();