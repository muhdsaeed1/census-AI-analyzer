# 📊 Census Analytics Dashboard

Full-stack web application for analyzing US Hispanic demographic data with AI-powered insights.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express.js-5-lightgrey)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue)

## 🌟 Features

### Backend API
- 📈 **Census Data Processing**: Fetches Hispanic demographic data from US Census Bureau
- 🤖 **AI Analysis**: Generates strategic market insights using Anthropic's Claude AI
- 🚀 **RESTful API**: 7 documented endpoints with smart caching
- 🛡️ **Security**: CORS, Helmet, rate limiting, input validation
- 📤 **Export**: CSV and Excel data export capabilities

### Frontend Dashboard
- 📊 **Interactive Charts**: Bar and pie charts with Chart.js
- 📱 **Responsive Design**: Mobile-first with Tailwind CSS
- 🔄 **Real-time Data**: Live API integration with caching indicators
- 📋 **Multi-view Interface**: Summary, Charts, Data Table, AI Analysis
- ⚡ **Fast Performance**: Optimized with Vite build tool

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Local Development

1. **Clone and install**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/census-analyzer.git
   cd census-analyzer
   
   # Backend
   npm install
   
   # Frontend  
   cd frontend
   npm install
   cd ..
   ```

2. **Set environment variables**:
   ```bash
   # Backend
   export ANTHROPIC_API_KEY=your_api_key_here
   
   # Frontend (create frontend/.env.development)
   echo "VITE_API_BASE_URL=http://localhost:3000" > frontend/.env.development
   ```

3. **Run development servers**:
   ```bash
   # Terminal 1 - Backend API
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

4. **Open in browser**:
   - Dashboard: http://localhost:5173
   - API Documentation: http://localhost:3000/api/docs

## 🏗️ Architecture

```
census-analyzer/
├── server.js              # Express API server
├── census-analyzer.js     # Core data processing logic
├── package.json           # Backend dependencies
├── frontend/              # React dashboard
│   ├── src/
│   │   ├── App.jsx       # Main dashboard component
│   │   └── App.css       # Tailwind styles
│   ├── package.json      # Frontend dependencies
│   └── dist/             # Production build
├── DEPLOYMENT.md         # Cloud deployment guide
└── README.md            # This file
```

## 📚 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check and cache status |
| `/api/docs` | GET | API documentation |
| `/api/census/raw` | GET | Raw numeric census data |
| `/api/census/formatted` | GET | Display-ready formatted data |
| `/api/census/summary` | GET | Key statistics and top states |
| `/api/census/analysis` | GET | AI-generated market insights |
| `/api/cache/clear` | POST | Force cache refresh |

## 🎨 Frontend Views

1. **Summary Dashboard**: Key metrics cards and top states ranking
2. **Interactive Charts**: Bar charts (population by state) and pie charts (composition)
3. **Data Table**: Sortable, searchable demographic data
4. **AI Analysis**: Full strategic insights from Claude AI

## 🌐 Deployment

Ready for cloud deployment! See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

**Recommended Stack**:
- **Backend**: Railway (free tier)
- **Frontend**: Vercel (free tier)
- **Benefits**: Auto-deploy, SSL, custom domains

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **AI**: Anthropic Claude API
- **Data**: US Census Bureau API
- **Security**: Helmet, CORS, Morgan
- **Export**: XLSX, CSV Writer

### Frontend
- **Framework**: React 18 with hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📊 Data Sources

- **US Census Bureau**: American Community Survey (ACS) 2023 data
- **Anthropic Claude**: AI analysis and strategic insights
- **Geographic Scope**: All 50 states + Washington DC + Puerto Rico
- **Demographics**: Hispanic population, language preferences, income data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **US Census Bureau** for demographic data
- **Anthropic** for Claude AI analysis
- **Chart.js** for beautiful visualizations
- **Tailwind CSS** for rapid styling
- **Vercel & Railway** for free hosting

---

**Built with ❤️ by Alberto Dominguez**

*Learning full-stack development one API call at a time* 🚀