import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cadmarket_cart') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cadmarket_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems(prev => {
      if (prev.find(i => i._id === product._id)) return prev;
      return [...prev, { ...product }];
    });
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setItems([]);

  const isInCart = (id) => items.some(i => i._id === id);

  const total = items.reduce((sum, i) => sum + (i.price || 0), 0);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
