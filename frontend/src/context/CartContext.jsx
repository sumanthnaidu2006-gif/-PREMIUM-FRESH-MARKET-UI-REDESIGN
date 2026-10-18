import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'fresh_market_cart';
const SAVED_STORAGE_KEY = 'fresh_market_saved_for_later';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedForLater, setSavedForLater] = useState(() => {
    try {
      const saved = localStorage.getItem(SAVED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedForLater));
    } catch (e) {
      console.error('Error saving saved-for-later items:', e);
    }
  }, [savedForLater]);

  const addToCart = (product, quantity = 1) => {
    const productId = product.id || product.coffeeId;
    setCartItems((prev) => {
      const index = prev.findIndex((item) => (item.product.id || item.product.coffeeId) === productId);
      if (index >= 0) {
        const updated = [...prev];
        const newQty = updated[index].quantity + quantity;
        updated[index] = {
          ...updated[index],
          quantity: newQty,
        };
        showToast(`Updated quantity of "${product.name}" (${newQty} in cart)`, 'success');
        return updated;
      } else {
        showToast(`Added "${product.name}" to cart`, 'success');
        return [...prev, { product, quantity, addedAt: new Date().toISOString() }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        (item.product.id || item.product.coffeeId) === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const itemToRemove = prev.find((item) => (item.product.id || item.product.coffeeId) === productId);
      if (itemToRemove) {
        showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
      }
      return prev.filter((item) => (item.product.id || item.product.coffeeId) !== productId);
    });
  };

  const saveForLaterItem = (productId) => {
    const item = cartItems.find((i) => (i.product.id || i.product.coffeeId) === productId);
    if (!item) return;

    setCartItems((prev) => prev.filter((i) => (i.product.id || i.product.coffeeId) !== productId));
    setSavedForLater((prev) => {
      const exists = prev.some((i) => (i.product.id || i.product.coffeeId) === productId);
      if (exists) return prev;
      return [...prev, { ...item, savedAt: new Date().toISOString() }];
    });
    showToast(`Saved "${item.product.name}" for later`, 'info');
  };

  const moveToCart = (productId) => {
    const item = savedForLater.find((i) => (i.product.id || i.product.coffeeId) === productId);
    if (!item) return;

    setSavedForLater((prev) => prev.filter((i) => (i.product.id || i.product.coffeeId) !== productId));
    addToCart(item.product, item.quantity);
  };

  const removeFromSaved = (productId) => {
    setSavedForLater((prev) => prev.filter((i) => (i.product.id || i.product.coffeeId) !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Cart merging when user logs in with existing cart
  const mergeGuestCart = (serverCartItems = []) => {
    if (!serverCartItems || serverCartItems.length === 0) return;
    setCartItems((prev) => {
      const mergedMap = new Map();
      prev.forEach((item) => mergedMap.set(item.product.id || item.product.coffeeId, item));
      serverCartItems.forEach((item) => {
        const id = item.product.id || item.product.coffeeId;
        if (mergedMap.has(id)) {
          const current = mergedMap.get(id);
          mergedMap.set(id, { ...current, quantity: current.quantity + item.quantity });
        } else {
          mergedMap.set(id, item);
        }
      });
      return Array.from(mergedMap.values());
    });
  };

  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      const price = Number(item.product.price) || 0;
      return acc + price * item.quantity;
    }, 0);

    const totalOriginal = cartItems.reduce((acc, item) => {
      const orig = Number(item.product.originalPrice) || Number(item.product.price) || 0;
      return acc + orig * item.quantity;
    }, 0);

    const discount = Math.max(0, totalOriginal - subtotal);
    // Free shipping threshold: $50
    const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
    const taxRate = 0.0825; // 8.25% standard grocery/sales tax estimate
    const tax = subtotal * taxRate;
    const total = subtotal + shipping + tax;
    const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return {
      subtotal,
      discount,
      shipping,
      tax,
      total,
      totalItemsCount,
      freeShippingThreshold: 50,
      freeShippingDiff: Math.max(0, 50 - subtotal),
    };
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        savedForLater,
        addToCart,
        updateQuantity,
        removeFromCart,
        saveForLater: saveForLaterItem,
        moveToCart,
        removeFromSaved,
        clearCart,
        mergeGuestCart,
        ...calculations,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
