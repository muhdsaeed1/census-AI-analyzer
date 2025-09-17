import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { RefreshCw, Download, BarChart3, PieChart, FileText, AlertCircle, CheckCircle, QrCode } from 'lucide-react';
import QRCodeGenerator from './components/QRCodeGenerator';
import './App.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('summary');
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    checkServerHealth();
    fetchData();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE}/health`);
      setServerStatus(response.data);
    } catch (error) {
      setServerStatus({ status: 'unhealthy', error: error.message });
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [summaryRes, formattedRes, analysisRes] = await Promise.all([
        axios.get(`${API_BASE}/api/census/summary`),
        axios.get(`${API_BASE}/api/census/formatted`),
        axios.get(`${API_BASE}/api/census/analysis`)
      ]);

      setData({
        summary: summaryRes.data.summary,
        formatted: formattedRes.data.data,
        analysis: analysisRes.data.analysis,
        cached: formattedRes.data.cached
      });
    } catch (error) {
      setError(error.message);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      await axios.post(`${API_BASE}/api/cache/clear`);
      await fetchData();
    } catch (error) {
      setError('Failed to clear cache: ' + error.message);
    }
  };

  const exportData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/census/raw`);
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `census-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export data: ' + error.message);
    }
  };

  // Chart data for top states
  const getTopStatesChartData = () => {
    if (!data?.summary?.topStates) return null;
    
    return {
      labels: data.summary.topStates.map(state => state.name),
      datasets: [
        {
          label: 'Hispanic Population',
          data: data.summary.topStates.map(state => state.hispanicPop),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart data for Hispanic percentage pie
  const getHispanicPercentageData = () => {
    if (!data?.summary) return null;
    
    return {
      labels: ['Hispanic', 'Non-Hispanic'],
      datasets: [
        {
          data: [
            data.summary.hispanicPercentage,
            100 - data.summary.hispanicPercentage
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(229, 231, 235, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(229, 231, 235, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hispanic Population by State',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat().format(value);
          }
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'US Population Composition',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg">Loading Census data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center space-x-2 text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Error Loading Data</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">census-AI-analyzer</h1>
              {serverStatus && (
                <div className="flex items-center space-x-1">
                  {serverStatus.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${serverStatus.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                    API {serverStatus.status}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {data?.cached && (
                <span className="text-sm text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                  Cached Data
                </span>
              )}
              
              <button
                onClick={clearCache}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Data</span>
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { key: 'summary', label: 'Summary', icon: BarChart3 },
              { key: 'charts', label: 'Charts', icon: PieChart },
              { key: 'data', label: 'Data Table', icon: FileText },
              { key: 'analysis', label: 'AI Analysis', icon: FileText },
              { key: 'qr', label: 'QR Generator', icon: QrCode },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 ${
                  activeView === key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeView === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">H</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Hispanic Population
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {new Intl.NumberFormat().format(data?.summary?.totalHispanicPopulation || 0)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 font-semibold">%</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Hispanic Percentage
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data?.summary?.hispanicPercentage?.toFixed(2) || 0}%
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                        <span className="text-yellow-600 font-semibold">S</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Spanish Speakers
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data?.summary?.spanishSpeakersPercentage?.toFixed(2) || 0}%
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">ST</span>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          States Analyzed
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {data?.summary?.statesIncluded || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top 5 States by Hispanic Population</h3>
                <div className="space-y-3">
                  {data?.summary?.topStates?.map((state, index) => (
                    <div key={state.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${
                          ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'][index]
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">{state.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-900">
                          {new Intl.NumberFormat().format(state.hispanicPop)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {state.hispanicPercent?.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'charts' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top States by Hispanic Population</h3>
                <div className="h-96">
                  {getTopStatesChartData() && (
                    <Bar data={getTopStatesChartData()} options={chartOptions} />
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">US Population Composition</h3>
                <div className="h-96">
                  {getHispanicPercentageData() && (
                    <Pie data={getHispanicPercentageData()} options={pieOptions} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'data' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Detailed Census Data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Hispanic demographic data by state with key statistics
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      State
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hispanic Pop.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hispanic %
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Pop.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Median Income
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.formatted?.slice(0, 10).map((row, index) => (
                    <tr key={row.NAME} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {row.NAME}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.Hispanic_Pop}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row['Hispanic_%']}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.Total_Pop}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.Median_Income}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'analysis' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">AI Analysis</h3>
              <p className="mt-1 text-sm text-gray-500">
                Strategic insights generated by Claude AI
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {data?.analysis || 'Loading analysis...'}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeView === 'qr' && (
          <QRCodeGenerator />
        )}
      </main>
    </div>
  );
}

export default App;
