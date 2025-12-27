import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, CheckCircle, Clock, AlertTriangle, Package, Users } from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [kpis, setKPIs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30');

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, kpisRes] = await Promise.all([
        api.get('/dashboard/analytics'),
        api.get('/dashboard/kpis')
      ]);
      setAnalytics(analyticsRes.data);
      setKPIs(kpisRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics || !kpis) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  const COLORS = {
    pending: '#9CA3AF',
    assigned: '#3B82F6',
    'in-progress': '#8B5CF6',
    'on-hold': '#F59E0B',
    completed: '#10B981',
    cancelled: '#EF4444'
  };

  const PRIORITY_COLORS = {
    low: '#10B981',
    medium: '#F59E0B',
    high: '#F97316',
    critical: '#EF4444'
  };

  // Prepare status distribution data for pie chart
  const statusData = Object.entries(analytics.stats.statusDistribution).map(([name, value]) => ({
    name: name.replace('-', ' '),
    value,
    color: COLORS[name]
  }));

  // Prepare priority distribution data
  const priorityData = Object.entries(analytics.stats.priorityDistribution).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: PRIORITY_COLORS[name]
  }));

  // KPI Cards
  const kpiCards = [
    {
      title: 'Total Requests',
      value: kpis.totalRequests,
      icon: Activity,
      color: 'bg-blue-500',
      change: null
    },
    {
      title: 'Active Requests',
      value: kpis.activeRequests,
      icon: Clock,
      color: 'bg-purple-500',
      change: null
    },
    {
      title: 'Completed This Month',
      value: kpis.completedThisMonth,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: analytics.trends.weeklyTrend
    },
    {
      title: 'Critical Open',
      value: kpis.criticalOpen,
      icon: AlertTriangle,
      color: 'bg-red-500',
      change: null
    },
    {
      title: 'Overdue',
      value: kpis.overdueRequests,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: null
    },
    {
      title: 'Completion Rate',
      value: `${kpis.completionRate}%`,
      icon: CheckCircle,
      color: 'bg-teal-500',
      change: null
    },
    {
      title: 'Avg Response Time',
      value: `${kpis.avgResponseTime}h`,
      icon: Clock,
      color: 'bg-indigo-500',
      change: null
    },
    {
      title: 'Avg Resolution',
      value: `${analytics.stats.avgResolutionTime}h`,
      icon: Activity,
      color: 'bg-pink-500',
      change: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500 mt-1">Comprehensive maintenance metrics and insights</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                {kpi.change !== null && (
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    kpi.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{Math.abs(kpi.change)}% vs last week</span>
                  </div>
                )}
              </div>
              <div className={`p-3 ${kpi.color} rounded-lg`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.trends.monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#3B82F6" name="Created" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="#10B981" name="Completed" strokeWidth={2} />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Pending" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Requests">
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Request Type Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Request Types</h2>
          <div className="space-y-4">
            {Object.entries(analytics.stats.typeDistribution).map(([type, count]) => {
              const percentage = (count / analytics.stats.total * 100).toFixed(1);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      {analytics.teamPerformance.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Team Performance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Team</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Total</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Completed</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Active</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Completion Rate</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Avg Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analytics.teamPerformance.map((team) => (
                  <tr key={team.teamId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{team.teamName}</td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">{team.totalRequests}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                        {team.completed}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {team.active}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-medium">{team.completionRate}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${team.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center text-gray-700">
                      {team.avgCompletionTime}h
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Health */}
      {analytics.assetHealth.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Asset Health</h2>
            <span className="text-sm text-gray-500">(Top 20 assets needing attention)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.assetHealth.slice(0, 12).map((asset) => (
              <div key={asset.assetId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{asset.assetName}</p>
                    <p className="text-xs text-gray-500">{asset.assetTag}</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    asset.healthScore >= 80 ? 'bg-green-100 text-green-800' :
                    asset.healthScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    asset.healthScore >= 40 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {asset.healthScore}
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Total requests:</span>
                    <span className="font-medium">{asset.totalRequests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recent (30d):</span>
                    <span className="font-medium">{asset.recentRequests}</span>
                  </div>
                  {asset.criticalIssues > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Critical:</span>
                      <span className="font-medium">{asset.criticalIssues}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
