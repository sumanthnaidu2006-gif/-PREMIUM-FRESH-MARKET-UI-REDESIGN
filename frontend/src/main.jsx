import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider as CognitoOidcProvider } from 'react-oidc-context';
import './index.css';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider as AppAuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

import Home from './Home';
import ItemDetails from './ItemDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

// Active AWS Learner Lab Cognito configuration
const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xUFprVIQe',
  client_id: '2dlqkmsfj6vc2li1uenc0osh3m',
  redirect_uri: typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://d1vsslyvj5i9m6.cloudfront.net',
  response_type: 'code',
  scope: 'email openid phone',
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CognitoOidcProvider {...cognitoAuthConfig}>
      <ToastProvider>
        <AppAuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/details/:id" element={<ItemDetails />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/payment" element={<CheckoutPage initialStep={4} />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<LoginPage initialMode="signup" />} />
                </Routes>
              </Router>
            </CartProvider>
          </WishlistProvider>
        </AppAuthProvider>
      </ToastProvider>
    </CognitoOidcProvider>
  </React.StrictMode>
);
