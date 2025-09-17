const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const csvWriter = require('csv-writer');

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Census API configuration
const API_KEY = process.env.CENSUS_API_KEY;
const BASE_URL = "https://api.census.gov/data/2023/acs/acs1";

async function fetchCensusData(params) {
  try {
    const response = await axios.get(BASE_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching census data:', error.message);
    throw error;
  }
}

function convertToNumber(value) {
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}

function calculateWeightedAverage(values, weights) {
  const validPairs = values.map((v, i) => ({ value: v, weight: weights[i] }))
    .filter(pair => pair.value !== null && pair.weight !== null);
  
  const totalValue = validPairs.reduce((sum, pair) => sum + (pair.value * pair.weight), 0);
  const totalWeight = validPairs.reduce((sum, pair) => sum + pair.weight, 0);
  
  return totalWeight > 0 ? totalValue / totalWeight : null;
}

async function main() {
  try {
    console.log('Starting Census data analysis...');

    // 1. Define all variables and fetch data in a single call
    const baseFields = {
      "NAME": "NAME",
      "Hispanic_Pop": "B03001_003E",
      "Total_Pop": "B01003_001E",
      "Spanish_Pop": "C16001_003E",
      "Median_Income": "B19013_001E",
      "Avg_Household_Size": "B25010_001E",
      "Total_Households": "B11001_001E",
      "Hispanic_Median_Income": "B19013I_001E",
      "Hispanic_HH_Size": "B25010I_001E"
    };
    const ageVars = [ "B01001_007E", "B01001_008E", "B01001_009E", "B01001_010E", "B01001_011E", "B01001_012E", "B01001_013E", "B01001_014E", "B01001_015E", "B01001_016E", "B01001_017E", "B01001_018E", "B01001_019E", "B01001_031E", "B01001_032E", "B01001_033E", "B01001_034E", "B01001_035E", "B01001_036E", "B01001_037E", "B01001_038E", "B01001_039E", "B01001_040E", "B01001_041E", "B01001_042E", "B01001_043E" ];
    const ushAgeVars = [ "B01001I_007E", "B01001I_008E", "B01001I_009E", "B01001I_010E", "B01001I_011E", "B01001I_012E", "B01001I_013E", "B01001I_022E", "B01001I_023E", "B01001I_024E", "B01001I_025E", "B01001I_026E", "B01001I_027E", "B01001I_028E" ];
    const spanishVar = "B16004_026E";

    const allVars = [...Object.values(baseFields), ...ageVars, ...ushAgeVars, spanishVar];
    
    console.log('Fetching all census data in a single call...');
    const censusResult = await fetchCensusData({
      get: allVars.join(','),
      for: "state:*",
      key: API_KEY
    });

    // 2. Process the combined data
    const headers = censusResult[0];
    const rows = censusResult.slice(1);
    const headerIndexMap = Object.fromEntries(headers.map((h, i) => [h, i]));

    let censusData = rows.map(row => {
      const d = {};
      // Populate base fields
      for (const [name, code] of Object.entries(baseFields)) {
        d[name] = row[headerIndexMap[code]];
      }

      // Calculate and add Pop_18_64
      d.Pop_18_64 = ageVars.reduce((sum, code) => sum + (convertToNumber(row[headerIndexMap[code]]) || 0), 0);
      
      // Calculate and add USH_18_64
      d.USH_18_64 = ushAgeVars.reduce((sum, code) => sum + (convertToNumber(row[headerIndexMap[code]]) || 0), 0);

      // Add Spanish_18_64
      d.Spanish_18_64 = convertToNumber(row[headerIndexMap[spanishVar]]);

      return d;
    });

    // 3. Convert numeric fields
    const numericFields = [ "Hispanic_Pop", "Spanish_Pop", "Total_Pop", "Median_Income", "Avg_Household_Size", "Total_Households", "Hispanic_Median_Income", "Hispanic_HH_Size" ];
    censusData.forEach(row => {
      numericFields.forEach(field => {
        row[field] = convertToNumber(row[field]);
      });
    });

    // 4. Perform calculations (weighted averages, percentages)
    const totalHispPop = censusData.reduce((sum, row) => sum + (row.Hispanic_Pop || 0), 0);

    const weightedIncome = calculateWeightedAverage( censusData.map(r => r.Median_Income), censusData.map(r => r.Total_Households) );
    const weightedHouseholdSize = calculateWeightedAverage( censusData.map(r => r.Avg_Household_Size), censusData.map(r => r.Total_Households) );
    const weightedHispIncome = calculateWeightedAverage( censusData.map(r => r.Hispanic_Median_Income), censusData.map(r => r.Hispanic_Pop) );
    const weightedHispHHSize = calculateWeightedAverage( censusData.map(r => r.Hispanic_HH_Size), censusData.map(r => r.Hispanic_Pop) );

    censusData.forEach(row => {
      if (row.Total_Pop > 0) {
        row["Hispanic_%"] = (row.Hispanic_Pop / row.Total_Pop) * 100;
        row["Spanish_%"] = (row.Spanish_Pop / row.Total_Pop) * 100;
        row["Total_%"] = 100 - row["Hispanic_%"];
        row["Pop_18_64_%"] = row.Pop_18_64 ? (row.Pop_18_64 / row.Total_Pop) * 100 : null;
      }
      if (row.Hispanic_Pop > 0) {
        row["USH_18_64_%"] = row.USH_18_64 ? (row.USH_18_64 / row.Hispanic_Pop) * 100 : null;
      }
      if (row.Pop_18_64 > 0) {
        row["USH_share"] = row.USH_18_64 ? (row.USH_18_64 / row.Pop_18_64) * 100 : null;
        row["Spanish_18_64_%"] = row.Spanish_18_64 ? (row.Spanish_18_64 / row.Pop_18_64) * 100 : null;
      }
    });

    // 5. Add US totals row
    const totalPop = censusData.reduce((sum, row) => sum + (row.Total_Pop || 0), 0);
    const totalSpanishPop = censusData.reduce((sum, row) => sum + (row.Spanish_Pop || 0), 0);
    const totalPop18_64 = censusData.reduce((sum, row) => sum + (row.Pop_18_64 || 0), 0);
    const totalUsh18_64 = censusData.reduce((sum, row) => sum + (row.USH_18_64 || 0), 0);
    const totalSpanish18_64 = censusData.reduce((sum, row) => sum + (row.Spanish_18_64 || 0), 0);

    const usRow = {
      NAME: "United States",
      Hispanic_Pop: totalHispPop,
      Total_Pop: totalPop,
      Spanish_Pop: totalSpanishPop,
      Median_Income: weightedIncome,
      Avg_Household_Size: weightedHouseholdSize,
      Hispanic_Median_Income: weightedHispIncome,
      Hispanic_HH_Size: weightedHispHHSize,
      Pop_18_64: totalPop18_64,
      USH_18_64: totalUsh18_64,
      Spanish_18_64: totalSpanish18_64,
      "Hispanic_%": (totalHispPop / totalPop) * 100,
      "Spanish_%": (totalSpanishPop / totalPop) * 100,
    };
    usRow["Total_%"] = 100 - usRow["Hispanic_%"];
    usRow["Pop_18_64_%"] = usRow.Pop_18_64 ? (usRow.Pop_18_64 / usRow.Total_Pop) * 100 : null;
    usRow["USH_18_64_%"] = usRow.USH_18_64 ? (usRow.USH_18_64 / usRow.Hispanic_Pop) * 100 : null;
    usRow["USH_share"] = usRow.USH_18_64 ? (usRow.USH_18_64 / usRow.Pop_18_64) * 100 : null;
    usRow["Spanish_18_64_%"] = usRow.Spanish_18_64 ? (usRow.Spanish_18_64 / usRow.Pop_18_64) * 100 : null;
    
    censusData.push(usRow);

    // 6. Sort and filter for final dataset
    censusData.sort((a, b) => (b.Hispanic_Pop || 0) - (a.Hispanic_Pop || 0));

    const statesOnly = censusData.filter(row => row.NAME !== "United States");
    const totalHispanic = statesOnly.reduce((sum, row) => sum + (row.Hispanic_Pop || 0), 0);
    
    let cumulativeHispanic = 0;
    const top80States = [];
    for (const state of statesOnly) {
      if (cumulativeHispanic / totalHispanic <= 0.80) {
        cumulativeHispanic += state.Hispanic_Pop || 0;
        state["Cumulative_Hisp_%"] = cumulativeHispanic / totalHispanic;
        top80States.push(state);
      }
    }

    const usTotal = censusData.find(row => row.NAME === "United States");
    const finalData = [usTotal, ...top80States];

    console.log('Data processing completed. Final dataset includes', finalData.length, 'entries.');
    
    // 7. Generate Anthropic analysis (same as before)
    console.log('Generating Anthropic analysis...');
    const summaryData = finalData.map(row => ({
      NAME: row.NAME,
      Hispanic_Pop: row.Hispanic_Pop,
      Pop_18_64: row.Pop_18_64,
      USH_18_64: row.USH_18_64,
      Spanish_18_64: row.Spanish_18_64,
      USH_share: row.USH_share,
      "Spanish_18_64_%": row["Spanish_18_64_%"]
    }));

    const prompt = `Using the US Census demographic data below — which includes the national summary and the top states accounting for ~80% of the total Hispanic population — give a high-level assessment of the Hispanic retail opportunity over the next 3–5 years for a company like Amazon.

Focus on implications for Spanish-language marketing, digital shopping behavior, and long-term brand strategy. Your answer should be strategic, forward-looking, and written for senior retail and marketing leaders.

${JSON.stringify(summaryData, null, 2)}`;

    let claudeResponse = null;
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      });
      
      claudeResponse = response.content[0].text.trim();
      console.log('\nClaude Analysis:');
      console.log('================');
      console.log(claudeResponse);
    } catch (error) {
      console.error('Error calling Anthropic API:', error.message);
      claudeResponse = 'Error generating analysis: ' + error.message;
    }
    
    return { data: finalData, analysis: claudeResponse };

  } catch (error) {
    console.error('Error in main function:', error);
    throw error;
  }
}

