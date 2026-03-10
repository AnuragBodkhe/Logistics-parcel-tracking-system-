import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Package,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye
} from 'lucide-react';
import { storageService } from '../services/storage';
import { Parcel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function ParcelList() {
  const [parcels, setParcels] = useState<Parcel[]>(storageService.getParcels());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredParcels = useMemo(() => {
    return parcels.filter(p => {
      const matchesSearch = 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || p.currentStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [parcels, searchTerm, statusFilter]);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      storageService.deleteParcel(id);
      setParcels(storageService.getParcels());
    }
  };

  const statuses = ['All', 'Order Placed', 'In Transit', 'Out for Delivery', 'Delivered', 'Failed Delivery'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Shipment Records</h2>
          <p className="text-slate-500">Manage and monitor all active and past shipments</p>
        </div>
        <Link 
          to="/admin/add"
          className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 text-center"
        >
          New Parcel
        </Link>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, Sender or Receiver..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-slate-400 shrink-0" />
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Parcel ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sender / Receiver</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredParcels.map((parcel) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={parcel.id} 
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link to={`/admin/parcel/${parcel.id}`} className="flex items-center gap-3 group/id">
                        <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-mono text-sm font-bold text-slate-900 group-hover/id:text-emerald-600 transition-colors">{parcel.id}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-slate-900">{parcel.senderName}</div>
                        <div className="text-xs text-slate-400">to {parcel.receiverName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        parcel.currentStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                        parcel.currentStatus === 'Failed Delivery' ? 'bg-red-100 text-red-700' :
                        parcel.currentStatus === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {parcel.currentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{parcel.currentLocation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/admin/parcel/${parcel.id}`}
                          className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/edit/${parcel.id}`}
                          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(parcel.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredParcels.length === 0 && (
          <div className="p-20 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No parcels found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
