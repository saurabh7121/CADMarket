import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { LoadingPage, EmptyState, SectionHeader } from '../components/UI';
import {
  ArrowRight, Box, Shield, Zap, Download, Star,
  Package, ChevronRight, Layers, Globe, Lock
} from 'lucide-react';

const FEATURES = [
  { icon: Shield, title: 'Secure Downloads', desc: 'Files served via time-limited tokens — never exposed publicly.' },
  { icon: Zap, title: 'Instant Delivery', desc: 'Download your CAD files immediately after payment confirmation.' },
  { icon: Layers, title: 'Multiple Formats', desc: 'STEP, STL, SolidWorks, AutoCAD and more in every package.' },
  { icon: Globe, title: 'Universal Compatibility', desc: 'Designed to work with all major CAD platforms worldwide.' },
  { icon: Lock, title: 'Safe Checkout', desc: 'Powered by Razorpay with industry-standard encryption.' },
  { icon: Package, title: 'Bundle Downloads', desc: 'Download all purchased designs as a single ZIP archive.' },
];

const CATEGORIES = [
  { label: 'Mechanical', emoji: '⚙️', color: '#6c63ff' },
  { label: 'Architecture', emoji: '🏛️', color: '#00d4ff' },
  { label: 'Automotive', emoji: '🚗', color: '#ff6b6b' },
  { label: 'Aerospace', emoji: '🚀', color: '#00c851' },
  { label: 'Electronics', emoji: '🔌', color: '#ffbb33' },
  { label: 'Medical', emoji: '🩺', color: '#ff69b4' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products?limit=6&sort=newest')
      .then(r => setFeatured(r.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d1a] to-[#0a0a0f]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#6c63ff]/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#00d4ff]/8 blur-[100px]" />

        <div className="relative container-wide px-4 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6c63ff]/10 border border-[#6c63ff]/20 text-sm text-[#8b85ff] mb-8 animate-fade-in">
            <Star size={14} className="fill-[#6c63ff] text-[#6c63ff]" />
            Premium CAD Design Marketplace
            <ChevronRight size={14} />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#e8e8f0] mb-6 leading-tight">
            Professional CAD Designs
            <br />
            <span className="gradient-text">Ready to Download</span>
          </h1>

          <p className="text-lg md:text-xl text-[#8888aa] max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover thousands of premium STEP, STL, SolidWorks, and AutoCAD files.
            Buy, download, and build — instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="btn-primary text-base px-8 py-3 animate-pulse-glow">
              Browse Designs <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-ghost text-base px-8 py-3">
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16">
            {[
              { value: '500+', label: 'CAD Designs' },
              { value: '10K+', label: 'Downloads' },
              { value: '99%', label: 'Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black gradient-text">{value}</div>
                <div className="text-xs text-[#8888aa] mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-[#0d0d1a]">
        <div className="container-wide px-4">
          <SectionHeader
            title="Browse by Category"
            subtitle="Find the perfect CAD designs for your industry"
            action={
              <Link to="/products" className="btn-ghost text-sm">
                All Designs <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(({ label, emoji, color }) => (
              <Link
                key={label}
                to={`/products?category=${label}`}
                className="glass-card p-5 text-center hover:border-[#6c63ff]/30 transition-all group"
              >
                <div
                  className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block"
                  style={{ filter: 'drop-shadow(0 0 8px rgba(108,99,255,0.4))' }}
                >
                  {emoji}
                </div>
                <div className="text-sm font-semibold text-[#e8e8f0]">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-wide px-4">
          <SectionHeader
            title="Featured Designs"
            subtitle="Our latest and most popular CAD files"
            action={
              <Link to="/products" className="btn-ghost text-sm">
                View All <ArrowRight size={14} />
              </Link>
            }
          />
          {loading ? (
            <LoadingPage />
          ) : featured.length === 0 ? (
            <EmptyState
              icon={Box}
              title="No products yet"
              description="Check back soon — new designs are added regularly."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-[#0d0d1a]">
        <div className="container-wide px-4">
          <SectionHeader
            title="Why CADMarket?"
            subtitle="Built for engineers who demand quality and security"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 group hover:border-[#6c63ff]/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#6c63ff]/10 border border-[#6c63ff]/20 flex items-center justify-center mb-4 group-hover:bg-[#6c63ff]/20 transition-colors">
                  <Icon size={22} className="text-[#6c63ff]" />
                </div>
                <h3 className="font-semibold text-[#e8e8f0] mb-2">{title}</h3>
                <p className="text-sm text-[#8888aa] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide px-4">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#6c63ff]/10 via-transparent to-[#00d4ff]/5" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-[#e8e8f0] mb-4">
                Ready to start building?
              </h2>
              <p className="text-[#8888aa] mb-8 max-w-xl mx-auto">
                Thousands of professional CAD designs available for instant download. No subscription — pay only for what you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products" className="btn-primary text-base px-8 py-3">
                  <Download size={18} /> Browse & Download
                </Link>
                <Link to="/contact" className="btn-secondary text-base px-8 py-3">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
