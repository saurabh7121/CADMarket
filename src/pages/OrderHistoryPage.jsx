import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import api from '../lib/api';
import {
  Package, Download, ChevronDown, ChevronUp,
  Calendar, CreditCard, CheckCircle2, ShoppingBag,
  ArrowRight, Loader2, FileDown
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderHistoryPage() {
  const { user } = useUserAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});
  const [downloading, setDownloading] = useState({});
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (p) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('cadmarket_user_token');
      const { data } = await api.get(`/users/orders?page=${p}&limit=8`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
      setMeta({ total: data.total, pages: data.pages });
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const handleDownload = async (orderId, productId, title) => {
    const key = `${orderId}-${productId}`;
    setDownloading(d => ({ ...d, [key]: true }));
    try {
      const { data } = await api.get(`/orders/${orderId}/download/${productId}`);
      // Open in new tab to trigger download
      window.open(data.url, '_blank');
      toast.success(`Downloading ${title}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Download failed');
    } finally {
      setDownloading(d => ({ ...d, [key]: false }));
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container-wide px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#404040] flex items-center justify-center">
              <Package size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#e8e8f0]">Order History</h1>
              <p className="text-sm text-[#8888aa]">
                Hi <span className="text-[#e8e8f0] font-medium">{user?.name}</span> — here are all your purchases
              </p>
            </div>
          </div>
          {meta.total > 0 && (
            <p className="text-xs text-[#8888aa] mt-1">
              {meta.total} completed order{meta.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={28} className="text-white animate-spin" />
            <p className="text-sm text-[#8888aa]">Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="glass-card text-center py-20 px-8">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-[#404040] flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#e8e8f0] mb-2">No orders yet</h2>
            <p className="text-sm text-[#8888aa] mb-6 max-w-sm mx-auto">
              Once you purchase a CAD design, it will appear here with instant download access.
            </p>
            <Link to="/products" className="btn-primary">
              Browse Designs <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                expanded={!!expanded[order._id]}
                onToggle={() => toggleExpand(order._id)}
                downloading={downloading}
                onDownload={handleDownload}
              />
            ))}

            {/* Pagination */}
            {meta.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: meta.pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                      p === page
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-[#8888aa] hover:bg-white/10 border border-[#404040]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, expanded, onToggle, downloading, onDownload }) {
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const time = new Date(order.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="glass-card overflow-hidden animate-fade-in">
      {/* Card header */}
      <div
        className="flex items-center justify-between p-5 cursor-pointer group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          {/* Status dot */}
          <div className="w-9 h-9 rounded-xl bg-[#00c851]/10 border border-[#00c851]/25 flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} className="text-[#00c851]" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-[#e8e8f0]">
                Order #{order._id.slice(-8).toUpperCase()}
              </span>
              <span className="badge badge-success">Completed</span>
            </div>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-[#8888aa]">
              <span className="flex items-center gap-1"><Calendar size={10} /> {date} · {time}</span>
              <span className="flex items-center gap-1"><Package size={10} /> {order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-[#8888aa] flex items-center gap-1 justify-end">
              <CreditCard size={10} /> Total
            </p>
            <p className="font-bold text-[#e8e8f0]">₹{order.totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="text-[#8888aa] group-hover:text-[#e8e8f0] transition-colors">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </div>

      {/* Expandable content */}
      {expanded && (
        <div className="border-t border-[#404040] p-4 sm:p-5 space-y-3.5 animate-fade-in">
          {/* Items */}
          {order.items.map((item) => {
            const dlKey = `${order._id}-${item.productId}`;
            return (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-2.5 rounded-lg p-2.5 sm:p-3 bg-white/[0.03] border border-white/[0.06]"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={item.thumbnail || 'https://placehold.co/60x46/171717/ffffff?text=CAD'}
                    alt={item.title}
                    className="w-12 h-9 sm:w-14 sm:h-11 rounded object-cover shrink-0 border border-[#404040]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#e8e8f0] truncate">{item.title}</p>
                    <p className="text-[10px] sm:text-xs text-[#8888aa]">{item.category}</p>
                    <p className="text-xs font-bold text-white mt-0.5">
                      ₹{(item.price || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDownload(order._id, item.productId, item.title)}
                  disabled={downloading[dlKey]}
                  className="btn-primary text-xs px-2.5 py-1.5 sm:px-3 sm:py-1.5 shrink-0"
                >
                  {downloading[dlKey] ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <><FileDown size={12} /> <span className="hidden xs:inline">Download</span></>
                  )}
                </button>
              </div>
            );
          })}

          {/* Billing info */}
          <div className="text-xs text-[#8888aa] pt-2 border-t border-[#404040] flex flex-wrap gap-x-6 gap-y-1">
            <span><span className="text-[#e8e8f0] font-medium">Name:</span> {order.billing?.fullName}</span>
            <span><span className="text-[#e8e8f0] font-medium">Email:</span> {order.billing?.email}</span>
            {order.billing?.city && (
              <span><span className="text-[#e8e8f0] font-medium">City:</span> {order.billing.city}</span>
            )}
            <span>
              <span className="text-[#e8e8f0] font-medium">Payment ID:</span>{' '}
              <span className="font-mono">{order.paymentId?.slice(-10) || '—'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
