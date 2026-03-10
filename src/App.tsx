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
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pages (to be created)
import Dashboard from './pages/Dashboard';
import AddParcel from './pages/AddParcel';
import ParcelList from './pages/ParcelList';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import AdminParcelDetails from './pages/AdminParcelDetails';

const Layout = ({ children, isAdmin, setIsAdmin }: { children: React.ReactNode, isAdmin: boolean, setIsAdmin: (val: boolean) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAdmin(false);
    navigate('/');
  };

  const navItems = isAdmin ? [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Add Parcel', path: '/admin/add', icon: PlusCircle },
    { name: 'All Parcels', path: '/admin/list', icon: List },
  ] : [
    { name: 'Track Parcel', path: '/', icon: Search },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Truck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">LogiTrack</h1>
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
          {isAdmin ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
              <span className="font-medium">Admin Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Truck className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-lg">LogiTrack</span>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
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
                {isAdmin ? (
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-4 text-xl text-red-400 py-2"
                  >
                    <LogOut className="w-6 h-6" />
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 text-xl text-emerald-400 py-2"
                  >
                    <ShieldCheck className="w-6 h-6" />
                    Admin Login
                  </Link>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-slate-50 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('logitrack_admin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('logitrack_admin', isAdmin.toString());
  }, [isAdmin]);

  return (
    <Router>
      <Layout isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
        <Routes>
          <Route path="/" element={<Tracking />} />
          <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={isAdmin ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/add" 
            element={isAdmin ? <AddParcel /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/edit/:id" 
            element={isAdmin ? <AddParcel /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/list" 
            element={isAdmin ? <ParcelList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin/parcel/:id" 
            element={isAdmin ? <AdminParcelDetails /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}
