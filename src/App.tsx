import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation, 
  Navigate,
  useNavigate
} from 'react-router-dom';
import { 
  Package, 
  LayoutDashboard, 
  Search, 
  PlusCircle, 
  List, 
  LogOut, 
  Menu, 
  X,
  Truck,
  ShieldCheck,
  Bell,
  Home,
  Users,
  BarChart3,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationBell } from './components/NotificationBell';
import { NotificationToast } from './components/NotificationToast';

// Pages
import Dashboard from './pages/Dashboard';
import AddParcel from './pages/AddParcel';
import ParcelList from './pages/ParcelList';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import AdminParcelDetails from './pages/AdminParcelDetails';
import UserManagement from './pages/UserManagement';
import DeliveryAgentManagement from './pages/DeliveryAgentManagement';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Add Parcel', path: '/add', icon: PlusCircle },
    { name: 'All Parcels', path: '/list', icon: List },
    { name: 'Track Parcel', path: '/', icon: Search },
    { name: 'Users', path: '/users', icon: Users },
    { name: 'Agents', path: '/agents', icon: Truck },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center justify-between mb-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">LogiTrack</h1>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <div className="text-center text-slate-400 text-sm">
            <p>LogiTrack v1.0</p>
            <p className="text-xs mt-1">© 2024 Logistics System</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Truck className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg">LogiTrack</span>
        </Link>
        <div className="flex items-center gap-4">
          <NotificationBell btnClassName="text-slate-400 hover:text-white hover:bg-slate-800" />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-20 px-6"
          >
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xl text-slate-300 py-2"
                >
                  <item.icon className="w-6 h-6" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-slate-800">
                <div className="text-center text-slate-400 text-sm">
                  <p>LogiTrack v1.0</p>
                  <p className="text-xs mt-1">© 2024 Logistics System</p>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-slate-50 overflow-y-auto">
        <header className="hidden md:flex sticky top-0 z-30 bg-slate-50/80 backdrop-blur-md px-4 md:px-8 py-4 justify-end items-center">
          <NotificationBell />
        </header>
        <div className="flex-1 p-4 md:p-8 pt-0 md:pt-0">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      <NotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Tracking />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<AddParcel />} />
          <Route path="/edit/:id" element={<AddParcel />} />
          <Route path="/list" element={<ParcelList />} />
          <Route path="/parcel/:id" element={<AdminParcelDetails />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/agents" element={<DeliveryAgentManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}
