import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { LoadingPage } from '../components/UI';
import { CheckCircle2, Download, Package, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({});

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then(r => setOrder(r.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const downloadFile = async (productId, title) => {
    setDownloading(d => ({ ...d, [productId]: true }));
    try {
      const { data } = await api.get(`/orders/${orderId}/download/${productId}`);
      window.open(data.url, '_blank');
    } catch {
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(d => ({ ...d, [productId]: false }));
    }
  };

  const downloadAll = async () => {
    setDownloading(d => ({ ...d, all: true }));
    try {
      const { data } = await api.get(`/orders/${orderId}/download-all`);
      window.open(data.url, '_blank');
    } catch {
      toast.error('Bundle download failed.');
    } finally {
      setDownloading(d => ({ ...d, all: false }));
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-[#00c851]/15 border-2 border-[#00c851]/30 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
            <CheckCircle2 size={40} className="text-[#00c851]" />
          </div>
          <h1 className="text-3xl font-black text-[#e8e8f0] mb-2">Payment Successful!</h1>
          <p className="text-[#8888aa]">
            Your order has been confirmed. Download your CAD files below.
          </p>
          {order && (
            <p className="text-xs text-[#8888aa] mt-2 font-mono bg-white/5 px-3 py-1 rounded-lg inline-block">
              Order #{orderId}
            </p>
          )}
        </div>

        {order && (
          <div className="space-y-4">
            {/* Customer info */}
            <div className="glass-card p-5">
              <h3 className="font-semibold text-[#e8e8f0] mb-3 flex items-center gap-2">
                <Package size={16} className="text-[#6c63ff]" /> Order Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-[#8888aa]">Name</p>
                  <p className="text-[#e8e8f0]">{order.billing?.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8888aa]">Email</p>
                  <p className="text-[#e8e8f0]">{order.billing?.email}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8888aa]">Amount Paid</p>
                  <p className="text-[#e8e8f0] font-bold">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8888aa]">Payment ID</p>
                  <p className="text-[#e8e8f0] font-mono text-xs">{order.paymentId}</p>
                </div>
              </div>
            </div>

            {/* Downloads */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#e8e8f0] flex items-center gap-2">
                  <Download size={16} className="text-[#6c63ff]" /> Your Downloads
                </h3>
                {order.items?.length > 1 && (
                  <button
                    onClick={downloadAll}
                    disabled={downloading.all}
                    className="btn-secondary text-xs py-1.5"
                  >
                    {downloading.all ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    Download All (.zip)
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {order.items?.map(item => (
                  <div key={item.productId} className="flex items-center gap-4 p-3 bg-white/3 rounded-xl border border-[#2a2a3e]">
                    <img
                      src={item.thumbnail || 'https://placehold.co/50x38/12121a/6c63ff?text=CAD'}
                      alt={item.title}
                      className="w-14 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#e8e8f0] truncate">{item.title}</p>
                      <p className="text-xs text-[#8888aa]">{item.category}</p>
                    </div>
                    <button
                      onClick={() => downloadFile(item.productId, item.title)}
                      disabled={downloading[item.productId]}
                      className="btn-primary text-xs py-1.5 px-3 shrink-0"
                    >
                      {downloading[item.productId] ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Download size={12} />
                      )}
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link to="/products" className="flex-1 btn-ghost text-sm justify-center">
                Continue Shopping
              </Link>
              <Link to={`/orders/${orderId}`} className="flex-1 btn-secondary text-sm justify-center">
                View Order <ArrowRight size={14} />
              </Link>
            </div>

            <p className="text-center text-xs text-[#8888aa]">
              A confirmation email has been sent to {order.billing?.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
