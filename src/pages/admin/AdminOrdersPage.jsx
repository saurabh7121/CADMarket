import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { EmptyState } from '../../components/UI';
import { ShoppingBag, Search, Eye, Download } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page, limit: 20, ...(search && { search }) });
      const r = await api.get(`/orders?${q}`);
      setOrders(r.data.orders || []);
      setTotal(r.data.total || 0);
    } catch { setOrders([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [page, search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#e8e8f0]">Orders</h1>
        <p className="text-sm text-[#8888aa]">{total} total orders</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email…"
          className="input-field pl-9 text-sm py-2"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3e]">
                {['Order #', 'Customer', 'Email', 'Items', 'Amount', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-[#8888aa] font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-[#8888aa]">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="py-12">
                  <EmptyState icon={ShoppingBag} title="No orders found" />
                </td></tr>
              ) : (
                orders.map(o => (
                  <tr key={o._id} className="border-b border-[#1a1a28] hover:bg-white/2 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#6c63ff]">#{o._id?.slice(-6)}</td>
                    <td className="py-3 px-4 text-[#e8e8f0]">{o.billing?.fullName}</td>
                    <td className="py-3 px-4 text-[#8888aa] text-xs">{o.billing?.email}</td>
                    <td className="py-3 px-4 text-[#8888aa]">{o.items?.length || 0}</td>
                    <td className="py-3 px-4 font-bold text-[#e8e8f0]">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${o.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#8888aa] text-xs">
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelected(o)}
                        className="p-1.5 rounded-lg text-[#8888aa] hover:text-[#6c63ff] hover:bg-[#6c63ff]/10 transition-all"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
          <div className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-[#2a2a3e]">
              <h2 className="font-bold text-lg text-[#e8e8f0]">
                Order #{selected._id?.slice(-6)}
              </h2>
              <button onClick={() => setSelected(null)} className="text-[#8888aa] hover:text-[#e8e8f0]">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-[#8888aa]">Customer</p><p className="text-[#e8e8f0]">{selected.billing?.fullName}</p></div>
                <div><p className="text-xs text-[#8888aa]">Email</p><p className="text-[#e8e8f0]">{selected.billing?.email}</p></div>
                <div><p className="text-xs text-[#8888aa]">Phone</p><p className="text-[#e8e8f0]">{selected.billing?.phone}</p></div>
                <div><p className="text-xs text-[#8888aa]">Total</p><p className="text-[#e8e8f0] font-bold">₹{(selected.totalAmount || 0).toLocaleString('en-IN')}</p></div>
                <div className="col-span-2"><p className="text-xs text-[#8888aa]">Address</p>
                  <p className="text-[#e8e8f0]">{selected.billing?.address}, {selected.billing?.city} - {selected.billing?.pincode}</p>
                </div>
                <div><p className="text-xs text-[#8888aa]">Payment ID</p><p className="font-mono text-xs text-[#6c63ff]">{selected.paymentId}</p></div>
                <div><p className="text-xs text-[#8888aa]">Status</p><span className={`badge ${selected.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>{selected.status}</span></div>
              </div>

              <hr className="divider" />

              <div>
                <p className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">Purchased Items</p>
                {selected.items?.map(item => (
                  <div key={item.productId} className="flex items-center gap-3 py-2 border-b border-[#1a1a28] last:border-0">
                    <div className="flex-1">
                      <p className="text-sm text-[#e8e8f0]">{item.title}</p>
                      <p className="text-xs text-[#8888aa]">{item.category}</p>
                    </div>
                    <p className="text-sm font-bold text-[#e8e8f0]">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
