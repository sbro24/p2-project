const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;


// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data directory setup
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// GET endpoint for fetching companies
app.get('/api/companies', (req, res) => {
  try {
    const filePath = path.join(dataDir, 'companies.json');
    if (!fs.existsSync(filePath)) {
      return res.json([]);
    }
    const companies = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST endpoint for saving companies
app.post('/api/save-company', (req, res) => {
  try {
    const companyData = req.body;
    
    if (!companyData.name) {
      return res.status(400).json({ 
        success: false, 
        error: "Company name is required" 
      });
    }

    const filePath = path.join(dataDir, 'companies.json');
    let companies = [];

    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        companies = fileContent ? JSON.parse(fileContent) : [];
      } catch (readError) {
        console.error('Error reading file:', readError);
        return res.status(500).json({ 
          success: false, 
          error: "Error reading company data" 
        });
      }
    }

    companyData.id = companies.length > 0 
      ? Math.max(...companies.map(c => c.id)) + 1 
      : 1;
    companyData.createdAt = companyData.createdAt || new Date().toISOString();

    companies.push(companyData);

    fs.writeFile(filePath, JSON.stringify(companies, null, 2), (writeError) => {
      if (writeError) {
        console.error('Write error:', writeError);
        return res.status(500).json({ 
          success: false, 
          error: "Failed to save company data" 
        });
      }
      
      res.json({ 
        success: true, 
        company: companyData 
      });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST endpoint for saving metrics
app.post('/api/save-metrics', (req, res) => {
  try {
    const metricsData = req.body;
    const filePath = path.join(dataDir, 'financialMetrics.json');
    let allMetrics = [];
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      allMetrics = JSON.parse(fileContent);
    }

    const existingIndex = allMetrics.findIndex(m => m.companyId === metricsData.companyId);

    if (existingIndex >= 0) {
      allMetrics[existingIndex] = metricsData;
    } else {
      allMetrics.push(metricsData);
    }

    fs.writeFileSync(filePath, JSON.stringify(allMetrics, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Serving from: ${__dirname}`);
});