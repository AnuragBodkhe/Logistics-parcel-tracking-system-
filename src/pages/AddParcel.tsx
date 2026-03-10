import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  Weight, 
  Truck, 
  Calendar, 
  Save, 
  ArrowLeft,
  Info,
  ShieldCheck,
  Phone,
  Car
} from 'lucide-react';
import { storageService } from '../services/storage';
import { Parcel, ParcelStatus, DeliveryType } from '../types';
import { motion } from 'motion/react';

const STATUS_OPTIONS: ParcelStatus[] = [
  'Order Placed', 'Packed', 'Dispatched', 'In Transit', 
  'Arrived at Hub', 'Out for Delivery', 'Delivered', 
  'Failed Delivery', 'Returned'
];

const LOCATION_OPTIONS = [
  'Warehouse (Main)',
  'Sorting Center (North)',
  'Sorting Center (South)',
  'Regional Hub (East)',
  'Regional Hub (West)',
  'Local Distribution Center',
  'In Transit',
  'Destination Hub'
];

export default function AddParcel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Partial<Parcel>>({
    id: '',
    senderName: '',
    senderAddress: '',
    receiverName: '',
    receiverAddress: '',
    weight: '',
    deliveryType: 'Standard',
    currentStatus: 'Order Placed',
    currentLocation: 'Warehouse (Main)',
    createdDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    history: []
  });

  useEffect(() => {
    if (isEdit) {
      const existing = storageService.getParcelById(id);
      if (existing) {
        setFormData(existing);
      } else {
        navigate('/admin/list');
      }
    } else {
      setFormData(prev => ({ ...prev, id: storageService.generateTrackingId() }));
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parcelData = {
      ...formData,
      history: isEdit ? formData.history : [{
        status: formData.currentStatus as ParcelStatus,
        location: formData.currentLocation || 'Warehouse',
        timestamp: new Date().toISOString(),
        note: 'Initial booking'
      }]
    } as Parcel;

    if (isEdit) {
      // If status changed, add to history
      const existing = storageService.getParcelById(id);
      if (existing && existing.currentStatus !== formData.currentStatus) {
        parcelData.history = [
          ...existing.history,
          {
            status: formData.currentStatus as ParcelStatus,
            location: formData.currentLocation || 'Updated Location',
            timestamp: new Date().toISOString(),
            note: 'Status updated by admin'
          }
        ];
      }
      storageService.updateParcel(parcelData);
    } else {
      storageService.addParcel(parcelData);
    }
    
    navigate('/admin/list');
  };

  const handleAgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      assignedAgent: {
        name: prev.assignedAgent?.name || '',
        contact: prev.assignedAgent?.contact || '',
        vehicle: prev.assignedAgent?.vehicle || '',
        [name]: value
      }
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{isEdit ? 'Edit Parcel' : 'Add New Parcel'}</h2>
          <p className="text-slate-500">{isEdit ? `Updating tracking ID: ${id}` : 'Create a new shipment record'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sender & Receiver */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <User className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-slate-900">Sender Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Sender Name</label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Sender Address</label>
                <input
                  type="text"
                  name="senderAddress"
                  value={formData.senderAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 pb-4 border-b border-slate-50">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900">Receiver Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Receiver Name</label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Receiver Address</label>
                <input
                  type="text"
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <Package className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-slate-900">Parcel Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Weight (kg)</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="e.g. 2.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Delivery Type</label>
                <select
                  name="deliveryType"
                  value={formData.deliveryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Standard">Standard</option>
                  <option value="Express">Express</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Expected Delivery</label>
                <input
                  type="date"
                  name="expectedDelivery"
                  value={formData.expectedDelivery}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900">Delivery Agent Assignment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Agent Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.assignedAgent?.name || ''}
                  onChange={handleAgentChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="contact"
                    value={formData.assignedAgent?.contact || ''}
                    onChange={handleAgentChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Vehicle Number</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="vehicle"
                    value={formData.assignedAgent?.vehicle || ''}
                    onChange={handleAgentChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="ABC-1234"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <Truck className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900">Status Update</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Current Status</label>
                <select
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Current Location</label>
                <select
                  name="currentLocation"
                  value={formData.currentLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {LOCATION_OPTIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
                <Info className="w-5 h-5 text-blue-500 shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Updating the status will automatically add a record to the parcel's tracking history for the customer to see.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isEdit ? 'Update Shipment' : 'Create Shipment'}
            </button>
          </motion.div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-4">
            <h4 className="font-bold text-emerald-400">Tracking ID</h4>
            <div className="text-2xl font-mono tracking-wider break-all">{formData.id}</div>
            <p className="text-xs text-slate-400">This ID is automatically generated and will be used by the customer to track their parcel.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
