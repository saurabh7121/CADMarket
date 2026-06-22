import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const { register } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Enter a 10-digit phone number';
    if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleChange = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(er => ({ ...er, [key]: '' }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password, form.phone);
      toast.success('Account created! Welcome 🎉');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <img src="/logo.png" alt="CADMarket" className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg tracking-tight">
            CAD<span className="gradient-text">Market</span>
          </span>
        </Link>

        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-icon-wrap">
              <UserPlus size={22} className="text-white" />
            </div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Join CADMarket and start downloading premium CAD designs</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Name */}
            <div className="auth-field">
              <label className="auth-label">Full name</label>
              <div className="auth-input-wrap">
                <User size={15} className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  className={`auth-input ${errors.name ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.name && <p className="auth-error">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrap">
                <Mail size={15} className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email}</p>}
            </div>

            {/* Phone (optional) */}
            <div className="auth-field">
              <label className="auth-label">
                Phone number <span className="text-[#8888aa] font-normal">(optional)</span>
              </label>
              <div className="auth-input-wrap">
                <Phone size={15} className="auth-input-icon" />
                <input
                  id="signup-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="9876543210"
                  className={`auth-input ${errors.phone ? 'auth-input-error' : ''}`}
                />
              </div>
              {errors.phone && <p className="auth-error">{errors.phone}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="signup-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`auth-input pr-10 ${errors.password ? 'auth-input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="auth-pw-toggle" tabIndex={-1}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password}</p>}
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map(i => {
                    const strength = form.password.length >= 8 && /[A-Z]/.test(form.password) ? 4
                      : form.password.length >= 8 ? 3
                      : form.password.length >= 6 ? 2 : 1;
                    return (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          background: i <= strength
                            ? strength >= 4 ? '#00c851' : strength >= 3 ? '#ffbb33' : '#ff6b6b'
                            : 'rgba(255,255,255,0.1)'
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label className="auth-label">Confirm password</label>
              <div className="auth-input-wrap">
                <Lock size={15} className="auth-input-icon" />
                <input
                  id="signup-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirm}
                  onChange={e => handleChange('confirm', e.target.value)}
                  placeholder="Re-enter password"
                  className={`auth-input pr-10 ${errors.confirm ? 'auth-input-error' : ''}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="auth-pw-toggle" tabIndex={-1}>
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.confirm && <p className="auth-error">{errors.confirm}</p>}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="auth-submit"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account…</>
              ) : (
                <><UserPlus size={16} /> Create Account</>
              )}
            </button>
          </form>

          <p className="text-xs text-[#8888aa] text-center mt-3 px-2">
            By creating an account you agree to our{' '}
            <span className="text-[#e5e5e5] underline hover:text-white cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="text-[#e5e5e5] underline hover:text-white cursor-pointer">Privacy Policy</span>.
          </p>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" state={{ from }} className="auth-switch-link">
              Sign in
            </Link>
          </p>
        </div>

        <div className="auth-trust">
          <Sparkles size={12} className="text-white" />
          <span>Secure · Encrypted · Instant downloads after payment</span>
        </div>
      </div>
    </div>
  );
}
