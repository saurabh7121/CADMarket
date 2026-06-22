import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUserAuth } from '../context/UserAuthContext';
import api from '../lib/api';
import { LoadingPage, EmptyState } from '../components/UI';
import { ShoppingCart, User, Mail, Phone, MapPin, ShieldCheck, ArrowLeft, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, total, clearCart, count } = useCart();
  const { user, isLoggedIn } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [errors, setErrors] = useState({});

  // Update prefill if user changes
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        fullName: f.fullName || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Redirect if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="glass-card p-10 text-center max-w-sm w-full mx-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-[#404040] flex items-center justify-center mx-auto mb-4">
            <LogIn size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-[#e8e8f0] mb-2">Sign in to checkout</h2>
          <p className="text-sm text-[#8888aa] mb-6">
            Create an account or sign in to complete your purchase and track your order history.
          </p>
          <Link
            to="/login"
            state={{ from: '/checkout' }}
            className="btn-primary w-full justify-center"
          >
            <LogIn size={15} /> Sign In
          </Link>
          <Link to="/signup" state={{ from: '/checkout' }} className="block mt-3 text-sm text-white hover:underline transition-colors">
            New here? Create a free account
          </Link>
        </div>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="min-h-screen pt-24">
        <EmptyState
          icon={ShoppingCart}
          title="Nothing to checkout"
          description="Add products to your cart first."
          action={<Link to="/products" className="btn-primary">Browse Designs</Link>}
        />
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required';
    if (!/^\d{10}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.pincode.trim()) e.pincode = 'Pincode required';
    return e;
  };

  const handleChange = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    const token = localStorage.getItem('cadmarket_user_token');
    try {
      // Create Razorpay order
      const { data } = await api.post('/payments/create-order', {
        items: items.map(i => ({ productId: i._id, price: i.price })),
        billing: form,
      }, token ? { headers: { Authorization: `Bearer ${token}` } } : {});

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency || 'INR',
        name: 'CADMarket',
        description: `${count} CAD Design${count > 1 ? 's' : ''}`,
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: data.orderId,
            });
            clearCart();
            navigate(`/order-success/${verifyRes.data.orderId}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: '#ffffff' },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="container-wide px-4 py-8">
        <Link to="/cart" className="flex items-center gap-1.5 text-sm text-[#8888aa] hover:text-[#e8e8f0] mb-6 transition-colors">
          <ArrowLeft size={14} /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-[#e8e8f0] mb-8">Checkout</h1>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6">
                <h2 className="font-bold text-lg text-[#e8e8f0] mb-5 flex items-center gap-2">
                  <User size={18} className="text-white" /> Billing Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Full Name" icon={User} required
                    value={form.fullName} onChange={v => handleChange('fullName', v)}
                    error={errors.fullName} placeholder="John Doe"
                  />
                  <Field
                    label="Email Address" icon={Mail} required type="email"
                    value={form.email} onChange={v => handleChange('email', v)}
                    error={errors.email} placeholder="john@example.com"
                  />
                  <Field
                    label="Phone Number" icon={Phone} required type="tel"
                    value={form.phone} onChange={v => handleChange('phone', v)}
                    error={errors.phone} placeholder="9876543210"
                  />
                  <Field
                    label="City" required
                    value={form.city} onChange={v => handleChange('city', v)}
                    error={errors.city} placeholder="Mumbai"
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Street Address" icon={MapPin} required
                      value={form.address} onChange={v => handleChange('address', v)}
                      error={errors.address} placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  <Field
                    label="State"
                    value={form.state} onChange={v => handleChange('state', v)}
                    placeholder="Maharashtra"
                  />
                  <Field
                    label="Pincode" required
                    value={form.pincode} onChange={v => handleChange('pincode', v)}
                    error={errors.pincode} placeholder="400001"
                  />
                </div>
              </div>

              {/* Payment info */}
              <div className="glass-card p-5 flex items-start gap-3 border-[#404040]">
                <ShieldCheck size={20} className="text-[#00c851] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#e8e8f0] mb-1">Secure Payment via Razorpay</p>
                  <p className="text-xs text-[#8888aa]">
                    Your payment information is encrypted and never stored on our servers. 
                    After payment, you'll receive an email with download links.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="glass-card p-6 sticky top-24">
                <h2 className="font-bold text-lg text-[#e8e8f0] mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4">
                  {items.map(item => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.thumbnail || 'https://placehold.co/50x38/171717/ffffff?text=CAD'}
                        alt={item.title}
                        className="w-12 h-9 rounded-lg object-cover shrink-0 border border-[#404040]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#e8e8f0] truncate">{item.title}</p>
                        <p className="text-xs text-[#8888aa]">{item.category}</p>
                      </div>
                      <p className="text-xs font-bold text-[#e8e8f0] shrink-0">
                        ₹{(item.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>

                <hr className="divider mb-4" />

                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-[#8888aa]">Subtotal</span>
                  <span className="text-[#e8e8f0]">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span className="text-[#8888aa]">GST (18%)</span>
                  <span className="text-[#e8e8f0]">Included</span>
                </div>
                <div className="flex items-center justify-between font-bold text-lg mb-5">
                  <span className="text-[#e8e8f0]">Total</span>
                  <span className="gradient-text">₹{total.toLocaleString('en-IN')}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3 text-base"
                >
                  {loading ? (
                    <><span className="spinner w-4 h-4" /> Processing…</>
                  ) : (
                    <>Pay ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, value, onChange, error, placeholder, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#8888aa] mb-1.5">
        {label} {required && <span className="text-[#ff6b6b]">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${Icon ? 'pl-9' : ''} ${error ? 'border-[#ff6b6b] focus:border-[#ff6b6b] focus:shadow-[0_0_0_3px_rgba(255,107,107,0.15)]' : ''}`}
        />
      </div>
      {error && <p className="text-xs text-[#ff6b6b] mt-1">{error}</p>}
    </div>
  );
}
