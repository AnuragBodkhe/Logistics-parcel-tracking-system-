import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { storageService } from '../services/storage';
import { motion } from 'motion/react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6366f1'];

export default function Dashboard() {
  const parcels = storageService.getParcels();

  const stats = useMemo(() => {
    const total = parcels.length;
    const delivered = parcels.filter(p => p.currentStatus === 'Delivered').length;
    const inTransit = parcels.filter(p => ['In Transit', 'Arrived at Hub', 'Out for Delivery'].includes(p.currentStatus)).length;
    const pending = parcels.filter(p => ['Order Placed', 'Packed', 'Dispatched'].includes(p.currentStatus)).length;
    const failed = parcels.filter(p => ['Failed Delivery', 'Returned'].includes(p.currentStatus)).length;
    const successRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

    return { total, delivered, inTransit, pending, failed, successRate };
  }, [parcels]);

  const chartData = [
    { name: 'Delivered', value: stats.delivered, color: '#10b981' },
    { name: 'In Transit', value: stats.inTransit, color: '#3b82f6' },
    { name: 'Pending', value: stats.pending, color: '#f59e0b' },
    { name: 'Failed', value: stats.failed, color: '#ef4444' },
  ];

  const recentParcels = parcels
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900">Admin Dashboard</h2>
        <p className="text-slate-500">Overview of logistics operations and parcel status</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Shipments', value: stats.total, icon: Package, color: 'bg-slate-100 text-slate-600' },
          { label: 'Delivered', value: stats.delivered, icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
          { label: 'In Transit', value: stats.inTransit, icon: Truck, color: 'bg-blue-100 text-blue-600' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: TrendingUp, color: 'bg-indigo-100 text-indigo-600' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-2xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-slate-300" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentParcels.length > 0 ? (
              recentParcels.map((parcel) => (
                <div key={parcel.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{parcel.id}</div>
                      <div className="text-xs text-slate-500">{parcel.receiverName} • {parcel.currentLocation}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    parcel.currentStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                    parcel.currentStatus === 'Failed Delivery' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {parcel.currentStatus}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 italic">No parcels found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
