import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);
const WISHLIST_STORAGE_KEY = 'fresh_market_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  }, [wishlist]);

  const toggleWishlist = (product) => {
    const productId = product.id || product.coffeeId;
    const exists = wishlist.some((item) => (item.id || item.coffeeId) === productId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item.id || item.coffeeId) !== productId));
      showToast(`Removed "${product.name}" from your wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Added "${product.name}" to your wishlist`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item.id || item.coffeeId) === productId);
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => (item.id || item.coffeeId) !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
