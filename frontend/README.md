# census-AI-analyzer - Frontend

Interactive React dashboard for visualizing US Hispanic Census demographics with AI-powered insights.

## Features

- 📊 **Interactive Charts**: Bar charts and pie charts using Chart.js
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔄 **Real-time Data**: Connects to live API with caching indicators
- 📋 **Multiple Views**: Summary, Charts, Data Table, and AI Analysis
- 📤 **Export Functionality**: Download data in JSON format
- ⚡ **Fast Loading**: Optimized with Vite build tool

## Views

1. **Summary**: Key metrics and top states ranking
2. **Charts**: Interactive visualizations (bar and pie charts)
3. **Data Table**: Sortable, formatted demographic data
4. **AI Analysis**: Full strategic insights from Claude AI

## Tech Stack

- ⚛️ **React 18**: Modern React with hooks
- ⚡ **Vite**: Fast build tool and dev server
- 🎨 **Tailwind CSS**: Utility-first CSS framework
- 📊 **Chart.js**: Interactive charts and graphs
- 🔌 **Axios**: HTTP client for API calls
- 🎯 **Lucide React**: Beautiful icons

## Environment Variables

Create `.env.production` file:

```env
VITE_API_BASE_URL=https://your-api-domain.railway.app
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Vercel Deployment

1. Push code to GitHub repository
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Build

```bash
# Build for production
npm run build

# Serve built files
npm run preview
```

## API Integration

The frontend communicates with the backend API:

- Health checks and status monitoring
- Real-time data fetching with loading states
- Error handling and retry mechanisms
- Cache status indicators

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile browsers supported
- Progressive Web App features

## License

MIT License - see LICENSE file for details.