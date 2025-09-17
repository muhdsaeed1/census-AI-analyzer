![census ai](https://github.com/user-attachments/assets/539fcf05-3404-44be-abb9-8db58122e3f3)
# Census Analytics Dashboard - Backend API

US Hispanic Census Data Analytics API with AI-powered insights using Claude AI.

## Features

- 📊 **Census Data Processing**: Fetches and processes Hispanic demographic data from US Census API
- 🤖 **AI Analysis**: Generates strategic insights using Anthropic's Claude AI
- 🚀 **RESTful API**: Clean, documented endpoints for data access
- ⚡ **Caching**: Smart caching to minimize API calls
- 🛡️ **Security**: Helmet, CORS, rate limiting
- 📈 **Export**: CSV and Excel data export capabilities

## API Endpoints

- `GET /health` - Health check and cache status
- `GET /api/docs` - API documentation
- `GET /api/census/raw` - Raw census data with numeric values
- `GET /api/census/formatted` - Display-ready formatted data
- `GET /api/census/analysis` - AI analysis only
- `GET /api/census/summary` - Summary statistics
- `POST /api/cache/clear` - Clear data cache

## Environment Variables

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NODE_ENV=production
PORT=3000
```

## Local Development

```bash
# Install dependencies
npm install

# Set environment variables
export ANTHROPIC_API_KEY=your_key_here

# Start development server
npm run dev
```

## Deployment

### Railway Deployment

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Manual Deployment

```bash
# Build for production
NODE_ENV=production npm start
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **AI**: Anthropic Claude API
- **Data**: US Census Bureau API
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Export**: XLSX, CSV Writer

## License

MIT License - see LICENSE file for details.
