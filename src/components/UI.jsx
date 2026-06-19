export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4 border', md: 'w-6 h-6 border-2', lg: 'w-10 h-10 border-2' };
  return (
    <div className={`${sizes[size]} border-white/15 border-t-[#6c63ff] rounded-full animate-spin ${className}`} />
  );
}

export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-[#8888aa]">Loading…</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center mb-4">
          <Icon size={28} className="text-[#6c63ff]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#e8e8f0] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#8888aa] max-w-md mb-6">{description}</p>}
      {action}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = '#6c63ff' }) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold ${trend >= 0 ? 'text-[#00c851]' : 'text-[#ff6b6b]'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-[#e8e8f0] mb-0.5">{value}</div>
      <div className="text-xs text-[#8888aa]">{label}</div>
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#e8e8f0] mb-1">{title}</h2>
        {subtitle && <p className="text-[#8888aa] text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
