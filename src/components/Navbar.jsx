import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Menu, X, Search, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Mechanical', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical', 'Industrial'];

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const catRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-[#2a2a3e]' : 'bg-transparent'
      }`}
    >
      <div className="container-wide flex items-center h-16 px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo.png" alt="CADMarket Logo" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight">
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
                isActive ? 'bg-[#6c63ff]/15 text-[#8b85ff]' : 'text-[#8888aa] hover:text-[#e8e8f0]'
              }`
            }
          >
            Home
          </NavLink>

          {/* Categories dropdown */}
          <div ref={catRef} className="relative">
            <button
              onClick={() => setCatOpen(v => !v)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-[#8888aa] hover:text-[#e8e8f0] transition-colors"
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
                    className="block px-4 py-2 text-sm text-[#8888aa] hover:text-[#e8e8f0] hover:bg-white/5 transition-colors"
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
                isActive ? 'bg-[#6c63ff]/15 text-[#8b85ff]' : 'text-[#8888aa] hover:text-[#e8e8f0]'
              }`
            }
          >
            All Designs
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#6c63ff]/15 text-[#8b85ff]' : 'text-[#8888aa] hover:text-[#e8e8f0]'
              }`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs ml-auto">
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
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
          className="relative p-2 rounded-lg bg-white/5 border border-[#2a2a3e] hover:border-[#6c63ff]/40 transition-all ml-2"
        >
          <ShoppingCart size={18} className="text-[#e8e8f0]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#6c63ff] text-white text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(v => !v)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-[#2a2a3e]"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#2a2a3e] bg-[#0a0a0f]/98 px-4 py-4 space-y-1 animate-fade-in">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search CAD designs…"
                className="input-field pl-8 py-2 text-sm"
              />
            </div>
          </form>
          {[
            { to: '/', label: 'Home', end: true },
            { to: '/products', label: 'All Designs' },
            { to: '/contact', label: 'Contact' },
            { to: '/cart', label: `Cart (${count})` },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#6c63ff]/15 text-[#8b85ff]' : 'text-[#8888aa] hover:text-[#e8e8f0]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-1 border-t border-[#2a2a3e]">
            <p className="text-xs text-[#8888aa] px-3 py-1 uppercase tracking-wider">Categories</p>
            {CATEGORIES.slice(1).map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-[#8888aa] hover:text-[#e8e8f0] transition-colors"
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
