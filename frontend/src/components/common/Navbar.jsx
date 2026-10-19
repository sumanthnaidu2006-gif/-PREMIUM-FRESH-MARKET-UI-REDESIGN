import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  MapPin,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Truck,
  ShieldCheck,
  Settings,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  Layers,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAppAuth } from '../../context/AuthContext';
import { LocationModal } from './LocationModal';
import { INITIAL_PRODUCTS, CATEGORIES } from '../../utils/initialData';

export const Navbar = () => {
  const navigate = useNavigate();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, deliveryLocation, isAdmin, signInCognito, signOutCognito, signOut, loginAsDemo } = useAppAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const searchRef = useRef(null);
  const accountRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter search suggestions
  const searchSuggestions = searchQuery.trim()
    ? INITIAL_PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (product) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/details/${product.id || product.coffeeId}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* 1. Announcement Bar */}
      <div className="bg-[#E9F0E7] text-[#1D4232] border-b border-[#D5E1D3] text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-[#285943] text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">
              <Sparkles className="w-3 h-3" /> Fresh Guarantee
            </span>
            <span className="hidden sm:inline text-[#252D27]">
              Everyday essentials delivered in under 2 hours. Free delivery on orders over $50!
            </span>
            <span className="sm:hidden text-[#252D27]">Free delivery on orders over $50</span>
          </div>

          <div className="flex items-center gap-4 text-[#667168] text-xs">
            <span className="hidden md:flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[#285943]" /> Temperature-Controlled Transit
            </span>
            <span className="hidden lg:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#285943]" /> 100% Quality Inspected
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="bg-[#1D4232] text-white py-3 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-white/90 hover:text-white hover:bg-[#285943] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#EFA36B] flex items-center justify-center text-[#1D4232] shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-[#1D4232] stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                  Fresh<span className="text-[#EFA36B]">Market</span>
                </span>
                <span className="text-[10px] text-white/70 tracking-widest uppercase font-medium -mt-1 hidden sm:block">
                  Artisan & Daily Essentials
                </span>
              </div>
            </Link>
          </div>

          {/* Delivery Location Selector */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#285943] text-left transition-colors border border-transparent hover:border-white/10"
            title="Change Delivery Location"
          >
            <MapPin className="w-4 h-4 text-[#EFA36B] shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                Deliver to
              </span>
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {deliveryLocation.city} {deliveryLocation.postalCode}
              </span>
            </div>
          </button>

          {/* Search Bar with Autocomplete */}
          <div ref={searchRef} className="flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search fresh groceries, artisan coffee, cookware, beauty..."
                className="w-full pl-11 pr-24 py-2.5 rounded-full bg-[#FFFFFF] text-[#252D27] placeholder-[#667168] text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#EFA36B] shadow-inner transition-shadow"
              />
              <Search className="w-4 h-4 text-[#667168] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-[#667168] hover:text-[#252D27] p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#EFA36B] hover:bg-[#E39257] text-[#1D4232] font-semibold text-xs rounded-full transition-colors active:scale-95 shadow-xs"
              >
                Search
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#FFFFFF] text-[#252D27] rounded-2xl shadow-2xl border border-[#E5E3D9] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 bg-[#F8F7F0] border-b border-[#E5E3D9] text-[11px] font-semibold text-[#667168] uppercase tracking-wider">
                  Product Suggestions
                </div>
                <div className="divide-y divide-[#E5E3D9]/60">
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#E9F0E7]/50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg border border-[#E5E3D9]"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#252D27] group-hover:text-[#285943]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#667168]">
                            {item.brand} • <span className="font-medium text-[#285943]">{item.category}</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#1D4232]">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-white/90 hover:text-white hover:bg-[#285943] transition-colors"
              title="My Wishlist"
              aria-label={`Wishlist with ${wishlistCount} items`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#B94A40] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#285943] hover:bg-[#1D4232] border border-white/10 text-white transition-all shadow-xs group"
              aria-label={`Shopping cart with ${totalItemsCount} items`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#EFA36B] group-hover:scale-105 transition-transform" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 px-1 rounded-full bg-[#EFA36B] text-[#1D4232] text-[11px] font-black flex items-center justify-center shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold hidden md:inline">Cart</span>
            </Link>

            {/* Account Menu / Sign In Controls */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] text-[#1D4232] text-xs font-bold transition-all shadow-xs"
                >
                  <LogIn className="w-4 h-4 stroke-[2.2]" />
                  <span>Sign In</span>
                </Link>

                <div ref={accountRef} className="relative">
                  <button
                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                    className="p-2 rounded-xl text-white/90 hover:text-white hover:bg-[#285943] transition-colors"
                    aria-expanded={isAccountOpen}
                    title="Account options"
                  >
                    <ChevronDown className="w-4 h-4 text-white/70" />
                  </button>

                  {isAccountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#FFFFFF] text-[#252D27] rounded-2xl shadow-xl border border-[#E5E3D9] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-4 py-3 border-b border-[#E5E3D9] bg-[#F8F7F0]/60">
                        <p className="text-xs text-[#667168]">Welcome to Fresh Market</p>
                        <p className="text-sm font-bold text-[#1D4232]">Sign in or Register</p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          to="/login"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#285943] text-white font-semibold text-xs hover:bg-[#1D4232] transition-colors"
                        >
                          <LogIn className="w-4 h-4" />
                          <span>Sign In to Your Account</span>
                        </Link>

                        <Link
                          to="/signup"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-[#E5E3D9] text-[#1D4232] font-semibold text-xs hover:bg-[#E9F0E7] transition-colors"
                        >
                          <UserPlus className="w-4 h-4 text-[#285943]" />
                          <span>Create New Account</span>
                        </Link>
                      </div>

                      <div className="mt-1 pt-2 border-t border-[#E5E3D9] px-3">
                        <p className="text-[10px] font-bold text-[#667168] uppercase tracking-wider mb-1.5">
                          Quick Demo Logins
                        </p>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountOpen(false);
                              loginAsDemo('customer');
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-[#252D27] hover:bg-[#E9F0E7] flex items-center justify-between"
                          >
                            <span>Sophia Bennett</span>
                            <span className="text-[10px] text-[#285943] font-bold bg-[#E9F0E7] px-1.5 py-0.5 rounded">Customer</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAccountOpen(false);
                              loginAsDemo('admin');
                            }}
                            className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-[#252D27] hover:bg-[#E9F0E7] flex items-center justify-between"
                          >
                            <span>Store Manager</span>
                            <span className="text-[10px] text-[#EFA36B] font-bold bg-[#EFA36B]/20 px-1.5 py-0.5 rounded">Admin</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Authenticated User Menu */
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center gap-1.5 p-2 rounded-xl text-white/90 hover:text-white hover:bg-[#285943] transition-colors text-left"
                  aria-expanded={isAccountOpen}
                  aria-label="Account menu"
                >
                  <div className="w-8 h-8 rounded-full bg-[#285943] border border-white/20 flex items-center justify-center text-white font-bold text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
                      Hello,
                    </span>
                    <span className="text-xs font-semibold text-white truncate max-w-[90px]">
                      {user?.name?.split(' ')[0] || 'Member'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-white/70 hidden sm:block" />
                </button>

                {isAccountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#FFFFFF] text-[#252D27] rounded-2xl shadow-xl border border-[#E5E3D9] py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-3 border-b border-[#E5E3D9] bg-[#F8F7F0]/60">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-[#667168]">Signed in as</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isAdmin ? 'bg-[#EFA36B]/20 text-[#1D4232]' : 'bg-[#E9F0E7] text-[#285943]'
                        }`}>
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#1D4232] truncate mt-0.5">{user?.name}</p>
                      <p className="text-xs text-[#667168] truncate">{user?.email}</p>
                    </div>

                    <div className="py-1 text-sm">
                      <Link
                        to="/profile"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#E9F0E7] text-[#252D27] transition-colors"
                      >
                        <User className="w-4 h-4 text-[#285943]" />
                        <span>Customer Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#E9F0E7] text-[#252D27] transition-colors"
                      >
                        <Package className="w-4 h-4 text-[#285943]" />
                        <span>Order History</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#E9F0E7] text-[#252D27] transition-colors"
                      >
                        <Heart className="w-4 h-4 text-[#285943]" />
                        <span>Saved Wishlist</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#E9F0E7] text-[#1D4232] font-semibold transition-colors border-t border-[#E5E3D9]/60"
                        >
                          <Settings className="w-4 h-4 text-[#EFA36B]" />
                          <span>Retail Operations (Admin)</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 mt-1 border-t border-[#E5E3D9] px-2 space-y-1">
                      <button
                        onClick={() => {
                          setIsAccountOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#B83D32] hover:bg-[#B83D32]/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </nav>

      {/* 3. Secondary Category Bar (Desktop) */}
      <div className="bg-[#285943] text-white border-t border-white/10 hidden md:block px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto py-2 text-xs font-medium scrollbar-none">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white hover:text-[#EFA36B] transition-colors whitespace-nowrap font-bold"
          >
            <Layers className="w-3.5 h-3.5 text-[#EFA36B]" />
            <span>All Categories</span>
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/?category=${encodeURIComponent(cat.name)}`}
              className="text-white/90 hover:text-[#EFA36B] transition-colors whitespace-nowrap hover:underline underline-offset-4"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/?deals=true"
            className="ml-auto text-[#EFA36B] font-bold flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Trending Deals</span>
          </Link>
        </div>
      </div>

      {/* 4. Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-50 animate-in slide-in-from-left duration-200">
            <div className="p-4 bg-[#1D4232] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EFA36B] flex items-center justify-center text-[#1D4232]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg">Fresh Market</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Location Selector */}
            <div className="p-4 bg-[#E9F0E7] border-b border-[#D5E1D3]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsLocationModalOpen(true);
                }}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2 text-[#1D4232]">
                  <MapPin className="w-4 h-4 text-[#285943]" />
                  <span className="text-xs font-semibold">
                    {deliveryLocation.city}, {deliveryLocation.postalCode}
                  </span>
                </div>
                <span className="text-xs text-[#285943] font-bold">Change</span>
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#667168] uppercase tracking-wider mb-2">
                  Shop by Category
                </p>
                <div className="space-y-1">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-[#252D27] hover:bg-[#E9F0E7]"
                  >
                    All Products
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl text-sm text-[#252D27] hover:bg-[#E9F0E7]"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E3D9]">
                <p className="text-[11px] font-bold text-[#667168] uppercase tracking-wider mb-2">
                  My Account
                </p>
                <div className="space-y-1 text-sm">
                  <Link
                    to="/orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#252D27] hover:bg-[#E9F0E7]"
                  >
                    <Package className="w-4 h-4 text-[#285943]" />
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#252D27] hover:bg-[#E9F0E7]"
                  >
                    <Heart className="w-4 h-4 text-[#285943]" />
                    <span>My Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#252D27] hover:bg-[#E9F0E7]"
                  >
                    <User className="w-4 h-4 text-[#285943]" />
                    <span>Profile & Addresses</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1D4232] font-semibold hover:bg-[#E9F0E7]"
                    >
                      <Settings className="w-4 h-4 text-[#EFA36B]" />
                      <span>Admin Operations</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E3D9] bg-[#F8F7F0]">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-xs text-[#667168] truncate">
                    Signed in as <span className="font-bold text-[#1D4232]">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#B83D32] text-[#B83D32] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#B83D32]/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#285943] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1D4232] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#285943] text-[#285943] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#E9F0E7] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </header>
  );
};
