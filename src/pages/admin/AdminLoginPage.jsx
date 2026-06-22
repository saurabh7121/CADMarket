import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Ambient background */}
      <div className="auth-bg">
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/logo.png" alt="CADMarket" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight">
            CAD<span className="gradient-text">Market</span>
          </span>
        </div>

        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-icon-wrap">
              <Lock size={22} className="text-white" />
            </div>
            <h1 className="auth-title">Admin Panel</h1>
            <p className="auth-subtitle">Sign in to manage CADMarket</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@cadmarket.com"
                  className="auth-input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="auth-input pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="auth-pw-toggle"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in…</>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#8888aa] mt-2">
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
}
