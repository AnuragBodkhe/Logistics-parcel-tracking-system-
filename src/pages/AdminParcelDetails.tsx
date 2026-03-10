import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  User, 
  MapPin, 
  Truck, 
  Calendar, 
  Clock, 
  Edit3,
  History,
  Info,
  Weight,
  Share2,
  Copy,
  Check,
  Phone,
  Car,
  ShieldCheck
} from 'lucide-react';
import { storageService } from '../services/storage';
import { Parcel, ParcelStatus } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow } from 'date-fns';
import { AdminParcelDetailsSkeleton } from '../components/Skeleton';

const getStatusStyles = (status: ParcelStatus) => {
  switch (status) {
    case 'Order Placed':
      return { bg: 'bg-slate-100', text: 'text-slate-700', icon: <Package className="w-4 h-4" />, border: 'border-slate-200' };
    case 'Packed':
      return { bg: 'bg-amber-100', text: 'text-amber-700', icon: <Package className="w-4 h-4" />, border: 'border-amber-200' };
    case 'Dispatched':
      return { bg: 'bg-blue-100', text: 'text-blue-700', icon: <Truck className="w-4 h-4" />, border: 'border-blue-200' };
    case 'In Transit':
      return { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: <Truck className="w-4 h-4" />, border: 'border-indigo-200' };
    case 'Arrived at Hub':
      return { bg: 'bg-violet-100', text: 'text-violet-700', icon: <MapPin className="w-4 h-4" />, border: 'border-violet-200' };
    case 'Out for Delivery':
      return { bg: 'bg-cyan-100', text: 'text-cyan-700', icon: <Truck className="w-4 h-4" />, border: 'border-cyan-200', animate: true };
    case 'Delivered':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: <Check className="w-4 h-4" />, border: 'border-emerald-200' };
    case 'Failed Delivery':
      return { bg: 'bg-red-100', text: 'text-red-700', icon: <Info className="w-4 h-4" />, border: 'border-red-200' };
    case 'Returned':
      return { bg: 'bg-rose-100', text: 'text-rose-700', icon: <ArrowLeft className="w-4 h-4" />, border: 'border-rose-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', icon: <Package className="w-4 h-4" />, border: 'border-slate-200' };
  }
};

