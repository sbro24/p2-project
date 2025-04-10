(function () {

    const API_BASE_URL = 'http://localhost:8080';
    const DELIMITER = ';';
    const NEWLINE = '\n';


    var fileInput = document.getElementById('file');
    var revenueTable = document.getElementById('budget-revenue-table'); // Revenue table element
    var expenseTable = document.getElementById('budget-expense-table'); // Expenses table element
    var exportButton = document.getElementById('btnExportBudget'); // Add a save button in your HTML
    var saveButton = document.getElementById('saveButton'); // Save to server button
    var companyNameInput = document.getElementById('companyName'); // Company name input
    var addCompanyBtn = document.getElementById('addCompanyBtn'); // Add company button

    // Define the company object
    const company = {
        id: null, // Will be set when saving to server
        name: "", // Will be set from the input field
        revenue: [], // Array to store revenue data for each year
        expenses: [] // Array to store expenses data for each year
        
    };

    // Test if the file, tables, or save button is available, if not don't move any further in the program.
    if (!fileInput || !revenueTable || !expenseTable || !exportButton) {
        console.error("Required elements not found!");
        return;
    }

    // The event listener checks if the file input has any selected files. If the 
    fileInput.addEventListener('change', function () {
        // If both conditions are true: If file is selected and the file selected is more than 0 (ie atleast 1 file)
        if (!!fileInput.files && fileInput.files.length > 0) {
            // The parseCSV function is called and parses the selected file: reads the contents and parses it as CSV 
            parseCSV(fileInput.files[0]);
        }
    });

    // Event listener that is triggered by a click of the mouse button
    exportButton.addEventListener('click', function () {
        // This function saves the edited table and converts it into CSV for the ability to download.
        saveChanges();
    });

    // Event listener for save button - handles saving to server
    saveButton.addEventListener('click', function () {
        // This function saves data to the server in JSON format
        EditBudgetData();
    });

    // Event listener for company name changes
    companyNameInput.addEventListener('input', function() {
        updateCompanyName();
    });

    // Event listener for add company button
    if (addCompanyBtn) {
        addCompanyBtn.addEventListener('click', function() {
            updateCompanyName();
        });
    }

    // ========================================================================
    // CORE FUNCTIONS
    // ========================================================================

    /**
     * Updates the company name from the input field
     */
    function updateCompanyName() {
        company.name = companyNameInput.value.trim();
        console.log("Company name updated to:", company.name);
    }


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

        // Clear existing table data while preserving headers
        clearTableData(revenueTable);
        clearTableData(expenseTable);

        // Splits the text string into arrays of rows defined by the NEWLINE character "\n"
        var rows = text.split(NEWLINE);

        // Defines the table headers based on year and months
        var headers = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers if they don't exist
        if (revenueTable.rows.length === 0) {
            addHeaders(revenueTable, headers);
        }
        if (expenseTable.rows.length === 0) {
            addHeaders(expenseTable, headers);
        }

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

    /**
     * Clears table data while preserving headers
     * @param {HTMLTableElement} table - The table to clear
     */
    function clearTableData(table) {
        // Keep the header row (index 0) and remove all others
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }

    /**
     * Adds headers to a table
     * @param {HTMLTableElement} table - The table to add headers to
     * @param {Array} headers - The header labels
     */
    function addHeaders(table, headers) {
        var headerRow = table.createTHead().insertRow(); // Create header row

        // Add each header cell
        headers.forEach(function (h) {
            var th = document.createElement('th');
            th.textContent = h;
            headerRow.appendChild(th);
        });
    }

    /**
     * Adds a data row to a table
     * @param {HTMLTableElement} table - The table to add to
     * @param {string} year - The year for the row
     * @param {Array} data - The monthly data values
     */
    function addRow(table, year, data) {
        var newRow = table.insertRow(); // Create new row

        // Add year column
        var yearCell = newRow.insertCell();
        yearCell.textContent = year;

        // Add monthly data columns
        data.forEach(function (d) {
            var cell = newRow.insertCell();
            cell.textContent = d.trim();
            cell.setAttribute('contenteditable', 'true'); // Make cells editable
        });
    }

    /**
     * Populates the company object from CSV data
     * @param {string} text - The CSV content to parse
     */
    function populateCompanyObject(text) {
        company.revenue = [];
        company.expenses = [];
        
        var rows = text.split(NEWLINE);

        rows.forEach(function (r) {
            r = r.trim();
            if (!r) return;

            var cols = r.split(DELIMITER);
            if (cols.length === 0) return;

            var type = cols[0];
            var year = cols[1];
            var data = cols.slice(2).map(Number); // Convert to numbers

            if (type === "Omsaetning") {
                company.revenue.push({ year: year, data: data });
            } else if (type === "Omkostning") {
                company.expenses.push({ year: year, data: data });
            }
        });

        console.log("Company data loaded:", company);
    }

    // ========================================================================
    // SERVER COMMUNICATION FUNCTIONS
    // ========================================================================

    
    // Saves data to the server in JSON format
    function EditBudgetData() {
        if (!company.name) {
            alert('Please enter a company name');
            companyNameInput.focus();
            return;
        }

        updateCompanyDataFromTables();

        fetchDataCompany();
        
        fetchDataMetrics();

    };

    /**
     * Updates the company object with current table data
     */
    function updateCompanyDataFromTables() {
        company.revenue = getTableData('budget-revenue-table');
        company.expenses = getTableData('budget-expense-table');
        console.log("Updated company data:", company);
    };

    //Parses the data from the JSON file with the company financial metrics and
    //runs it through the "CheckIfIDExists" function
    function fetchDataMetrics() {
        fetch("/api/metrics")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                CheckIfIDExists(data);
                try {
                    // Make the POST request using fetch
                    fetch(`/api/save-metrics-post`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(data)
                    
                    });
                /*
                    // If the response is not OK, throw an error
                    if (!metricsResponse.ok) {
                        const error = metricsResponse.json();
                        throw new Error(error.error || 'Failed to save metrics');
                    }
                
                    // Parse the JSON response from the server
                    const metricsResult = metricsResponse.json();
                    
                    // If everything is fine, show success message and log the result
                    alert('Data successfully saved!');
                    console.log('Saved data:', { company: companyResult, metrics: metricsResult });
                    */
                    alert('Data successfully saved!');
                } catch (error) {
                    // Handle any errors that occur during the fetch or response handling
                    console.error('Save error:', error);
                    alert(`Error saving data: ${error.message}`);
                }
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                const p = document.createElement("p");
                p.textContent = `Error: ${error.message}`;
                document.getElementById("TestafData").appendChild(p);
            });
    };

    //Scans the JSON file containing company financial data for a matching ID to the 
    //entered company name and updates it with the new data.
    function CheckIfIDExists(data) {
        for (i=0; i<data.length; i++) {
            if (data[i].companyId === company.id) {
                for (l=0, f=6; l < f; l++) {
                data[i].data.budget.revenue[2020+l] = company.revenue[l].monthlyData;
                data[i].data.budget.expenses[2020+l] = company.expenses[l].monthlyData;
                }
            }
        }
    };
    
    //Parses the JSON file containing each previously added company and runs it through
    //the "CheckIfNameExists" function.
    function fetchDataCompany() {
        fetch('/api/companies')
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                CheckIfNameExists(data);
            })
            .catch((error) => {
                console.error("Fetch error:", error);
                const p = document.createElement("p");
                p.textContent = `Error: ${error.message}`;
                document.getElementById("TestafData").appendChild(p);
        });
    };


    //Check if an identical name has already been logged in the database, and copy its
    //ID into the company object to later access data tied to the ID
    function CheckIfNameExists(data) {
        for (i=0; i<data.length; i++) {
            
            if (data[i].name === company.name) {
                company.id = data[i].id;
            } 
        }
        return company;
    };

    
    /**
     * Extracts data from a table
     * @param {string} tableId - The ID of the table to extract from
     * @returns {Array} The extracted data
     */

    function getTableData(tableId) {
        const table = document.getElementById(tableId);
        const rows = table.querySelectorAll('tr');
        const data = [];
        
        // Skip header row (index 0)
        for (let i = 1; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('td');
            if (cells.length > 0) {
                data.push({
                    year: cells[0].textContent.trim(),
                    monthlyData: Array.from(cells).slice(1).map(c => c.textContent.trim())
                });
            }
        }
        return data;
    };

    
    // ========================================================================
    // CSV EXPORT FUNCTION
    // ========================================================================


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
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link);
    }
})();