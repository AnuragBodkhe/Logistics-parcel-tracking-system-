import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2, Mail, Phone, MapPin, Package } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load users from storage and initialize with mock data
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem('logitrack_users');
        const mockInitialized = localStorage.getItem('logitrack_users_mock_initialized');
        
        if (!storedUsers && !mockInitialized) {
          // Initialize with sample data from mock parcels
          const mockUsers: User[] = [
            {
              id: '1',
              name: 'John Anderson',
              email: 'john.anderson@techcorp.com',
              phone: '+1-555-0123',
              address: '123 Tech Park, Silicon Valley, CA 94025',
              createdAt: '2024-01-15T09:00:00Z',
              totalParcels: 12,
              activeParcels: 1
            },
            {
              id: '2',
              name: 'Emily Chen',
              email: 'emily.chen@fashionboutique.com',
              phone: '+1-555-0234',
              address: '789 Fashion Avenue, Los Angeles, CA 90001',
              createdAt: '2024-01-10T10:00:00Z',
              totalParcels: 8,
              activeParcels: 0
            },
            {
              id: '3',
              name: 'Robert Williams',
              email: 'robert.williams@lawfirm.com',
              phone: '+1-555-0345',
              address: '555 Financial Center, Chicago, IL 60601',
              createdAt: '2024-01-16T16:00:00Z',
              totalParcels: 5,
              activeParcels: 1
            },
            {
              id: '4',
              name: 'Maria Garcia',
              email: 'maria.garcia@restaurant.com',
              phone: '+1-555-0456',
              address: '777 Food Market, Houston, TX 77001',
              createdAt: '2024-01-14T08:00:00Z',
              totalParcels: 3,
              activeParcels: 1
            },
            {
              id: '5',
              name: 'Amanda Foster',
              email: 'amanda.foster@antiques.com',
              phone: '+1-555-0567',
              address: '222 Antique Shop, Boston, MA 02101',
              createdAt: '2024-01-12T11:00:00Z',
              totalParcels: 7,
              activeParcels: 1
            },
            {
              id: '6',
              name: 'Daniel Kim',
              email: 'daniel.kim@electronics.com',
              phone: '+1-555-0678',
              address: '333 Electronics Store, Seattle, WA 98101',
              createdAt: '2024-01-17T14:00:00Z',
              totalParcels: 4,
              activeParcels: 1
            }
          ];
          setUsers(mockUsers);
          localStorage.setItem('logitrack_users', JSON.stringify(mockUsers));
          localStorage.setItem('logitrack_users_mock_initialized', 'true');
        } else if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt' | 'totalParcels' | 'activeParcels'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalParcels: 0,
      activeParcels: 0
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('logitrack_users', JSON.stringify(updatedUsers));
    setShowAddModal(false);
  };

  const handleUpdateUser = (userData: Omit<User, 'id' | 'createdAt' | 'totalParcels' | 'activeParcels'>) => {
    if (!editingUser) return;

    const updatedUser: User = {
      ...editingUser,
      ...userData
    };

    const updatedUsers = users.map(user => 
      user.id === editingUser.id ? updatedUser : user
    );

    setUsers(updatedUsers);
    localStorage.setItem('logitrack_users', JSON.stringify(updatedUsers));
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('logitrack_users', JSON.stringify(updatedUsers));
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
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage customers and their information</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingUser(user)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate">{user.address}</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Total: {user.totalParcels}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-600">Active: {user.activeParcels}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first user'}
          </p>
        </div>
      )}

      {(showAddModal || editingUser) && (
        <UserModal
          user={editingUser}
          onClose={() => {
            setShowAddModal(false);
            setEditingUser(null);
          }}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
        />
      )}
    </div>
  );
};

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'totalParcels' | 'activeParcels'>) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || ''
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
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              Address
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            />
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
              {user ? 'Update' : 'Add'} User
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserManagement;
