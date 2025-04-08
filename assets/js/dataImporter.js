/**
 * Data Importer - Handles CSV file import/export and server communication
 * Maintains all original functionality while adding JSON server storage
 */

(function () {
    // Constants for CSV parsing
    
    const API_BASE_URL = 'http://localhost:8080';
    const DELIMITER = ';';
    const NEWLINE = '\n';

    // DOM elements
    var fileInput = document.getElementById('file');
    var revenueTable = document.getElementById('revenue-table'); // Revenue table element
    var expenseTable = document.getElementById('expense-table'); // Expenses table element
    var saveButton = document.getElementById('saveButton'); // Save to server button
    var exportButton = document.getElementById('exportButton'); // Export CSV button
    var companyNameInput = document.getElementById('companyName'); // Company name input
    var addCompanyBtn = document.getElementById('addCompanyBtn'); // Add company button

    // Define the company object
    const company = {
        id: null, // Will be set when saving to server
        name: "", // Will be set from the input field
        revenue: [], // Array to store revenue data for each year
        expenses: [] // Array to store expenses data for each year
        
    };

    // ========================================================================
    // INITIALIZATION AND EVENT LISTENERS
    // ========================================================================

    // Test if required elements are available
    if (!fileInput || !revenueTable || !expenseTable || !saveButton || !exportButton || !companyNameInput) {
        console.error("Required elements not found!");
        return;
    }

    // Event listener for file input change - handles CSV file selection
    fileInput.addEventListener('change', function () {
        // If file is selected and the file selected is more than 0 (ie atleast 1 file)
        if (fileInput.files && fileInput.files.length > 0) {
            // The parseCSV function is called and parses the selected file
            parseCSV(fileInput.files[0]);
        }
    });

    // Event listener for export button - handles CSV export
    exportButton.addEventListener('click', function () {
        // This function saves the edited table and converts it into CSV for download
        saveChanges();
    });

    // Event listener for save button - handles saving to server
    saveButton.addEventListener('click', function () {
        // This function saves data to the server in JSON format
        // saveToServer();
        EditResultData();
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

    /**
     * Processes the selected CSV file
     * @param {File} file - The CSV file to parse
     */
    function parseCSV(file) {
        // Check that the file is valid and FileReader API is supported
        if (!file || !FileReader) {
            console.error("File or FileReader not available");
            return;
        }

        // Create a new FileReader
        var reader = new FileReader();

        // Executes when the file is read to completion
        reader.onload = function (e) {
            toTable(e.target.result); // Populate HTML tables
            populateCompanyObject(e.target.result); // Populate the company object
        };

        // Read the content of the file as a text string
        reader.readAsText(file);
    }

    /**
     * Converts CSV text to HTML table format
     * @param {string} text - The CSV content to convert
     */
    function toTable(text) {
        // Check that text and tables exist
        if (!text || !revenueTable || !expenseTable) {
            console.error("No text or tables found!");
            return;
        }

        // Clear existing table data while preserving headers
        clearTableData(revenueTable);
        clearTableData(expenseTable);

        // Split the text into rows
        var rows = text.split(NEWLINE);

        // Define table headers
        var headers = ["Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers if they don't exist
        if (revenueTable.rows.length === 0) {
            addHeaders(revenueTable, headers);
        }
        if (expenseTable.rows.length === 0) {
            addHeaders(expenseTable, headers);
        }

        // Process each row of the CSV file
        rows.forEach(function (r) {
            r = r.trim(); // Remove whitespace
            
            if (!r) return; // Skip empty rows

            var cols = r.split(DELIMITER); // Split row into columns
            
            if (cols.length === 0) return; // Skip if no columns

            // Extract data type, year, and monthly data
            var type = cols[0]; // "Omsaetning" (Revenue) or "Omkostning" (Expenses)
            var year = cols[1]; // Year
            var data = cols.slice(2); // Monthly data

            // Add to appropriate table
            if (type === "Omsaetning") {
                addRow(revenueTable, year, data);
            } else if (type === "Omkostning") {
                addRow(expenseTable, year, data);
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
    function EditResultData() {
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
        company.revenue = getTableData('revenue-table');
        company.expenses = getTableData('expense-table');
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
                for (l=0, f=5; l < f; l++) {
                data[i].data.result.revenue[2020+l] = company.revenue[l].monthlyData;
                data[i].data.result.expenses[2020+l] = company.expenses[l].monthlyData;
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

    /**
     * Saves table data as CSV file
     */
    function saveChanges() {
        var rows = [];
        var headers = ["Type", "Year", "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Add headers
        rows.push(headers.join(DELIMITER));

        // Process revenue table
        var revenueRows = revenueTable.querySelectorAll('tr');
        for (let i = 1; i < revenueRows.length; i++) {
            var cols = revenueRows[i].querySelectorAll('td');
            var rowData = ["Omsaetning"]; // Revenue type

            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            rows.push(rowData.join(DELIMITER));
        }

        // Process expense table
        var expenseRows = expenseTable.querySelectorAll('tr');
        for (let i = 1; i < expenseRows.length; i++) {
            var cols = expenseRows[i].querySelectorAll('td');
            var rowData = ["Omkostning"]; // Expense type

            cols.forEach(function (td) {
                rowData.push(td.textContent.trim());
            });

            rows.push(rowData.join(DELIMITER));
        }

        // Create and download CSV file
        var csvContent = rows.join(NEWLINE);
        var blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = company.name ? `${company.name.replace(/[^a-z0-9]/gi, '_')}_data.csv` : 'financial_data.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();