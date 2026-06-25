import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FALLBACK = 'https://placehold.co/400x300/171717/e5e5e5?text=CAD+Design';

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
      <div className="relative overflow-hidden aspect-[4/3] bg-white">
        <img
          src={product.thumbnail || FALLBACK}
          alt={product.title}
          onError={e => { e.target.src = FALLBACK; }}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
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
              <span key={f} className="text-[9px] font-bold px-1.5 py-0.5 bg-[#000000]/80 text-[#a3a3a3] rounded border border-[#404040]">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-[#e5e5e5] line-clamp-1 mb-1 group-hover:text-white transition-colors">
          {product.title}
        </h3>
        <p className="text-xs text-[#a3a3a3] line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={10}
                className={i < 4 ? 'text-[#e5e5e5] fill-[#e5e5e5]' : 'text-[#404040]'}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-lg text-white">
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
