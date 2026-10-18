import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { deleteAccessToken } from '../utils/apis';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);
const ORDERS_STORAGE_KEY = 'fresh_market_orders';
const LOCATION_STORAGE_KEY = 'fresh_market_delivery_location';
const USER_STORAGE_KEY = 'fresh_market_customer_profile';

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    fullName: 'Sophia Bennett',
    street: '742 Evergreen Terrace',
    apartment: 'Apt 4B',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    phone: '+1 (206) 555-0142',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Sophia Bennett (Office)',
    street: '500 Pine Street',
    apartment: 'Suite 1200',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    phone: '+1 (206) 555-0199',
    isDefault: false,
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ord-84920',
    orderNumber: 'FM-2026-84920',
    date: '2026-10-14T14:32:00.000Z',
    status: 'Delivered',
    items: [
      {
        id: 'prod-fg-01',
        name: 'Organic Hass Avocados (Pack of 4)',
        brand: 'Verde Orchard',
        price: 4.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
      },
      {
        id: 'prod-sb-01',
        name: 'Ethiopian Yirgacheffe Single-Origin (340g)',
        brand: 'Roast & Origin',
        price: 16.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 26.97,
    shipping: 0.00,
    tax: 2.22,
    discount: 5.00,
    total: 29.19,
    deliveryAddress: INITIAL_ADDRESSES[0],
    shippingMethod: {
      id: 'express',
      name: 'Fresh Market Express',
      deliveryTime: 'Today, 2 Hours',
      price: 0,
      description: 'Handled in temperature-controlled chill-packs',
    },
    paymentMethod: {
      type: 'Demo Card (Visa)',
      last4: '4242',
      status: 'Demo Approved',
    },
  },
];

export const AuthProvider = ({ children }) => {
  const oidcAuth = useAuth();
  const { showToast } = useToast();

  const [demoUser, setDemoUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        name: 'Sophia Bennett',
        email: 'sophia.bennett@freshmarket.com',
        phone: '+1 (206) 555-0142',
        addresses: INITIAL_ADDRESSES,
      };
    } catch {
      return {
        name: 'Sophia Bennett',
        email: 'sophia.bennett@freshmarket.com',
        phone: '+1 (206) 555-0142',
        addresses: INITIAL_ADDRESSES,
      };
    }
  });

  const [deliveryLocation, setDeliveryLocation] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        label: 'Deliver to Seattle 98101',
      };
    } catch {
      return {
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        label: 'Deliver to Seattle 98101',
      };
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(demoUser));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }, [demoUser]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(deliveryLocation));
    } catch (e) {
      console.error('Error saving location:', e);
    }
  }, [deliveryLocation]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  // Cognito sign-out redirect
  const signOutCognito = () => {
    const clientId = "6fjfrlaup7oph5lhf1q8q6pnp4";
    const logoutUri = "https://d1vsslyvj5i9m6.cloudfront.net";
    const cognitoDomain = "https://us-east-1rxq7q3klm.auth.us-east-1.amazoncognito.com";
    deleteAccessToken();
    if (oidcAuth && oidcAuth.removeUser) {
      oidcAuth.removeUser();
    }
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const signInCognito = () => {
    if (oidcAuth && oidcAuth.signinRedirect) {
      oidcAuth.signinRedirect().catch((err) => {
        console.warn('Cognito redirect caught error:', err);
        showToast('Cognito sign-in opened. In local mode, you are authenticated as customer.', 'info');
      });
    }
  };

  const addAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: `addr-${Date.now()}`,
      isDefault: demoUser.addresses.length === 0 || newAddress.isDefault,
    };

    setDemoUser((prev) => {
      let updatedList = [...prev.addresses];
      if (addressWithId.isDefault) {
        updatedList = updatedList.map((a) => ({ ...a, isDefault: false }));
      }
      return {
        ...prev,
        addresses: [...updatedList, addressWithId],
      };
    });
    showToast('Delivery address saved successfully', 'success');
  };

  const setDefaultAddress = (addressId) => {
    setDemoUser((prev) => ({
      ...prev,
      addresses: prev.addresses.map((a) => ({
        ...a,
        isDefault: a.id === addressId,
      })),
    }));
  };

  const deleteAddress = (addressId) => {
    setDemoUser((prev) => ({
      ...prev,
      addresses: prev.addresses.filter((a) => a.id !== addressId),
    }));
    showToast('Address removed', 'info');
  };

  const updateLocation = (city, state, postalCode) => {
    const newLoc = {
      city,
      state,
      postalCode,
      label: `Deliver to ${city} ${postalCode}`,
    };
    setDeliveryLocation(newLoc);
    showToast(`Delivery location set to ${city}, ${postalCode}`, 'success');
  };

  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `FM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      status: 'Processing',
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Order status updated to ${newStatus}`, 'success');
  };

  const isAuthenticated = Boolean(oidcAuth?.isAuthenticated || demoUser?.email);
  const currentUser = oidcAuth?.isAuthenticated && oidcAuth?.user?.profile
    ? {
        name: oidcAuth.user.profile.name || oidcAuth.user.profile.email?.split('@')[0] || demoUser.name,
        email: oidcAuth.user.profile.email || demoUser.email,
        phone: demoUser.phone,
        addresses: demoUser.addresses,
      }
    : demoUser;

  return (
    <AuthContext.Provider
      value={{
        oidcAuth,
        isAuthenticated,
        user: currentUser,
        isAdmin,
        setIsAdmin,
        signInCognito,
        signOutCognito,
        deliveryLocation,
        updateLocation,
        addresses: currentUser.addresses,
        addAddress,
        setDefaultAddress,
        deleteAddress,
        orders,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAppAuth must be used within an AuthProvider');
  }
  return context;
};
