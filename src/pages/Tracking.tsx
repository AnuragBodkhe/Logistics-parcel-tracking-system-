import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck
} from 'lucide-react';
import { storageService } from '../services/storage';
import { Parcel, ParcelStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [error, setError] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recent_tracking_ids');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const saveRecentSearch = (id: string) => {
    const updated = [id, ...recentSearches.filter(item => item !== id)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem('recent_tracking_ids', JSON.stringify(updated));
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      handleTrack(id);
    }
  }, [searchParams]);

  const handleTrack = (id: string) => {
    const found = storageService.getParcelById(id);
    if (found) {
      setParcel(found);
      setError(false);
      saveRecentSearch(id);
    } else {
      setParcel(null);
      setError(true);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      setSearchParams({ id: trackingId.trim() });
      handleTrack(trackingId.trim());
    }
  };

  const statusSteps = [
    'Order Placed',
    'Packed',
    'Dispatched',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStatusIndex = statusSteps.indexOf(parcel?.currentStatus || '');

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      {/* Search Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Track Your <span className="text-emerald-500">Parcel</span>
          </h1>
          <p className="text-slate-500 mt-4 text-lg">Enter your tracking ID to see real-time updates on your shipment.</p>
        </motion.div>

        <form onSubmit={onSubmit} className="relative max-w-2xl mx-auto group">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl group-focus-within:bg-emerald-500/30 transition-all rounded-full" />
          <div className="relative flex bg-white p-2 rounded-3xl shadow-2xl border border-slate-100">
            <div className="flex-1 flex items-center px-4">
              <Search className="w-6 h-6 text-slate-300 mr-3" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID (e.g. TRK...)"
                className="w-full py-4 text-lg font-bold text-slate-900 outline-none placeholder:text-slate-300"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              Track
            </button>
          </div>
        </form>

        {recentSearches.length > 0 && !parcel && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 text-xs"
          >
            <span className="text-slate-400 font-bold uppercase tracking-widest">Recent:</span>
            {recentSearches.map(id => (
              <button
                key={id}
                onClick={() => {
                  setTrackingId(id);
                  setSearchParams({ id });
                }}
                className="bg-white px-3 py-1 rounded-full border border-slate-200 text-slate-600 font-mono hover:border-emerald-500 hover:text-emerald-600 transition-all"
              >
                {id}
              </button>
            ))}
          </motion.div>
        )}

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 font-bold bg-red-50 inline-block px-4 py-2 rounded-xl border border-red-100"
          >
            Tracking ID not found. Please check and try again.
          </motion.p>
        )}
      </div>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {parcel && (
          <motion.div
            key={parcel.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Status Card */}
            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="bg-slate-900 p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Tracking ID</div>
                  <div className="text-3xl font-mono font-bold">{parcel.id}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Expected Delivery</div>
                    <div className="text-xl font-bold">{format(new Date(parcel.expectedDelivery), 'MMM dd, yyyy')}</div>
                  </div>
                  <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-10">
                {/* Progress Bar */}
                <div className="relative pt-10 pb-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full" />
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{ width: `${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}%` }}
                  />
                  <div className="relative flex justify-between">
                    {statusSteps.map((step, i) => {
                      const isCompleted = i <= currentStatusIndex;
                      const isCurrent = i === currentStatusIndex;
                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30' : 'bg-white border-2 border-slate-100 text-slate-300'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                          </div>
                          <span className={`absolute -top-8 text-[10px] font-black uppercase tracking-wider text-center w-20 ${
                            isCurrent ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-2xl">
                        <MapPin className="w-6 h-6 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Location</div>
                        <div className="text-xl font-bold text-slate-900">{parcel.currentLocation}</div>
                        <div className="text-sm text-slate-500 mt-1">Last updated: {format(new Date(), 'hh:mm a')}</div>
                      </div>
                    </div>

                    {parcel.assignedAgent && (
                      <div className="flex items-start gap-4 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm">
                          <ShieldCheck className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Assigned Agent</div>
                          <div className="text-sm font-bold text-slate-900">{parcel.assignedAgent.name}</div>
                          <div className="text-xs text-slate-500">Vehicle: {parcel.assignedAgent.vehicle}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-50 p-3 rounded-2xl">
                        <Package className="w-6 h-6 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Shipment Details</div>
                        <div className="text-xl font-bold text-slate-900">{parcel.deliveryType} Delivery</div>
                        <div className="text-sm text-slate-500 mt-1">Weight: {parcel.weight}kg • From: {parcel.senderAddress}</div>
                      </div>
                    </div>

                    {parcel.currentStatus !== 'Delivered' && isAfter(new Date(parcel.expectedDelivery), new Date()) && (
                      <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <div className="bg-white p-2 rounded-xl shadow-sm">
                          <Clock className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1">Estimated Arrival</div>
                          <div className="text-sm font-bold text-slate-900">
                            In {formatDistanceToNow(new Date(parcel.expectedDelivery))}
                          </div>
                          <div className="text-xs text-slate-500">Scheduled for {format(new Date(parcel.expectedDelivery), 'EEEE')}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Simulated Map Visualization */}
                <div className="mt-10 h-48 bg-slate-50 rounded-3xl border border-slate-100 relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="relative w-full h-1 bg-slate-200 rounded-full">
                      {/* Route Line */}
                      <div 
                        className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}%` }}
                      />
                      
                      {/* Origin */}
                      <div className="absolute -left-2 -top-2 w-5 h-5 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="absolute -bottom-6 text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{parcel.senderAddress.split(',')[0]}</span>
                      </div>

                      {/* Destination */}
                      <div className="absolute -right-2 -top-2 w-5 h-5 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                        <span className="absolute -bottom-6 text-[10px] font-bold text-slate-400 uppercase whitespace-nowrap">{parcel.receiverAddress.split(',')[0]}</span>
                      </div>

                      {/* Current Position */}
                      <motion.div 
                        className="absolute -top-6 w-12 h-12 flex flex-col items-center"
                        style={{ left: `calc(${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}% - 24px)` }}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                          <Truck className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-0.5 h-2 bg-emerald-500" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Route Visualization
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <button 
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-slate-900">Tracking History</h3>
                </div>
                {isHistoryOpen ? <ChevronUp /> : <ChevronDown />}
              </button>
              
              <AnimatePresence>
                {isHistoryOpen && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-8 pt-0 space-y-8 relative">
                      <div className="absolute left-[2.25rem] top-0 bottom-8 w-0.5 bg-slate-100" />
                      {parcel.history.slice().reverse().map((update, i) => (
                        <div key={i} className="relative flex gap-6">
                          <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            i === 0 ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-2 border-slate-100 text-slate-300'
                          }`}>
                            {i === 0 ? <Truck className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                              <div className="font-bold text-slate-900 text-lg">{update.status}</div>
                              <div className="text-xs font-bold text-slate-400">{format(new Date(update.timestamp), 'MMM dd, yyyy • hh:mm a')}</div>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                              <MapPin className="w-4 h-4" />
                              {update.location}
                            </div>
                            {update.note && (
                              <p className="mt-2 text-sm text-slate-400 italic">"{update.note}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Support Footer */}
            <div className="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm">
                  <Info className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Need help with your shipment?</h4>
                  <p className="text-emerald-700 text-sm">Our support team is available 24/7 for any inquiries.</p>
                </div>
              </div>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all whitespace-nowrap">
                Contact Support
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!parcel && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {[
            { title: 'Real-time Tracking', desc: 'Get instant updates on your parcel location.', icon: MapPin, color: 'text-blue-500' },
            { title: 'Secure Handling', desc: 'Your shipments are handled with maximum care.', icon: ShieldCheck, color: 'text-emerald-500' },
            { title: 'Global Network', desc: 'We deliver to over 200 countries worldwide.', icon: Truck, color: 'text-amber-500' },
          ].map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={feature.title}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
            >
              <feature.icon className={`w-10 h-10 ${feature.color} mb-4`} />
              <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
