import { Link } from 'react-router-dom';
import { ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a3e] bg-[#0a0a0f] mt-auto">
      <div className="container-wide px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="CADMarket Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg">CAD<span className="gradient-text">Market</span></span>
            </Link>
            <p className="text-sm text-[#8888aa] leading-relaxed mb-4">
              Premium CAD designs for engineers, architects, and makers. Download, customize, and build.
            </p>
            <div className="flex items-center gap-3">
              {['GitHub', 'Twitter', 'LinkedIn'].map((label, i) => (
                <a
                  key={i}
                  href="#"
                  title={label}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-[#2a2a3e] flex items-center justify-center text-[#8888aa] hover:text-[#e8e8f0] hover:border-[#6c63ff]/40 transition-all"
                >
                  <ExternalLink size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm text-[#e8e8f0] mb-4">Products</h4>
            <ul className="space-y-2">
              {['Mechanical Parts', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical Devices'].map(item => (
                <li key={item}>
                  <Link
                    to={`/products?category=${item.split(' ')[0]}`}
                    className="text-sm text-[#8888aa] hover:text-[#e8e8f0] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm text-[#e8e8f0] mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { label: 'Contact Us', to: '/contact' },
                { label: 'FAQ', to: '/contact' },
                { label: 'Downloads', to: '/orders' },
                { label: 'Refund Policy', to: '/contact' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-[#8888aa] hover:text-[#e8e8f0] transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm text-[#e8e8f0] mb-4">Contact</h4>
            <a
              href="mailto:support@cadmarket.com"
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#e8e8f0] transition-colors mb-2"
            >
              <Mail size={14} />
              support@cadmarket.com
            </a>
            <p className="text-sm text-[#8888aa]">Mon – Fri, 9am – 6pm IST</p>
          </div>
        </div>

        <hr className="divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8888aa]">
            © {new Date().getFullYear()} CADMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="text-xs text-[#8888aa] hover:text-[#e8e8f0] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
