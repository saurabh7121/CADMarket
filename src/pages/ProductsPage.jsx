import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import ProductCard from '../components/ProductCard';
import { EmptyState, Spinner } from '../components/UI';
import { Search, SlidersHorizontal, X, Box, ChevronDown } from 'lucide-react';

const CATEGORIES = ['All', 'Mechanical', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical', 'Industrial'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [maxPrice, setMaxPrice] = useState(50000);

  const limit = 12;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page,
        limit,
        sort,
        ...(search && { search }),
        ...(category !== 'All' && { category }),
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
      const r = await api.get(`/products?${q}`);
      setProducts(r.data.products || []);
      setTotal(r.data.total || 0);
      if (r.data.maxPrice) setMaxPrice(r.data.maxPrice);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, sort, priceRange]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Sync URL param on initial load
  useEffect(() => {
    const s = params.get('search');
    const c = params.get('category');
    if (s) setSearch(s);
    if (c) setCategory(c);
  }, []); // eslint-disable-line

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('All');
    setPriceRange([0, maxPrice]);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);
  const hasFilters = search || category !== 'All' || priceRange[0] > 0 || priceRange[1] < maxPrice;

  return (
    <div className="min-h-screen pt-20">
      <div className="container-wide px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#e8e8f0] mb-1">CAD Designs</h1>
          <p className="text-[#8888aa]">{total > 0 ? `${total} designs available` : 'Browse our collection'}</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterPanel
              search={search} setSearch={setSearch}
              category={category} setCategory={v => { setCategory(v); setPage(1); }}
              sort={sort} setSort={v => { setSort(v); setPage(1); }}
              priceRange={priceRange} setPriceRange={v => { setPriceRange(v); setPage(1); }}
              maxPrice={maxPrice}
              onReset={resetFilters}
              hasFilters={hasFilters}
              onSearch={handleSearch}
            />
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden btn-ghost text-sm"
              >
                <SlidersHorizontal size={14} /> Filters
                {hasFilters && <span className="w-2 h-2 rounded-full bg-[#6c63ff] ml-1" />}
              </button>
              <div className="hidden lg:block" />
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-[#8888aa] whitespace-nowrap">{total} results</span>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => { setSort(e.target.value); setPage(1); }}
                    className="input-field text-xs py-1.5 pr-8 appearance-none"
                  >
                    {SORT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8888aa] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : products.length === 0 ? (
              <EmptyState
                icon={Box}
                title="No designs found"
                description="Try adjusting your filters or search query."
                action={
                  <button onClick={resetFilters} className="btn-secondary text-sm">
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-[#6c63ff] text-white'
                          : 'bg-white/5 text-[#8888aa] hover:text-[#e8e8f0] border border-[#2a2a3e]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="btn-ghost text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto w-72 h-full bg-[#0a0a0f] border-l border-[#2a2a3e] p-5 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold">Filters</h3>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={18} className="text-[#8888aa]" />
              </button>
            </div>
            <FilterPanel
              search={search} setSearch={setSearch}
              category={category} setCategory={v => { setCategory(v); setPage(1); setFiltersOpen(false); }}
              sort={sort} setSort={v => { setSort(v); setPage(1); }}
              priceRange={priceRange} setPriceRange={v => { setPriceRange(v); setPage(1); }}
              maxPrice={maxPrice}
              onReset={() => { resetFilters(); setFiltersOpen(false); }}
              hasFilters={hasFilters}
              onSearch={e => { handleSearch(e); setFiltersOpen(false); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({ search, setSearch, category, setCategory, sort, setSort, priceRange, setPriceRange, maxPrice, onReset, hasFilters, onSearch }) {
  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={onSearch}>
        <label className="block text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">Search</label>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888aa]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="input-field pl-8 text-sm py-2"
          />
        </div>
      </form>

      {/* Categories */}
      <div>
        <label className="block text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">Category</label>
        <div className="space-y-1">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === c
                  ? 'bg-[#6c63ff]/15 text-[#8b85ff] border border-[#6c63ff]/30'
                  : 'text-[#8888aa] hover:text-[#e8e8f0] hover:bg-white/5'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">
          Price Range
        </label>
        <div className="text-sm text-[#e8e8f0] mb-2">
          ₹{priceRange[0].toLocaleString('en-IN')} – ₹{priceRange[1].toLocaleString('en-IN')}
        </div>
        <input
          type="range"
          min={0}
          max={maxPrice}
          step={100}
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], +e.target.value])}
          className="w-full"
        />
      </div>

      {/* Reset */}
      {hasFilters && (
        <button onClick={onReset} className="w-full btn-ghost text-sm">
          <X size={13} /> Clear Filters
        </button>
      )}
    </div>
  );
}
