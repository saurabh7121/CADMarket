import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { StatCard } from '../../components/UI';
import { TrendingUp, Package, ShoppingBag, Users, IndianRupee, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-[#8888aa] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === 'number' && p.name?.includes('₹') ? `₹${p.value.toLocaleString('en-IN')}` : p.value}
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/admin/stats'),
      api.get('/admin/revenue-chart'),
      api.get('/admin/top-products'),
      api.get('/orders?limit=5'),
    ]).then(([s, r, t, o]) => {
      setStats(s.data);
      setRevenueData(r.data.data || []);
      setTopProducts(t.data.products || []);
      setRecentOrders(o.data.orders || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#e8e8f0]">Dashboard</h1>
        <p className="text-sm text-[#8888aa] mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`} icon={IndianRupee} color="#6c63ff" trend={stats?.revenueTrend} />
        <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingBag} color="#00d4ff" trend={stats?.ordersTrend} />
        <StatCard label="Total Products" value={stats?.totalProducts || 0} icon={Package} color="#00c851" />
        <StatCard label="Total Downloads" value={stats?.totalDownloads || 0} icon={Download} color="#ffbb33" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="font-semibold text-[#e8e8f0] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#6c63ff]" /> Revenue (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6c63ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6c63ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8888aa' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8888aa' }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="₹Revenue" stroke="#6c63ff" fill="url(#revGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-[#e8e8f0] mb-4 flex items-center gap-2">
            <Package size={16} className="text-[#00d4ff]" /> Top Products
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProducts.slice(0, 5)} layout="vertical" margin={{ top: 0, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#8888aa' }} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 9, fill: '#8888aa' }} width={70} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="downloads" name="Downloads" fill="#00d4ff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-[#e8e8f0] mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3e]">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs text-[#8888aa] font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8888aa] text-sm">No orders yet</td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order._id} className="border-b border-[#1a1a28] hover:bg-white/2 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-xs text-[#6c63ff]">#{order._id?.slice(-6)}</td>
                    <td className="py-2.5 px-3 text-[#e8e8f0]">{order.billing?.fullName}</td>
                    <td className="py-2.5 px-3 text-[#8888aa]">{order.items?.length || 0}</td>
                    <td className="py-2.5 px-3 text-[#e8e8f0] font-medium">₹{(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-3">
                      <span className={`badge ${order.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#8888aa] text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
