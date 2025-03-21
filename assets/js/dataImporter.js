(function () {
    var DELIMITER = ';';
    var NEWLINE = '\n';
    var i = document.getElementById('file');
    var revenueTable = document.getElementById('revenue-table');
    var expenseTable = document.getElementById('expense-table');
    var saveButton = document.getElementById('saveButton');

    // Define the company object
    const company = {
        name: "Your Company Name", // Replace with the actual company name
        revenue: [], // Array to store revenue data for each year
        expenses: [] // Array to store expenses data for each year
    };

    // Test if the file, tables, or save button is available
    if (!i || !revenueTable || !expenseTable || !saveButton) {
        console.error("Required elements not found!");
        return;
    }

    // Event listener for file input change
    i.addEventListener('change', function () {
        if (!!i.files && i.files.length > 0) {
            parseCSV(i.files[0]);
        }
    });

    // Event listener for save button click
    saveButton.addEventListener('click', function () {
        saveChanges();
    });

    // Function to parse the CSV file
    function parseCSV(file) {
        if (!file || !FileReader) {
            console.error("File or FileReader not supported!");
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            toTable(e.target.result);
            populateCompanyObject(e.target.result); // Populate the company object
        };

        reader.readAsText(file);
    }

    // Function to populate the tables with CSV data
    function toTable(text) {
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

        // Add headers to both tables
        var headers = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        addHeaders(revenueTable, headers);
        addHeaders(expenseTable, headers);

        // Split the text into rows
        var rows = text.split(NEWLINE);

        // Process each row
        rows.forEach(function (r) {
            r = r.trim();

            if (!r) {
                return;
            }

            var cols = r.split(DELIMITER);

            if (cols.length === 0) {
                return;
            }

            var type = cols[0]; // Revenue or Expenses
            var year = cols[1]; // Year
            var data = cols.slice(2); // Monthly data

            // Populate the correct table based on the type
            if (type === "Omsætning") { // Revenue
                addRow(revenueTable, year, data);
            } else if (type === "Omkostning") { // Expenses
                addRow(expenseTable, year, data);
            }
        });
    }

    // Function to add headers to a table
    function addHeaders(table, headers) {
        var htr = document.createElement('tr');
        headers.forEach(function (h) {
            var th = document.createElement('th');
            th.textContent = h;
            htr.appendChild(th);
        });
        table.appendChild(htr);
    }

    // Function to add a row to a table
    function addRow(table, year, data) {
        var rtr = document.createElement('tr');

        // Add year column
        var yearTd = document.createElement('td');
        yearTd.textContent = year;
        rtr.appendChild(yearTd);

        // Add monthly data columns
        data.forEach(function (d) {
            var td = document.createElement('td');
            td.textContent = d.trim();
            td.setAttribute('contenteditable', 'true'); // Make cells editable
            rtr.appendChild(td);
        });

        table.appendChild(rtr);
    }

    // Function to populate the company object
    function populateCompanyObject(text) {
        var rows = text.split(NEWLINE);

        rows.forEach(function (r) {
            r = r.trim();

            if (!r) {
                return;
            }

            var cols = r.split(DELIMITER);

            if (cols.length === 0) {
                return;
            }

            var type = cols[0]; // Revenue or Expenses
            var year = cols[1]; // Year
            var data = cols.slice(2).map(Number); // Monthly data

            if (type === "Omsætning") { // Revenue
                company.revenue.push({ year: year, data: data });
            } else if (type === "Omkostning") { // Expenses
                company.expenses.push({ year: year, data: data });
            }
        });

        console.log(company); // Log the company object to verify the data
    }

    // Function to save changes and download the updated CSV
    function saveChanges() {
        var rows = [];
        var headers = ["Type", "Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers to the CSV
        rows.push(headers.join(DELIMITER));

        // Collect data from the revenue table
        var revenueRows = revenueTable.querySelectorAll('tr');
        revenueRows.forEach(function (tr, rowIndex) {
            if (rowIndex === 0) return; // Skip the header row

            var cols = tr.querySelectorAll('td');
            var rowData = ["Omsætning"]; // Add type (Revenue)

            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            rows.push(rowData.join(DELIMITER));
        });

        // Collect data from the expense table
        var expenseRows = expenseTable.querySelectorAll('tr');
        expenseRows.forEach(function (tr, rowIndex) {
            if (rowIndex === 0) return; // Skip the header row

            var cols = tr.querySelectorAll('td');
            var rowData = ["Omkostning"]; // Add type (Expenses)

            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            rows.push(rowData.join(DELIMITER));
        });

        // Convert rows to CSV format
        var csvContent = rows.join(NEWLINE);

        // Create a downloadable CSV file
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'edited_data.csv';
        link.click();
    }
})();