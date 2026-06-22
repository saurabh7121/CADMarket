import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { LoadingPage, EmptyState, SectionHeader } from '../components/UI';
import {
  ArrowRight, Box, Download,
  Package, ChevronRight, Star
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Mechanical',    emoji: '⚙️' },
  { label: 'Architecture',  emoji: '🏛️' },
  { label: 'Automotive',    emoji: '🚗' },
  { label: 'Aerospace',     emoji: '🚀' },
  { label: 'Electronics',   emoji: '🔌' },
  { label: 'Medical',       emoji: '🩺' },
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
        {/* Background */}
        <div className="absolute inset-0 bg-[#000000]" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <div className="relative container-wide text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-white/5 border border-[#404040] text-sm text-[#a3a3a3] mb-8 animate-fade-in">
            <Star size={14} className="fill-[#e5e5e5] text-[#e5e5e5]" />
            Premium CAD Design Marketplace
            <ChevronRight size={14} />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#e5e5e5] mb-6 leading-tight">
            Professional CAD Designs
            <br />
            <span className="text-white">Ready to Download</span>
          </h1>

          <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-10 leading-relaxed">
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


        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-[#111111]">
        <div className="container-wide">
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
            {CATEGORIES.map(({ label, emoji }) => (
              <Link
                key={label}
                to={`/products?category=${label}`}
                className="glass-card p-5 text-center hover:border-white/25 transition-all group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {emoji}
                </div>
                <div className="text-sm font-semibold text-[#e5e5e5]">{label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-wide">
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


      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="glass-card p-10 md:p-16 text-center relative overflow-hidden">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-black text-[#e5e5e5] mb-4">
                Ready to start building?
              </h2>
              <p className="text-[#a3a3a3] mb-8 max-w-xl mx-auto">
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