export default function AdminParcelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parcel, setParcel] = useState<Parcel | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const statusSteps = [
    'Order Placed',
    'Packed',
    'Dispatched',
    'In Transit',
    'Arrived at Hub',
    'Out for Delivery',
    'Delivered'
  ];

  const currentStatusIndex = statusSteps.indexOf(parcel?.currentStatus || '');

  const handleShare = () => {
    const url = `${window.location.origin}/?id=${parcel?.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const fetchParcel = async () => {
      if (id) {
        setLoading(true);
        const found = await storageService.getParcelByIdAsync(id);
        if (found) {
          setParcel(found);
        } else {
          navigate('/admin/list');
        }
        setLoading(false);
      }
    };
    fetchParcel();
  }, [id, navigate]);

  if (loading) return <AdminParcelDetailsSkeleton />;
  if (!parcel) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/list')}
            className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-slate-900">Shipment Details</h2>
              {(() => {
                const styles = getStatusStyles(parcel.currentStatus);
                return (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {styles.icon}
                    {parcel.currentStatus}
                  </div>
                );
              })()}
            </div>
            <p className="text-slate-500">Full record for Tracking ID: <span className="font-mono font-bold text-slate-700">{parcel.id}</span></p>
          </div>
        </div>
        <Link 
          to={`/admin/edit/${parcel.id}`}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Edit3 className="w-4 h-4" />
          Edit Shipment
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sender & Receiver Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900">Sender</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</div>
                  <div className="text-lg font-bold text-slate-900">{parcel.senderName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</div>
                  <div className="text-slate-600">{parcel.senderAddress}</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
                <div className="bg-blue-100 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-slate-900">Receiver</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</div>
                  <div className="text-lg font-bold text-slate-900">{parcel.receiverName}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</div>
                  <div className="text-slate-600">{parcel.receiverAddress}</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Shipment History */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
              <div className="bg-slate-100 p-2 rounded-xl">
                <History className="w-5 h-5 text-slate-600" />
              </div>
              <h3 className="font-bold text-slate-900">Tracking History</h3>
            </div>

            <div className="space-y-8 relative">
              <div className="absolute left-[1.25rem] top-0 bottom-8 w-0.5 bg-slate-100" />
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
                      <div className="text-xs font-bold text-slate-400">
                        {format(new Date(update.timestamp), 'MMM dd, yyyy • hh:mm a')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      {update.location}
                    </div>
                    {update.note && (
                      <p className="mt-2 text-sm text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                        "{update.note}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Live Map Visualization */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
          >
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-bold text-slate-900">Live Route Tracker</h3>
              </div>
              <div className="bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Live Simulation
              </div>
            </div>

            <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              </div>

              {/* Route Visualization */}
              <div className="absolute inset-0 flex items-center justify-center p-16">
                <div className="relative w-full h-1.5 bg-slate-200 rounded-full">
                  {/* Progress Line */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                    style={{ width: `${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}%` }}
                  />

                  {/* Origin Point */}
                  <div className="absolute -left-3 -top-3 w-7 h-7 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <div className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                      {parcel.senderAddress.split(',')[0]}
                    </div>
                  </div>

                  {/* Destination Point */}
                  <div className="absolute -right-3 -top-3 w-7 h-7 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center shadow-sm">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                    <div className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                      {parcel.receiverAddress.split(',')[0]}
                    </div>
                  </div>

                  {/* Current Position (Truck) */}
                  <motion.div 
                    className="absolute -top-10 w-16 h-16 flex flex-col items-center"
                    style={{ left: `calc(${(Math.max(0, currentStatusIndex) / (statusSteps.length - 1)) * 100}% - 32px)` }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-xl shadow-emerald-500/40 border-2 border-white">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-0.5 h-3 bg-emerald-500" />
                    <div className="mt-1 bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">
                      <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter whitespace-nowrap">
                        {parcel.currentLocation}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Map Controls (Visual Only) */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 font-bold text-lg cursor-default">+</div>
                <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 font-bold text-lg cursor-default">-</div>
              </div>
            </div>
            
            <p className="mt-6 text-xs text-slate-400 leading-relaxed italic">
              * This is a simulated real-time route based on the current status and hub location. 
              GPS coordinates are approximated for security.
            </p>
          </motion.div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="bg-amber-100 p-2 rounded-xl">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-slate-900">Parcel Info</h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Weight className="w-4 h-4" />
                  Weight
                </div>
                <div className="font-bold text-slate-900">{parcel.weight} kg</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Truck className="w-4 h-4" />
                  Type
                </div>
                <div className="font-bold text-slate-900">{parcel.deliveryType}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar className="w-4 h-4" />
                  Created
                </div>
                <div className="font-bold text-slate-900">{format(new Date(parcel.createdDate), 'MMM dd, yyyy')}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock className="w-4 h-4" />
                  Expected
                </div>
                <div className="font-bold text-emerald-600">{format(new Date(parcel.expectedDelivery), 'MMM dd, yyyy')}</div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-50">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Status</div>
              {(() => {
                const styles = getStatusStyles(parcel.currentStatus);
                return (
                  <div className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold uppercase tracking-wider border shadow-sm ${styles.bg} ${styles.text} ${styles.border}`}>
                    {styles.animate && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                      </span>
                    )}
                    {styles.icon}
                    {parcel.currentStatus}
                  </div>
                );
              })()}
              {parcel.history.length > 0 && (
                <div className="mt-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  In this status for {formatDistanceToNow(new Date(parcel.history[parcel.history.length - 1].timestamp))}
                </div>
              )}
            </div>

            <button
              onClick={handleShare}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5" />
                  Share Tracking Link
                </>
              )}
            </button>
          </motion.div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Info className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Admin Note</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              This shipment is currently being handled by the {parcel.currentLocation} hub. 
              Any status changes made here will be visible to the customer on the public tracking page.
            </p>
          </div>

          {/* Delivery Agent Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="bg-indigo-100 p-2 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900">Delivery Agent</h3>
            </div>

            {parcel.assignedAgent ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg">
                    {parcel.assignedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{parcel.assignedAgent.name}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Assigned Personnel</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Phone className="w-4 h-4" />
                      Contact
                    </div>
                    <div className="font-bold text-slate-900">{parcel.assignedAgent.contact}</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-500 text-sm">
                      <Car className="w-4 h-4" />
                      Vehicle
                    </div>
                    <div className="font-bold text-slate-900">{parcel.assignedAgent.vehicle}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                  <User className="w-8 h-8 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900">No Agent Assigned</p>
                  <p className="text-sm text-slate-500">Assign a delivery agent to provide customers with real-time delivery info.</p>
                </div>
                <Link 
                  to={`/admin/edit/${parcel.id}`}
                  className="inline-flex items-center justify-center w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                >
                  Assign Agent
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
