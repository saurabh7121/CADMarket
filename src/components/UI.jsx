export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-2' };
  return (
    <div className={`${sizes[size]} border-white/15 border-t-white rounded-full animate-spin ${className}`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-[#a3a3a3]">Loading…</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-lg bg-white/5 border border-[#404040] flex items-center justify-center mb-4">
          <Icon size={28} className="text-[#a3a3a3]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#e5e5e5] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#a3a3a3] max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = '#404040' }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 border border-[#404040]"
        >
          <Icon size={18} className="text-[#e5e5e5]" />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-[#e5e5e5]' : 'text-[#a3a3a3]'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-[#e5e5e5] mb-0.5">{value}</div>
      <div className="text-xs text-[#a3a3a3]">{label}</div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#e5e5e5] mb-1">{title}</h2>
        {subtitle && <p className="text-[#a3a3a3] text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
