import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { deleteAccessToken } from '../utils/apis';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const USERS_STORAGE_KEY = 'fresh_market_registered_users';
const CURRENT_USER_KEY = 'fresh_market_current_user';
const ORDERS_STORAGE_KEY = 'fresh_market_orders';
const LOCATION_STORAGE_KEY = 'fresh_market_delivery_location';
const OLD_USER_STORAGE_KEY = 'fresh_market_customer_profile';

export const INITIAL_ADDRESSES = [
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

export const DEFAULT_DEMO_ACCOUNTS = [
  {
    id: 'user-demo-customer',
    name: 'Sophia Bennett',
    email: 'sophia.bennett@freshmarket.com',
    password: 'password123',
    phone: '+1 (206) 555-0142',
    role: 'customer',
    addresses: INITIAL_ADDRESSES,
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-demo-admin',
    name: 'Fresh Market Admin',
    email: 'admin@freshmarket.com',
    password: 'admin123',
    phone: '+1 (206) 555-0100',
    role: 'admin',
    addresses: [
      {
        id: 'addr-admin-1',
        fullName: 'Store Operations',
        street: '100 Pike Place Market',
        apartment: 'Suite 400',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
        phone: '+1 (206) 555-0100',
        isDefault: true,
      },
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ord-84920',
    orderNumber: 'FM-2026-84920',
    date: '2026-10-14T14:32:00.000Z',
    status: 'Delivered',
    userEmail: 'sophia.bennett@freshmarket.com',
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

  // 1. Registered Users Database (Persistent in LocalStorage)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading registered users:', e);
    }
    return DEFAULT_DEMO_ACCOUNTS;
  });

  // 2. Active Session / Current User
  // Defaults to null unless the user explicitly logs in or previously logged in.
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      // Clear legacy hardcoded Sofia auto-login if the user never explicitly signed in
      const legacyUser = localStorage.getItem(OLD_USER_STORAGE_KEY);
      const stored = localStorage.getItem(CURRENT_USER_KEY);

      if (stored) {
        return JSON.parse(stored);
      }
      // If only legacy user exists without explicit current user session, clean it up so default isn't forced to Sofia
      if (legacyUser) {
        localStorage.removeItem(OLD_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Error reading current user session:', e);
    }
    return null;
  });

  // 3. Delivery Location
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

  // 4. Orders Store
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(ORDERS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Save registered users list
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(registeredUsers));
    } catch (e) {
      console.error('Error saving registered users:', e);
    }
  }, [registeredUsers]);

  // Save or clear active session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Error syncing current user session:', e);
    }
  }, [currentUser]);

  // Save delivery location
  useEffect(() => {
    try {
      localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(deliveryLocation));
    } catch (e) {
      console.error('Error saving location:', e);
    }
  }, [deliveryLocation]);

  // Save orders
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders:', e);
    }
  }, [orders]);

  // Authenticate / Register a New Account
  const signUp = async ({ name, email, password, phone = '', address = null, role = 'customer' }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanName = (name || '').trim();

    if (!cleanName) {
      showToast('Please enter your full name', 'error');
      return { success: false, error: 'Full name is required.' };
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return { success: false, error: 'A valid email address is required.' };
    }
    if (!password || password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const emailExists = registeredUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (emailExists) {
      showToast('An account with this email already exists', 'error');
      return { success: false, error: 'An account with this email already exists. Please log in.' };
    }

    const initialAddresses = [];
    if (address && address.street) {
      initialAddresses.push({
        id: `addr-${Date.now()}`,
        fullName: cleanName,
        street: address.street,
        apartment: address.apartment || '',
        city: address.city || 'Seattle',
        state: address.state || 'WA',
        postalCode: address.postalCode || '98101',
        country: 'United States',
        phone: phone || '',
        isDefault: true,
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: password,
      phone: phone || '',
      role: role || (cleanEmail.includes('admin') ? 'admin' : 'customer'),
      addresses: initialAddresses,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Account created! Welcome to Fresh Market, ${cleanName.split(' ')[0]}`, 'success');
    return { success: true, user: newUser };
  };

  // Sign in with existing credentials
  const signIn = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !password) {
      showToast('Please enter both email and password', 'error');
      return { success: false, error: 'Email and password are required.' };
    }

    const matchedUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (!matchedUser) {
      showToast('No account found with this email. Please sign up.', 'error');
      return { success: false, error: 'No account found with this email address.' };
    }

    if (matchedUser.password !== password) {
      showToast('Incorrect password. Please try again.', 'error');
      return { success: false, error: 'Incorrect password.' };
    }

    setCurrentUser(matchedUser);
    showToast(`Signed in successfully! Welcome back, ${matchedUser.name}`, 'success');
    return { success: true, user: matchedUser };
  };

  // 1-Click Quick Demo Login Helper
  const loginAsDemo = (accountRole = 'customer') => {
    const targetEmail = accountRole === 'admin' ? 'admin@freshmarket.com' : 'sophia.bennett@freshmarket.com';
    let demoAcc = registeredUsers.find((u) => u.email.toLowerCase() === targetEmail);
    if (!demoAcc) {
      demoAcc = accountRole === 'admin' ? DEFAULT_DEMO_ACCOUNTS[1] : DEFAULT_DEMO_ACCOUNTS[0];
      setRegisteredUsers((prev) => [...prev, demoAcc]);
    }
    setCurrentUser(demoAcc);
    showToast(`Logged in as ${demoAcc.name} (${demoAcc.role === 'admin' ? 'Admin' : 'Customer'})`, 'success');
    return demoAcc;
  };

  // Sign out cleanly
  const signOut = () => {
    setCurrentUser(null);
    deleteAccessToken();
    if (oidcAuth && oidcAuth.removeUser) {
      try {
        oidcAuth.removeUser();
      } catch (err) {
        console.warn('OIDC removeUser error:', err);
      }
    }
    showToast('Signed out of Fresh Market', 'info');
    return { success: true };
  };

  // Cognito sign-out redirect
  const signOutCognito = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID || "2dlqkmsfj6vc2li1uenc0osh3m";
    const logoutUri = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : "https://d1vsslyvj5i9m6.cloudfront.net";
    const cognitoDomain = "https://us-east-1rxq7q3klm.auth.us-east-1.amazoncognito.com";
    signOut();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const signInCognito = () => {
    if (oidcAuth && oidcAuth.signinRedirect) {
      oidcAuth.signinRedirect().catch((err) => {
        console.warn('Cognito redirect caught error:', err);
        showToast('Cognito sign-in opened. In local mode, you can sign in directly.', 'info');
      });
    }
  };

  // Update profile attributes (name, phone, etc.)
  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated successfully', 'success');
  };

  // Address operations
  const addAddress = (newAddress) => {
    const addressWithId = {
      ...newAddress,
      id: `addr-${Date.now()}`,
      isDefault: !currentUser || !currentUser.addresses || currentUser.addresses.length === 0 || Boolean(newAddress.isDefault),
    };

    if (currentUser) {
      const currentList = currentUser.addresses || [];
      const updatedList = addressWithId.isDefault
        ? currentList.map((a) => ({ ...a, isDefault: false })).concat(addressWithId)
        : [...currentList, addressWithId];

      const updatedUser = { ...currentUser, addresses: updatedList };
      setCurrentUser(updatedUser);
      setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    showToast('Delivery address saved successfully', 'success');
  };

  const setDefaultAddress = (addressId) => {
    if (!currentUser) return;
    const updatedList = (currentUser.addresses || []).map((a) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    const updatedUser = { ...currentUser, addresses: updatedList };
    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
  };

  const deleteAddress = (addressId) => {
    if (!currentUser) return;
    const updatedList = (currentUser.addresses || []).filter((a) => a.id !== addressId);
    const updatedUser = { ...currentUser, addresses: updatedList };
    setCurrentUser(updatedUser);
    setRegisteredUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
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
      userEmail: currentUser?.email || 'guest@freshmarket.com',
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

  // Determine effective authenticated user
  const isAuthenticated = Boolean(oidcAuth?.isAuthenticated || currentUser !== null);

  const activeUser = oidcAuth?.isAuthenticated && oidcAuth?.user?.profile
    ? {
        id: oidcAuth.user.profile.sub || 'cognito-user',
        name: oidcAuth.user.profile.name || oidcAuth.user.profile.email?.split('@')[0] || 'Cognito User',
        email: oidcAuth.user.profile.email || 'cognito@freshmarket.com',
        phone: oidcAuth.user.profile.phone_number || '',
        role: 'customer',
        addresses: currentUser?.addresses || [],
      }
    : currentUser;

  const isAdmin = Boolean(activeUser?.role === 'admin' || activeUser?.email === 'admin@freshmarket.com');

  return (
    <AuthContext.Provider
      value={{
        oidcAuth,
        isAuthenticated,
        user: activeUser,
        currentUser: activeUser,
        registeredUsers,
        isAdmin,
        signIn,
        signUp,
        signOut,
        loginAsDemo,
        updateProfile,
        signInCognito,
        signOutCognito,
        deliveryLocation,
        updateLocation,
        addresses: activeUser?.addresses || [],
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