function formatForDisplay(data) {
  return data.map(row => {
    const formatted = { ...row };
    
    // Format large numbers with commas
    const numberFields = ["Hispanic_Pop", "Spanish_Pop", "Total_Pop", "Pop_18_64", "USH_18_64", "Spanish_18_64"];
    numberFields.forEach(field => {
      if (formatted[field] !== null && formatted[field] !== undefined) {
        formatted[field] = Math.round(formatted[field]).toLocaleString();
      }
    });
    
    // Format percentages
    const percentFields = ["Hispanic_%", "Spanish_%", "Total_%", "Pop_18_64_%", "USH_18_64_%", "USH_share", "Spanish_18_64_%"];
    percentFields.forEach(field => {
      if (formatted[field] !== null && formatted[field] !== undefined) {
        formatted[field] = formatted[field].toFixed(2) + '%';
      }
    });
    
    // Format currency
    const currencyFields = ["Median_Income", "Hispanic_Median_Income"];
    currencyFields.forEach(field => {
      if (formatted[field] !== null && formatted[field] !== undefined) {
        formatted[field] = '$' + Math.round(formatted[field]).toLocaleString();
      }
    });
    
    // Format household sizes
    const householdFields = ["Avg_Household_Size", "Hispanic_HH_Size"];
    householdFields.forEach(field => {
      if (formatted[field] !== null && formatted[field] !== undefined) {
        formatted[field] = formatted[field].toFixed(2);
      }
    });
    
    return formatted;
  });
}

