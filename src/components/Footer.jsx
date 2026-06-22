import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Code2, MessageSquare, Globe } from 'lucide-react';

const LINKS = {
  Explore: [
    { label: 'All Designs',     to: '/products' },
    { label: 'Mechanical',      to: '/products?category=Mechanical' },
    { label: 'Architecture',    to: '/products?category=Architecture' },
    { label: 'Automotive',      to: '/products?category=Automotive' },
    { label: 'Aerospace',       to: '/products?category=Aerospace' },
    { label: 'Electronics',     to: '/products?category=Electronics' },
  ],
  Account: [
    { label: 'Sign In',         to: '/login' },
    { label: 'Create Account',  to: '/signup' },
    { label: 'My Orders',       to: '/orders' },
    { label: 'Cart',            to: '/cart' },
  ],
  Legal: [
    { label: 'Privacy Policy',  to: '#' },
    { label: 'Terms of Service',to: '#' },
    { label: 'Refund Policy',   to: '#' },
    { label: 'Cookie Policy',   to: '#' },
  ],
};

const SOCIALS = [
  { icon: Code2,        href: '#', label: 'GitHub' },
  { icon: MessageSquare,href: '#', label: 'Twitter' },
  { icon: Globe,        href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-[#404040] mt-auto">
      <div className="container-wide px-4">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16">

          {/* Brand column — spans 2 cols on lg */}
          <div className="lg:col-span-2">
            {/* Logo + wordmark */}
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <img
                src="/logo.png"
                alt="CADMarket Logo"
                className="w-9 h-9 object-contain"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5)) brightness(1.3)' }}
              />
              <span className="font-bold text-xl tracking-tight text-white">
                CAD<span className="text-[#a3a3a3]">Market</span>
              </span>
            </Link>

            <p className="text-sm text-[#737373] leading-relaxed max-w-xs mb-6">
              A marketplace for professional CAD designs. Download STEP, STL, SolidWorks,
              and AutoCAD files instantly — no subscription required.
            </p>

            {/* Contact details */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2.5">
                <Mail size={13} className="text-[#525252] shrink-0" />
                <a
                  href="mailto:hello@cadmarket.in"
                  className="text-sm text-[#a3a3a3] hover:text-white transition-colors"
                >
                  hello@cadmarket.in
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={13} className="text-[#525252] shrink-0" />
                <a
                  href="tel:+919876543210"
                  className="text-sm text-[#a3a3a3] hover:text-white transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin size={13} className="text-[#525252] shrink-0 mt-0.5" />
                <span className="text-sm text-[#a3a3a3]">
                  Koramangala, Bengaluru,<br />Karnataka 560034, India
                </span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded flex items-center justify-center bg-[#171717] border border-[#404040] text-[#525252] hover:text-white hover:border-[#737373] transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, items]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-[#e5e5e5] uppercase tracking-widest mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {items.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-[#737373] hover:text-[#e5e5e5] transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[#262626]" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 text-xs text-[#525252]">
          <p>© {new Date().getFullYear()} CADMarket. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#404040] inline-block" />
            <span>Built for engineers, by engineers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
