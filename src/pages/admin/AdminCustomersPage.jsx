import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { EmptyState } from '../../components/UI';
import { Users, Search } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get(`/admin/customers${search ? `?search=${search}` : ''}`)
      .then(r => setCustomers(r.data.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-[#e8e8f0]">Customers</h1>
        <p className="text-sm text-[#8888aa]">{customers.length} customers</p>
      </div>

      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="input-field pl-9 text-sm py-2"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a3e]">
                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs text-[#8888aa] font-semibold uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-[#8888aa]">Loading…</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={6} className="py-12">
                  <EmptyState icon={Users} title="No customers found" />
                </td></tr>
              ) : (
                customers.map((c, i) => (
                  <tr key={i} className="border-b border-[#1a1a28] hover:bg-white/2 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#6c63ff]/15 border border-[#6c63ff]/20 flex items-center justify-center text-xs font-bold text-[#8b85ff]">
                          {c.fullName?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="text-[#e8e8f0]">{c.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#8888aa]">{c.email}</td>
                    <td className="py-3 px-4 text-[#8888aa]">{c.phone}</td>
                    <td className="py-3 px-4 text-[#8888aa]">{c.orderCount || 0}</td>
                    <td className="py-3 px-4 font-bold text-[#e8e8f0]">₹{(c.totalSpent || 0).toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-[#8888aa] text-xs">
                      {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('en-IN') : '—'}
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