async function saveToFiles(data, analysis) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const outputDir = path.join(__dirname, 'output');
  
  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  
  const csvPath = path.join(outputDir, `hispanic_stats_${timestamp}.csv`);
  const excelPath = path.join(outputDir, `hispanic_stats_with_summary_${timestamp}.xlsx`);
  
  console.log('Saving files...');
  
  // Format data for display
  const displayData = formatForDisplay(data);
  
  // Save CSV
  const csvHeaders = [
    { id: 'NAME', title: 'State' },
    { id: 'Hispanic_Pop', title: 'Hispanic Population' },
    { id: 'Hispanic_%', title: 'Hispanic %' },
    { id: 'Spanish_Pop', title: 'Spanish Speakers' },
    { id: 'Spanish_%', title: 'Spanish %' },
    { id: 'Total_Pop', title: 'Total Population' },
    { id: 'Pop_18_64', title: 'Population 18-64' },
    { id: 'USH_18_64', title: 'Hispanic 18-64' },
    { id: 'Spanish_18_64', title: 'Spanish Speakers 18-64' },
    { id: 'Median_Income', title: 'Median Income' },
    { id: 'Avg_Household_Size', title: 'Avg Household Size' },
    { id: 'Hispanic_Median_Income', title: 'Hispanic Median Income' },
    { id: 'Hispanic_HH_Size', title: 'Hispanic Household Size' },
    { id: 'USH_18_64_%', title: 'Hispanic 18-64 %' },
    { id: 'Pop_18_64_%', title: 'Population 18-64 %' },
    { id: 'USH_share', title: 'Hispanic Share of 18-64' },
    { id: 'Spanish_18_64_%', title: 'Spanish Speakers 18-64 %' }
  ];
  
  const csvWriterInstance = csvWriter.createObjectCsvWriter({
    path: csvPath,
    header: csvHeaders
  });
  
  await csvWriterInstance.writeRecords(displayData);
  
  // Save Excel with multiple sheets
  const workbook = XLSX.utils.book_new();
  
  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(displayData);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'State Stats');
  
  // Add analysis sheet
  const analysisWorksheet = XLSX.utils.json_to_sheet([{ 'Claude Analysis': analysis }]);
  XLSX.utils.book_append_sheet(workbook, analysisWorksheet, 'Analysis');
  
  // Write Excel file
  XLSX.writeFile(workbook, excelPath);
  
  console.log(`Files saved:`);
  console.log(`- CSV: ${csvPath}`);
  console.log(`- Excel: ${excelPath}`);
  
  return { csvPath, excelPath };
}

// Run the script
if (require.main === module) {
  main()
    .then(async result => {
      console.log('\nSample data:');
      console.log(result.data.slice(0, 3).map(row => ({
        NAME: row.NAME,
        Hispanic_Pop: row.Hispanic_Pop,
        'Hispanic_%': row["Hispanic_%"]?.toFixed(2) + '%'
      })));
      
      // Save to files
      await saveToFiles(result.data, result.analysis);
      
      console.log('\n✅ Census analysis completed successfully!');
    })
    .catch(error => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

module.exports = { main, formatForDisplay, saveToFiles };