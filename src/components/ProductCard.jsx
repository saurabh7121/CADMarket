import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star, Download } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK = 'https://placehold.co/400x300/12121a/6c63ff?text=CAD+Design';

export default function ProductCard({ product }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product._id);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link to={`/products/${product._id}`} className="product-card glass-card overflow-hidden block group">
      {/* Thumbnail */}
      <div className="relative overflow-hidden aspect-[4/3] bg-[#12121a]">
        <img
          src={product.thumbnail || FALLBACK}
          alt={product.title}
          onError={e => { e.target.src = FALLBACK; }}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
          <span className="flex items-center gap-1 text-xs text-[#e8e8f0]">
            <Eye size={12} /> Quick View
          </span>
        </div>
        {/* Category badge */}
        {product.category && (
          <div className="absolute top-2 left-2">
            <span className="badge badge-primary">{product.category}</span>
          </div>
        )}
        {/* File formats */}
        {product.fileFormats?.length > 0 && (
          <div className="absolute top-2 right-2 flex gap-1">
            {product.fileFormats.slice(0, 2).map(f => (
              <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 bg-[#0a0a0f]/80 text-[#00d4ff] rounded border border-[#00d4ff]/20">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-[#e8e8f0] line-clamp-1 mb-1 group-hover:text-[#8b85ff] transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-[#8888aa] line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < 4 ? 'text-[#ffbb33] fill-[#ffbb33]' : 'text-[#2a2a3e]'}
              />
            ))}
          </div>
          <span className="text-xs text-[#8888aa]">
            <Download size={10} className="inline mr-0.5" />
            {product.downloads || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg gradient-text">
            ₹{(product.price || 0).toLocaleString('en-IN')}
          </span>
          <button
            onClick={handleAdd}
            disabled={inCart}
            className={`btn-primary py-1.5 px-3 text-xs ${inCart ? 'opacity-60 cursor-default' : ''}`}
          >
            <ShoppingCart size={13} />
            {inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
