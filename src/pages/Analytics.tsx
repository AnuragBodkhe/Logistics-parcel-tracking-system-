import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package, Truck, Users, Calendar, Download, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = () => {
      try {
        // Generate sample analytics data
        const deliveryData = [
          { name: 'Mon', delivered: 12, failed: 2, pending: 5 },
          { name: 'Tue', delivered: 15, failed: 1, pending: 8 },
          { name: 'Wed', delivered: 18, failed: 3, pending: 6 },
          { name: 'Thu', delivered: 22, failed: 2, pending: 4 },
          { name: 'Fri', delivered: 25, failed: 4, pending: 7 },
          { name: 'Sat', delivered: 20, failed: 1, pending: 3 },
          { name: 'Sun', delivered: 16, failed: 2, pending: 5 }
        ];

        const statusData = [
          { name: 'Delivered', value: 145, color: '#10b981' },
          { name: 'In Transit', value: 38, color: '#3b82f6' },
          { name: 'Pending', value: 25, color: '#f59e0b' },
          { name: 'Failed', value: 12, color: '#ef4444' }
        ];

        const revenueData = [
          { month: 'Jan', revenue: 45000, orders: 320 },
          { month: 'Feb', revenue: 52000, orders: 380 },
          { month: 'Mar', revenue: 48000, orders: 350 },
          { month: 'Apr', revenue: 61000, orders: 420 },
          { month: 'May', revenue: 55000, orders: 390 },
          { month: 'Jun', revenue: 67000, orders: 460 }
        ];

        const performanceData = [
          { agent: 'Mike Johnson', deliveries: 145, rating: 4.8, efficiency: 92 },
          { agent: 'Sarah Williams', deliveries: 132, rating: 4.9, efficiency: 88 },
          { agent: 'Tom Davis', deliveries: 118, rating: 4.6, efficiency: 85 },
          { agent: 'Emma Wilson', deliveries: 125, rating: 4.7, efficiency: 90 },
          { agent: 'John Brown', deliveries: 98, rating: 4.5, efficiency: 82 }
        ];

        setAnalyticsData({
          deliveryData,
          statusData,
          revenueData,
          performanceData,
          stats: {
            totalRevenue: 328000,
            totalOrders: 2320,
            averageOrderValue: 141.38,
            deliveryRate: 78.5,
            customerSatisfaction: 4.7
          }
        });
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Track performance and business insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-xs text-emerald-600 font-medium">+12.5%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${analyticsData.stats.totalRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-blue-600 font-medium">+8.2%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analyticsData.stats.totalOrders.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-purple-600 font-medium">+3.1%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            ${analyticsData.stats.averageOrderValue}
          </div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Truck className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-green-600 font-medium">+2.4%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analyticsData.stats.deliveryRate}%
          </div>
          <div className="text-sm text-gray-600">Delivery Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="bg-pink-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-pink-600" />
            </div>
            <span className="text-xs text-pink-600 font-medium">+0.3</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analyticsData.stats.customerSatisfaction}
          </div>
          <div className="text-sm text-gray-600">Satisfaction</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Delivery Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.deliveryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="delivered" fill="#10b981" />
              <Bar dataKey="pending" fill="#f59e0b" />
              <Bar dataKey="failed" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.statusData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agents</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-sm font-medium text-gray-700">Agent</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Deliveries</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Rating</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.performanceData.map((agent: any, index: number) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 text-sm text-gray-900">{agent.agent}</td>
                    <td className="py-3 text-sm text-center text-gray-900">{agent.deliveries}</td>
                    <td className="py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span>{agent.rating}</span>
                        <span className="text-yellow-500">★</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: `${agent.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-600">{agent.efficiency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
