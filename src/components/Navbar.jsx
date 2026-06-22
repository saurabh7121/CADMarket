import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import {
  ShoppingCart, Menu, X, Search, ChevronDown,
  User, LogOut, Package, LogIn,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Mechanical', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical', 'Industrial'];

export default function Navbar() {
  const { count } = useCart();
  const { user, isLoggedIn, logout } = useUserAuth();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const navigate = useNavigate();
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    toast.success('Signed out successfully');
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'bg-[#000000]/95 backdrop-blur-xl border-b border-[#404040]' : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center h-16 gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="CADMarket Logo" className="w-8 h-8 object-contain" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5)) brightness(1.3)' }} />
          <span className="font-bold text-sm sm:text-lg tracking-tight">
            CAD<span className="gradient-text">Market</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-[#e5e5e5]' : 'text-[#a3a3a3] hover:text-[#e5e5e5]'
              }`
            }
          >
            Home
          </NavLink>

          {/* Categories dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
            >
              Categories <ChevronDown size={14} className={`transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 glass-card py-1 animate-fade-in">
                {CATEGORIES.slice(1).map(cat => (
                  <Link
                    key={cat}
                    to={`/products?category=${cat}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2 text-sm text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-white/5 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-[#e5e5e5]' : 'text-[#a3a3a3] hover:text-[#e5e5e5]'
              }`
            }
          >
            All Designs
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-[#e5e5e5]' : 'text-[#a3a3a3] hover:text-[#e5e5e5]'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs ml-auto">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search CAD designs…"
              className="input-field pl-8 py-2 text-sm"
            />
          </div>
        </form>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative p-2 rounded-lg bg-white/5 border border-[#404040] hover:border-white/40 transition-all ml-auto md:ml-2"
        >
          <ShoppingCart size={18} className="text-[#e5e5e5]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#ffffff] text-black text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>

        {/* Mobile User Auth Button */}
        <div className="md:hidden">
          {isLoggedIn ? (
            <Link
              to="/orders"
              className="w-9 h-9 rounded-lg bg-white/5 border border-[#404040] flex items-center justify-center text-white text-xs font-bold"
            >
              {initials}
            </Link>
          ) : (
            <Link
              to="/login"
              className="p-2 rounded-lg bg-white/5 border border-[#404040] flex items-center justify-center"
            >
              <User size={18} className="text-[#e5e5e5]" />
            </Link>
          )}
        </div>

        {/* User auth (Desktop) */}
        <div ref={userRef} className="relative hidden md:block">
          {isLoggedIn ? (
            <>
              <button
                id="user-menu-btn"
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg bg-white/5 border border-[#404040] hover:border-white/40 transition-all"
              >
                {/* Avatar */}
                <div className="w-7 h-7 rounded-lg bg-[#404040] flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-xs font-medium text-[#e5e5e5] max-w-[80px] truncate">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={12} className={`text-[#a3a3a3] transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>

              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 glass-card py-1.5 animate-fade-in">
                  <div className="px-4 py-2.5 border-b border-[#404040]">
                    <p className="text-sm font-semibold text-[#e5e5e5] truncate">{user?.name}</p>
                    <p className="text-xs text-[#a3a3a3] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/orders"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-white/5 transition-colors"
                  >
                    <Package size={14} /> My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-white/5 transition-colors"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link
              to="/login"
              id="navbar-login-btn"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-[#e5e5e5] border border-[#404040] hover:border-white/60 hover:bg-white/5 transition-all"
            >
              <LogIn size={14} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-[#404040] hover:border-white/40 transition-all"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#404040] bg-[#000000]/98 px-4 py-4 space-y-1 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a3a3a3]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search CAD designs…"
                className="input-field pl-8 py-2 text-sm"
              />
            </div>
          </form>

          {/* User section */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg bg-white/5 border border-[#404040]">
              <div className="w-7 h-7 rounded-lg bg-[#404040] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#e5e5e5] truncate">{user?.name}</p>
                <p className="text-xs text-[#a3a3a3] truncate">{user?.email}</p>
              </div>
            </div>
          ) : null}

          {[
            { to: '/', label: 'Home', end: true },
            { to: '/products', label: 'All Designs' },
            { to: '/contact', label: 'Contact' },
            { to: '/cart', label: `Cart (${count})` },
            ...(isLoggedIn ? [{ to: '/orders', label: 'My Orders' }] : []),
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/10 text-[#e5e5e5]' : 'text-[#a3a3a3] hover:text-[#e5e5e5]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          {isLoggedIn ? (
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-white/5 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block w-full py-2.5 rounded-lg text-sm font-bold bg-white text-black text-center mt-2 hover:bg-[#e5e5e5] transition-colors"
            >
              Sign In / Sign Up
            </Link>
          )}

          <div className="pt-1 border-t border-[#404040]">
            <p className="text-xs text-[#a3a3a3] px-3 py-1 uppercase tracking-wider">Categories</p>
            {CATEGORIES.slice(1).map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-[#a3a3a3] hover:text-[#e5e5e5] transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
