const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { main, formatForDisplay } = require('./census-analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// Production environment check
const isProduction = process.env.NODE_ENV === 'production';

// CORS configuration
const corsOptions = {
  origin: isProduction 
    ? [
        'https://census-analytics-dashboard.vercel.app',  // Will be your Vercel domain
        'https://*.vercel.app',  // Allow all Vercel preview domains
      ]
    : ['http://localhost:5173', 'http://localhost:3000'], // Development origins
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: !isProduction, // Disable for development
}));
app.use(cors(corsOptions));
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));

// Trust proxy in production
if (isProduction) {
  app.set('trust proxy', 1);
}

// Cache for census data (to avoid repeated API calls)
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Helper function to check if cache is valid
function isCacheValid() {
  return cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION);
}

// Helper function to get census data (with caching)
async function getCensusData() {
  if (isCacheValid()) {
    console.log('Returning cached data');
    return cachedData;
  }
  
  console.log('Fetching fresh data from Census API...');
  const result = await main();
  
  cachedData = result;
  cacheTimestamp = Date.now();
  
  return result;
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    cache: {
      hasData: !!cachedData,
      age: cacheTimestamp ? Date.now() - cacheTimestamp : 0,
      valid: isCacheValid()
    }
  });
});

// Get raw census data
app.get('/api/census/raw', async (req, res) => {
  try {
    const result = await getCensusData();
    
    res.json({
      success: true,
      data: result.data,
      analysis: result.analysis,
      timestamp: new Date().toISOString(),
      cached: isCacheValid()
    });
  } catch (error) {
    console.error('Error fetching census data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch census data',
      message: error.message
    });
  }
});

// Get formatted census data (display-ready)
app.get('/api/census/formatted', async (req, res) => {
  try {
    const result = await getCensusData();
    const formattedData = formatForDisplay(result.data);
    
    res.json({
      success: true,
      data: formattedData,
      analysis: result.analysis,
      timestamp: new Date().toISOString(),
      cached: isCacheValid()
    });
  } catch (error) {
    console.error('Error fetching formatted census data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch formatted census data',
      message: error.message
    });
  }
});

// Get only the analysis
app.get('/api/census/analysis', async (req, res) => {
  try {
    const result = await getCensusData();
    
    res.json({
      success: true,
      analysis: result.analysis,
      dataPoints: result.data.length,
      timestamp: new Date().toISOString(),
      cached: isCacheValid()
    });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis',
      message: error.message
    });
  }
});

// Get summary statistics
app.get('/api/census/summary', async (req, res) => {
  try {
    const result = await getCensusData();
    const data = result.data;
    
    const usTotal = data.find(row => row.NAME === "United States");
    const statesData = data.filter(row => row.NAME !== "United States");
    
    const summary = {
      totalHispanicPopulation: usTotal?.Hispanic_Pop || 0,
      totalPopulation: usTotal?.Total_Pop || 0,
      hispanicPercentage: usTotal?.["Hispanic_%"] || 0,
      spanishSpeakersPercentage: usTotal?.["Spanish_%"] || 0,
      statesIncluded: statesData.length,
      topStates: statesData.slice(0, 5).map(state => ({
        name: state.NAME,
        hispanicPop: state.Hispanic_Pop,
        hispanicPercent: state["Hispanic_%"]
      }))
    };
    
    res.json({
      success: true,
      summary,
      timestamp: new Date().toISOString(),
      cached: isCacheValid()
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch summary',
      message: error.message
    });
  }
});

// Clear cache endpoint
app.post('/api/cache/clear', (req, res) => {
  cachedData = null;
  cacheTimestamp = null;
  
  res.json({
    success: true,
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString()
  });
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  const docs = {
    title: 'Census Data API',
    description: 'API for accessing US Hispanic demographic data with AI analysis',
    version: '1.0.0',
    endpoints: [
      {
        path: '/health',
        method: 'GET',
        description: 'Health check and cache status'
      },
      {
        path: '/api/census/raw',
        method: 'GET',
        description: 'Get raw census data with numeric values'
      },
      {
        path: '/api/census/formatted',
        method: 'GET',
        description: 'Get formatted census data (display-ready with commas, percentages, etc.)'
      },
      {
        path: '/api/census/analysis',
        method: 'GET',
        description: 'Get only the Anthropic AI analysis'
      },
      {
        path: '/api/census/summary',
        method: 'GET',
        description: 'Get summary statistics and top states'
      },
      {
        path: '/api/cache/clear',
        method: 'POST',
        description: 'Clear the data cache to force fresh API calls'
      },
      {
        path: '/api/docs',
        method: 'GET',
        description: 'This documentation'
      }
    ],
    caching: 'Data is cached for 1 hour to avoid repeated Census API calls'
  };
  
  res.json(docs);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: ['/health', '/api/census/raw', '/api/census/formatted', '/api/census/analysis', '/api/census/summary', '/api/docs']
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Census Data API running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;