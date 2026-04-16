import React, { useState, useEffect } from 'react';
import { Truck, UserPlus, Search, Edit2, Trash2, Mail, Phone, MapPin, Package, Star, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { DeliveryAgent } from '../types';

const DeliveryAgentManagement: React.FC = () => {
  const [agents, setAgents] = useState<DeliveryAgent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<DeliveryAgent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAgents = () => {
      try {
        const storedAgents = localStorage.getItem('logitrack_agents');
        const mockInitialized = localStorage.getItem('logitrack_agents_mock_initialized');
        
        if (!storedAgents && !mockInitialized) {
          // Import mock agents data
          import('../services/mockData').then(({ mockAgents }) => {
            setAgents(mockAgents);
            localStorage.setItem('logitrack_agents', JSON.stringify(mockAgents));
            localStorage.setItem('logitrack_agents_mock_initialized', 'true');
            setLoading(false);
          });
        } else if (storedAgents) {
          setAgents(JSON.parse(storedAgents));
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading agents:', error);
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.phone.includes(searchTerm) ||
    agent.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAgent = (agentData: Omit<DeliveryAgent, 'id' | 'totalDeliveries' | 'activeDeliveries' | 'rating'>) => {
    const newAgent: DeliveryAgent = {
      ...agentData,
      id: Date.now().toString(),
      totalDeliveries: 0,
      activeDeliveries: 0,
      rating: 5.0
    };

    const updatedAgents = [...agents, newAgent];
    setAgents(updatedAgents);
    localStorage.setItem('logitrack_agents', JSON.stringify(updatedAgents));
    setShowAddModal(false);
  };

  const handleUpdateAgent = (agentData: Omit<DeliveryAgent, 'id' | 'totalDeliveries' | 'activeDeliveries' | 'rating'>) => {
    if (!editingAgent) return;

    const updatedAgent: DeliveryAgent = {
      ...editingAgent,
      ...agentData
    };

    const updatedAgents = agents.map(agent => 
      agent.id === editingAgent.id ? updatedAgent : agent
    );

    setAgents(updatedAgents);
    localStorage.setItem('logitrack_agents', JSON.stringify(updatedAgents));
    setEditingAgent(null);
  };

  const handleDeleteAgent = (agentId: string) => {
    if (window.confirm('Are you sure you want to delete this delivery agent?')) {
      const updatedAgents = agents.filter(agent => agent.id !== agentId);
      setAgents(updatedAgents);
      localStorage.setItem('logitrack_agents', JSON.stringify(updatedAgents));
    }
  };

  const getStatusIcon = (status: DeliveryAgent['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'on_leave':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: DeliveryAgent['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Delivery Agents</h1>
          <p className="text-gray-600 mt-1">Manage delivery personnel and their assignments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Agent
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search agents by name, email, phone, or vehicle number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAgents.map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(agent.status)}
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingAgent(agent)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{agent.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-gray-400" />
                  <div>
                    <span className="text-gray-600">{agent.vehicle}</span>
                    <p className="text-xs text-gray-500">{agent.vehicleNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{agent.currentLocation}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-lg font-semibold text-gray-900">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      {agent.rating}
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">{agent.totalDeliveries}</div>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-emerald-600">{agent.activeDeliveries}</div>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Joined: {new Date(agent.joinedDate).toLocaleDateString()}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No delivery agents found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first delivery agent'}
          </p>
        </div>
      )}

      {(showAddModal || editingAgent) && (
        <AgentModal
          agent={editingAgent}
          onClose={() => {
            setShowAddModal(false);
            setEditingAgent(null);
          }}
          onSubmit={editingAgent ? handleUpdateAgent : handleAddAgent}
        />
      )}
    </div>
  );
};

interface AgentModalProps {
  agent?: DeliveryAgent | null;
  onClose: () => void;
  onSubmit: (agentData: Omit<DeliveryAgent, 'id' | 'totalDeliveries' | 'activeDeliveries' | 'rating'>) => void;
}

const AgentModal: React.FC<AgentModalProps> = ({ agent, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    email: agent?.email || '',
    phone: agent?.phone || '',
    vehicle: agent?.vehicle || '',
    vehicleNumber: agent?.vehicleNumber || '',
    licenseNumber: agent?.licenseNumber || '',
    status: agent?.status || 'active' as DeliveryAgent['status'],
    currentLocation: agent?.currentLocation || '',
    joinedDate: agent?.joinedDate || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {agent ? 'Edit Delivery Agent' : 'Add New Delivery Agent'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as DeliveryAgent['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <input
                type="text"
                required
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Location
              </label>
              <input
                type="text"
                required
                value={formData.currentLocation}
                onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joined Date
              </label>
              <input
                type="date"
                required
                value={formData.joinedDate}
                onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              {agent ? 'Update' : 'Add'} Agent
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DeliveryAgentManagement;
