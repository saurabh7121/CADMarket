import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut,
  Menu, X, ChevronRight, Bell
} from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
];

export default function AdminLayout({ children }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-[#0d0d1a] border-r border-[#2a2a3e] flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-5 border-b border-[#2a2a3e]">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CADMarket Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="font-bold text-sm text-[#e8e8f0]">CADMarket</p>
              <p className="text-xs text-[#8888aa]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || location.pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#6c63ff]/15 text-[#8b85ff] border border-[#6c63ff]/20'
                    : 'text-[#8888aa] hover:text-[#e8e8f0] hover:bg-white/5'
                }`}
              >
                <Icon size={17} />
                {label}
                {active && <ChevronRight size={13} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-[#2a2a3e]">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-[#6c63ff]/20 border border-[#6c63ff]/30 flex items-center justify-center">
              <span className="text-xs font-bold text-[#8b85ff]">
                {admin?.email?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#e8e8f0] truncate">{admin?.email}</p>
              <p className="text-xs text-[#8888aa]">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#8888aa] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-[#0a0a0f]/90 backdrop-blur border-b border-[#2a2a3e]">
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-[#2a2a3e]"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <Link to="/" target="_blank" className="text-xs text-[#8888aa] hover:text-[#e8e8f0] transition-colors">
              View Store ↗
            </Link>
            <button className="p-1.5 rounded-lg bg-white/5 border border-[#2a2a3e] text-[#8888aa] hover:text-[#e8e8f0] transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
