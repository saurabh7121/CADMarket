import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { LoadingPage, EmptyState, SectionHeader } from '../components/UI';
import {
  ArrowRight, Box, Download,
  Package, ChevronLeft, ChevronRight, Star
} from 'lucide-react';

const CATEGORIES = [
  { label: 'Mechanical',    emoji: '⚙️' },
  { label: 'Architecture',  emoji: '🏛️' },
  { label: 'Automotive',    emoji: '🚗' },
  { label: 'Aerospace',     emoji: '🚀' },
  { label: 'Electronics',   emoji: '🔌' },
  { label: 'Medical',       emoji: '🩺' },
  { label: 'Industrial',    emoji: '🏭' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoriesRef = useRef(null);

  const scrollCategories = (direction) => {
    if (categoriesRef.current) {
      const { scrollLeft, clientWidth } = categoriesRef.current;
      const scrollAmount = clientWidth * 0.6;
      categoriesRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    api.get('/products?isFeatured=true&limit=6&sort=newest')
      .then(r => {
        if (r.data.products && r.data.products.length > 0) {
          setFeatured(r.data.products);
        } else {
          api.get('/products?limit=6&sort=newest')
            .then(res => setFeatured(res.data.products || []))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Immersive Combined Hero & Featured Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-28 pb-20">
        {/* Background */}
        <div className="absolute inset-0 bg-[#000000]" />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-80" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* CAD Blueprint / Annotation Details */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20 text-[10px] font-mono text-[#a3a3a3] select-none">
          {/* Top Left drafting spec */}
          <div className="absolute top-6 left-6 flex flex-col gap-1 border-l border-t border-[#404040]/30 pt-2 pl-2">
            <span>SYS_CORE: v2.82</span>
            <span>UNITS: METRIC (MM)</span>
            <span>GRID_SPACING: 40.00</span>
          </div>

          {/* Top Right drafting spec */}
          <div className="absolute top-6 right-6 flex flex-col items-end gap-1 border-r border-t border-[#404040]/30 pt-2 pr-2">
            <span>PROJ_MODE: ISOMETRIC</span>
            <span>VIEWPORT: [3D_WIREFRAME]</span>
            <span>COORDS: X-Y-Z ACTIVE</span>
          </div>

          {/* Bottom Left drafting spec */}
          <div className="absolute bottom-6 left-6 flex flex-col gap-1 border-l border-b border-[#404040]/30 pb-2 pl-2">
            <span>TOLERANCE: ISO-2768-M</span>
            <span>MATERIAL: EN_10025_STEEL</span>
            <span>REVISION: R01</span>
          </div>

          {/* Bottom Right drafting spec */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-1 border-r border-b border-[#404040]/30 pb-2 pr-2">
            <span>SCALE: 1:1</span>
            <span>DRAWN BY: CADMARKET_ENGINEERING</span>
            <span>SHEET: 1 OF 1</span>
          </div>

          {/* Small Crosshairs scattered at grid points */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 text-[#404040]/50 font-light text-base">+</div>
          <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 text-[#404040]/50 font-light text-base">+</div>
          <div className="absolute top-2/3 left-1/5 -translate-x-1/2 -translate-y-1/2 text-[#404040]/50 font-light text-base">+</div>
          <div className="absolute top-2/3 right-1/5 translate-x-1/2 -translate-y-1/2 text-[#404040]/50 font-light text-base">+</div>

          {/* Dimension ruler markings on the side edges */}
          <div className="absolute left-2 top-1/3 bottom-1/3 border-l border-[#404040]/30 flex flex-col justify-between py-10 pl-1">
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute left-3 -top-1.5 text-[8px]">0</span></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute left-3 -top-1.5 text-[8px]">100</span></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute left-3 -top-1.5 text-[8px]">200</span></span>
          </div>

          <div className="absolute right-2 top-1/3 bottom-1/3 border-r border-[#404040]/30 flex flex-col justify-between py-10 pr-1 items-end">
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute right-3 -top-1.5 text-[8px]">Z+</span></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute right-3 -top-1.5 text-[8px]">Y+</span></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-1 bg-[#404040]/30"></span>
            <span className="h-[1px] w-2 bg-[#404040]/30 relative"><span className="absolute right-3 -top-1.5 text-[8px]">X+</span></span>
          </div>

          {/* Center viewport crosshair guide */}
          <div className="absolute top-[18%] left-1/2 -translate-x-1/2 w-10 h-10 border border-dashed border-[#404040]/20 rounded-full flex items-center justify-center">
            <span className="text-[#404040]/40 text-xs">+</span>
          </div>
        </div>

        <div className="relative container-wide text-center z-10 w-full">
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

          <p className="text-lg md:text-xl text-[#a3a3a3] max-w-2xl mx-auto mb-16 leading-relaxed">
            Discover thousands of premium STEP, STL, SolidWorks, and AutoCAD files.
            Buy, download, and build — instantly.
          </p>

          {/* Featured Designs Container */}
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Featured Designs</h2>
              <p className="text-sm text-[#a3a3a3]">Our curated selection of top-tier CAD models</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            ) : featured.length === 0 ? (
              <EmptyState
                icon={Box}
                title="No designs available"
                description="Check back soon — new designs are added regularly."
              />
            ) : (
              <div>
                <div className={
                  featured.length === 1
                    ? "flex justify-center"
                    : featured.length === 2
                    ? "flex flex-col sm:flex-row justify-center gap-6"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
                }>
                  {featured.map(p => (
                    <div key={p._id} className={featured.length < 3 ? 'w-full max-w-sm' : ''}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {/* Browse More Designs Button */}
                <div className="mt-12 flex justify-center">
                  <Link to="/products" className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 group">
                    Browse More Designs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section - Below Combined Hero/Featured */}
      <section className="section-padding bg-[#0c0c0f] border-t border-[#1f1f2e]">
        <div className="container-wide">
          <SectionHeader
            title="Browse by Category"
            subtitle="Find the perfect CAD designs for your industry"
            action={
              <div className="flex items-center gap-2">
                <Link to="/products" className="btn-ghost text-sm mr-2 hidden sm:inline-flex group">
                  All Designs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <button
                  onClick={() => scrollCategories('left')}
                  className="w-8 h-8 rounded-full bg-white/5 border border-[#2a2a3e] flex items-center justify-center text-white hover:bg-white/15 transition-all active:scale-95"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => scrollCategories('right')}
                  className="w-8 h-8 rounded-full bg-white/5 border border-[#2a2a3e] flex items-center justify-center text-white hover:bg-white/15 transition-all active:scale-95"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            }
          />
          <div className="relative">
            <div
              ref={categoriesRef}
              className="flex overflow-x-auto gap-4 pb-4 scrollbar-none scroll-smooth snap-x snap-mandatory"
            >
              {CATEGORIES.map(({ label, emoji }) => (
                <Link
                  key={label}
                  to={`/products?category=${label}`}
                  className="glass-card p-6 text-center hover:border-white/25 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ease-out group min-w-[160px] sm:min-w-[200px] flex-shrink-0 snap-start select-none"
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 inline-block">
                    {emoji}
                  </div>
                  <div className="text-sm font-semibold text-[#e5e5e5]">{label}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
