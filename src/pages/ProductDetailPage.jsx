import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { useCart } from '../context/CartContext';
import ImageGallery from '../components/ImageGallery';
import ProductCard from '../components/ProductCard';
import { LoadingPage, EmptyState } from '../components/UI';
import {
  ShoppingCart, Download, Star, Check, FileArchive,
  Layers, ArrowLeft, Share2, Package
} from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem, isInCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => {
        setProduct(r.data.product);
        return api.get(`/products?category=${r.data.product.category}&limit=4`);
      })
      .then(r => setRelated((r.data.products || []).filter(p => p._id !== id).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingPage />;
  if (!product) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <EmptyState title="Product not found" description="This design may have been removed." />
    </div>
  );

  const inCart = isInCart(product._id);
  const allImages = [product.thumbnail, ...(product.previewImages || [])].filter(Boolean);

  return (
    <div className="min-h-screen pt-20">
      <div className="container-wide px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#8888aa] mb-6">
          <Link to="/products" className="flex items-center gap-1 hover:text-[#e8e8f0] transition-colors">
            <ArrowLeft size={14} /> All Designs
          </Link>
          <span>/</span>
          <span className="text-[#e8e8f0] truncate">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Gallery */}
          <div>
            <ImageGallery images={allImages} />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Category & rating */}
            <div className="flex items-center gap-3">
              <span className="badge badge-primary">{product.category}</span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < 4 ? 'text-[#ffbb33] fill-[#ffbb33]' : 'text-[#2a2a3e]'} />
                ))}
              </div>
              <span className="text-xs text-[#8888aa]">{product.downloads || 0} downloads</span>
            </div>

            <h1 className="text-3xl font-black text-[#e8e8f0] leading-tight">{product.title}</h1>

            <p className="text-[#8888aa] leading-relaxed">{product.description}</p>

            {/* File formats */}
            {product.fileFormats?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#8888aa] uppercase tracking-wider mb-2">Included Formats</p>
                <div className="flex flex-wrap gap-2">
                  {product.fileFormats.map(f => (
                    <span key={f} className="flex items-center gap-1.5 px-3 py-1 bg-[#00d4ff]/10 border border-[#00d4ff]/20 rounded-lg text-xs font-bold text-[#00d4ff]">
                      <FileArchive size={11} /> {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Included features */}
            <div className="space-y-2">
              {[
                'Fully parametric design',
                'Detailed assembly instructions',
                'Compatible with major CAD tools',
                'Instant download after purchase',
                'Lifetime access to your files',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-[#8888aa]">
                  <Check size={14} className="text-[#00c851] shrink-0" /> {item}
                </div>
              ))}
            </div>

            {/* Price & CTA */}
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black gradient-text">
                  ₹{(product.price || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-[#8888aa] mb-1">one-time</span>
              </div>

              <button
                onClick={() => addItem(product)}
                disabled={inCart}
                className={`w-full btn-primary py-3 text-base ${inCart ? 'opacity-70 cursor-default' : ''}`}
              >
                {inCart ? (
                  <><Check size={18} /> Added to Cart</>
                ) : (
                  <><ShoppingCart size={18} /> Add to Cart</>
                )}
              </button>

              {inCart && (
                <Link to="/cart" className="w-full btn-secondary py-2.5 flex items-center justify-center gap-2">
                  <Package size={16} /> Go to Cart
                </Link>
              )}

              <p className="text-xs text-center text-[#8888aa]">
                🔒 Secure payment via Razorpay · Instant digital delivery
              </p>
            </div>

            {/* Share */}
            <button
              onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
              className="flex items-center gap-2 text-sm text-[#8888aa] hover:text-[#e8e8f0] transition-colors"
            >
              <Share2 size={14} /> Share this design
            </button>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#e8e8f0] mb-6">Related Designs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
