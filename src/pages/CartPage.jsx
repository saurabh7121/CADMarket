import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/UI';
import { ShoppingCart, Trash2, ArrowRight, ShieldCheck, Plus } from 'lucide-react';

const FALLBACK = 'https://placehold.co/80x60/12121a/6c63ff?text=CAD';

export default function CartPage() {
  const { items, removeItem, clearCart, total, count } = useCart();

  if (count === 0) {
    return (
      <div className="min-h-screen pt-24">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Browse our collection and add CAD designs you love."
          action={
            <Link to="/products" className="btn-primary">
              <Plus size={16} /> Browse Designs
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container-wide px-4 py-8">
        <h1 className="text-3xl font-black text-[#e8e8f0] mb-8">
          Shopping Cart
          <span className="ml-3 text-lg text-[#8888aa] font-normal">({count} {count === 1 ? 'item' : 'items'})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item._id} className="glass-card p-4 flex items-center gap-4 group">
                <Link to={`/products/${item._id}`} className="shrink-0">
                  <img
                    src={item.thumbnail || FALLBACK}
                    alt={item.title}
                    onError={e => { e.target.src = FALLBACK; }}
                    className="w-20 h-14 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item._id}`}>
                    <h3 className="font-semibold text-sm text-[#e8e8f0] truncate hover:text-[#8b85ff] transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <span className="badge badge-primary mt-1">{item.category}</span>
                  {item.fileFormats?.length > 0 && (
                    <p className="text-xs text-[#8888aa] mt-1">{item.fileFormats.join(', ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-bold gradient-text">
                    ₹{(item.price || 0).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="p-1.5 rounded-lg text-[#8888aa] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-2">
              <Link to="/products" className="btn-ghost text-sm">
                ← Continue Shopping
              </Link>
              <button onClick={clearCart} className="text-sm text-[#8888aa] hover:text-[#ff6b6b] transition-colors">
                Clear Cart
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="glass-card p-6 space-y-4">
              <h2 className="font-bold text-lg text-[#e8e8f0]">Order Summary</h2>

              {items.map(item => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span className="text-[#8888aa] truncate mr-2">{item.title}</span>
                  <span className="text-[#e8e8f0] shrink-0">₹{(item.price || 0).toLocaleString('en-IN')}</span>
                </div>
              ))}

              <hr className="divider" />

              <div className="flex items-center justify-between font-bold text-lg">
                <span className="text-[#e8e8f0]">Total</span>
                <span className="gradient-text">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Link to="/checkout" className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-base">
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <div className="flex items-center gap-2 text-xs text-[#8888aa] justify-center">
                <ShieldCheck size={13} className="text-[#00c851]" />
                Secured by Razorpay · 256-bit SSL
              </div>
            </div>

            {/* Info */}
            <div className="glass-card p-4 text-sm space-y-2 text-[#8888aa]">
              <p>✅ Digital download — no shipping</p>
              <p>✅ Instant access after payment</p>
              <p>✅ Lifetime access to purchased files</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
