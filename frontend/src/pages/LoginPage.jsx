import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Truck,
  LogIn,
  UserPlus,
  Cloud,
} from 'lucide-react';
import { useAppAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const LoginPage = ({ initialMode = 'signin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user, signIn, signUp, loginAsDemo, signInCognito } = useAppAuth();

  // Mode: 'signin' | 'signup'
  const modeParam = searchParams.get('mode');
  const [mode, setMode] = useState(modeParam === 'signup' || initialMode === 'signup' ? 'signup' : 'signin');

  // Sync mode with search param if changed
  useEffect(() => {
    if (modeParam === 'signup') {
      setMode('signup');
    } else if (modeParam === 'signin') {
      setMode('signin');
    }
  }, [modeParam]);

  // If already authenticated and not trying to switch accounts, provide a quick redirect
  const redirectTarget = location.state?.from || '/';

  // State for Sign In
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  // State for Sign Up
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [includeAddress, setIncludeAddress] = useState(false);
  const [signUpStreet, setSignUpStreet] = useState('');
  const [signUpCity, setSignUpCity] = useState('Seattle');
  const [signUpState, setSignUpState] = useState('WA');
  const [signUpPostalCode, setSignUpPostalCode] = useState('98101');
  const [signUpRole, setSignUpRole] = useState('customer'); // 'customer' | 'admin'
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signUpError, setSignUpError] = useState('');

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setSignInError('');
    setSignUpError('');
    setSearchParams(newMode === 'signup' ? { mode: 'signup' } : {});
  };

  // Sign In Submission
  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setSignInError('');
    setSignInLoading(true);

    try {
      const res = await signIn(signInEmail, signInPassword);
      if (res.success) {
        navigate(redirectTarget, { replace: true });
      } else {
        setSignInError(res.error || 'Failed to sign in. Please verify your credentials.');
      }
    } catch (err) {
      setSignInError('An unexpected error occurred during sign in.');
    } finally {
      setSignInLoading(false);
    }
  };

  // Sign Up Submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim()) {
      setSignUpError('Please enter your full name.');
      return;
    }
    if (!signUpEmail.trim()) {
      setSignUpError('Please enter a valid email address.');
      return;
    }
    if (signUpPassword.length < 6) {
      setSignUpError('Password must be at least 6 characters long.');
      return;
    }
    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Passwords do not match.');
      return;
    }

    setSignUpLoading(true);

    try {
      const addressData = includeAddress && signUpStreet.trim() ? {
        street: signUpStreet.trim(),
        city: signUpCity.trim(),
        state: signUpState.trim(),
        postalCode: signUpPostalCode.trim(),
      } : null;

      const res = await signUp({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
        phone: signUpPhone,
        address: addressData,
        role: signUpRole,
      });

      if (res.success) {
        navigate(redirectTarget, { replace: true });
      } else {
        setSignUpError(res.error || 'Failed to create account.');
      }
    } catch (err) {
      setSignUpError('An unexpected error occurred during registration.');
    } finally {
      setSignUpLoading(false);
    }
  };

  // 1-Click Demo Login Helper
  const handleQuickDemoLogin = (role) => {
    loginAsDemo(role);
    navigate(redirectTarget, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] shadow-sm overflow-hidden">
          
          {/* Left Hero Sidebar (Brand story) */}
          <div className="lg:col-span-5 bg-[#1D4232] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Background Decorative Rings */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[#285943] opacity-50 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-56 h-56 rounded-full bg-[#EFA36B] opacity-20 blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-2 bg-[#285943] border border-white/10 px-3 py-1 rounded-full text-xs font-semibold text-[#EFA36B] mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Member Benefits</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                Artisan pantry, local harvest & daily essentials.
              </h2>

              <p className="text-white/80 text-xs sm:text-sm mt-3 leading-relaxed">
                Join thousands of mindful households enjoying farm-direct produce, cold-pressed oils, and kitchen staples delivered in under 2 hours.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Under 2-Hour Delivery</h4>
                    <p className="text-[11px] text-white/70">Handled in temperature-controlled chill packs to your doorstep.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">100% Quality Inspected</h4>
                    <p className="text-[11px] text-white/70">Organic certification, zero synthetic additives, and fair-trade sourcing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Secure Cloud Authentication</h4>
                    <p className="text-[11px] text-white/70">Integrated with AWS Cognito and local profile management.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 text-[11px] text-white/60">
              Fresh Market &bull; Fresh Groceries &bull; Organic Living
            </div>
          </div>

          {/* Right Form Container */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            
            {/* Tab Navigation */}
            <div className="flex items-center p-1 bg-[#F8F7F0] rounded-2xl border border-[#E5E3D9] mb-6">
              <button
                type="button"
                onClick={() => handleTabChange('signin')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'signin'
                    ? 'bg-[#FFFFFF] text-[#1D4232] shadow-xs'
                    : 'text-[#667168] hover:text-[#1D4232]'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('signup')}
                className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  mode === 'signup'
                    ? 'bg-[#FFFFFF] text-[#1D4232] shadow-xs'
                    : 'text-[#667168] hover:text-[#1D4232]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </button>
            </div>

            {/* Current Active Account Banner (if already logged in) */}
            {isAuthenticated && user && (
              <div className="mb-6 p-4 rounded-2xl bg-[#E9F0E7] border border-[#285943]/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-[#285943]">Currently logged in as:</p>
                  <p className="text-sm font-bold text-[#1D4232]">{user.name} ({user.email})</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-3 py-1.5 rounded-xl bg-[#285943] text-white text-xs font-bold hover:bg-[#1D4232]"
                >
                  Go to Home
                </button>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SIGN IN FORM */}
            {/* ========================================================================= */}
            {mode === 'signin' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-[#1D4232]">
                    Welcome Back
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667168] mt-1">
                    Enter your email and password to access your Fresh Market account
                  </p>
                </div>

                {signInError && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-[#B83D32]/10 border border-[#B83D32]/30 flex items-center gap-2.5 text-xs text-[#B83D32] font-semibold animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}

                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="you@freshmarket.com"
                        required
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                      />
                      <Mail className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setSignInEmail('sophia.bennett@freshmarket.com');
                          setSignInPassword('password123');
                        }}
                        className="text-[11px] font-semibold text-[#285943] hover:underline"
                      >
                        Fill demo password
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                      />
                      <Lock className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#667168] hover:text-[#252D27]"
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {signInLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Quick Demo Sign-ins */}
                <div className="mt-6 pt-5 border-t border-[#E5E3D9]">
                  <p className="text-[11px] font-bold text-[#667168] uppercase tracking-wider text-center mb-3">
                    Fast Test Accounts (1-Click Login)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('customer')}
                      className="px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] bg-[#F8F7F0] hover:bg-[#E9F0E7] text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#285943] text-white flex items-center justify-center text-[10px] font-bold">
                          S
                        </div>
                        <span className="text-xs font-bold text-[#1D4232] group-hover:text-[#285943]">
                          Sophia Bennett
                        </span>
                      </div>
                      <p className="text-[10px] text-[#667168] mt-1 pl-8">
                        Customer Demo Account
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('admin')}
                      className="px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] bg-[#F8F7F0] hover:bg-[#E9F0E7] text-left transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#EFA36B] text-[#1D4232] flex items-center justify-center text-[10px] font-bold">
                          A
                        </div>
                        <span className="text-xs font-bold text-[#1D4232] group-hover:text-[#285943]">
                          Store Admin
                        </span>
                      </div>
                      <p className="text-[10px] text-[#667168] mt-1 pl-8">
                        Manager & Inventory Access
                      </p>
                    </button>
                  </div>
                </div>

                {/* AWS Cognito External Sign In */}
                <div className="mt-4 pt-4 border-t border-[#E5E3D9]/60">
                  <button
                    type="button"
                    onClick={signInCognito}
                    className="w-full py-2.5 px-4 rounded-xl border border-[#D5E1D3] bg-white hover:bg-[#F8F7F0] text-xs font-semibold text-[#1D4232] flex items-center justify-center gap-2 transition-colors"
                  >
                    <Cloud className="w-4 h-4 text-[#285943]" />
                    <span>Sign In via AWS Cognito Hosted UI</span>
                  </button>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SIGN UP / CREATE ACCOUNT FORM */}
            {/* ========================================================================= */}
            {mode === 'signup' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl font-black text-[#1D4232]">
                    Create Your Account
                  </h3>
                  <p className="text-xs sm:text-sm text-[#667168] mt-1">
                    Sign up to start ordering fresh organic groceries & unlock member perks
                  </p>
                </div>

                {signUpError && (
                  <div className="mb-5 p-3.5 rounded-2xl bg-[#B83D32]/10 border border-[#B83D32]/30 flex items-center gap-2.5 text-xs text-[#B83D32] font-semibold animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{signUpError}</span>
                  </div>
                )}

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Sumanth Naidu"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                      />
                      <User className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email & Phone in 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => setSignUpEmail(e.target.value)}
                          placeholder="you@example.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                        />
                        <Mail className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="+1 (206) 555-0199"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                        />
                        <Phone className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                        Password * (6+ chars)
                      </label>
                      <div className="relative">
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpPassword}
                          onChange={(e) => setSignUpPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                        />
                        <Lock className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#667168] hover:text-[#252D27]"
                        >
                          {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#252D27] uppercase tracking-wider mb-1.5">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showSignUpPassword ? 'text' : 'password'}
                          value={signUpConfirmPassword}
                          onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#285943] focus:border-transparent transition-all"
                        />
                        <Lock className="w-4 h-4 text-[#667168] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Optional Delivery Address Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={includeAddress}
                        onChange={(e) => setIncludeAddress(e.target.checked)}
                        className="w-4 h-4 rounded text-[#285943] focus:ring-[#285943] accent-[#285943]"
                      />
                      <span className="text-xs font-semibold text-[#252D27]">
                        Add default delivery address now (optional)
                      </span>
                    </label>

                    {includeAddress && (
                      <div className="mt-3 p-4 rounded-2xl bg-[#F8F7F0] border border-[#E5E3D9] space-y-3 animate-in fade-in duration-200">
                        <div>
                          <label className="block text-[11px] font-bold text-[#667168] mb-1">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={signUpStreet}
                            onChange={(e) => setSignUpStreet(e.target.value)}
                            placeholder="e.g. 123 Pine St, Apt 2B"
                            className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-[#667168] mb-1">City</label>
                            <input
                              type="text"
                              value={signUpCity}
                              onChange={(e) => setSignUpCity(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#667168] mb-1">State</label>
                            <input
                              type="text"
                              value={signUpState}
                              onChange={(e) => setSignUpState(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-[#667168] mb-1">ZIP Code</label>
                            <input
                              type="text"
                              value={signUpPostalCode}
                              onChange={(e) => setSignUpPostalCode(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Account Role Selector */}
                  <div className="pt-1 flex items-center justify-between text-xs text-[#667168]">
                    <span>Account Type:</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="customer"
                          checked={signUpRole === 'customer'}
                          onChange={() => setSignUpRole('customer')}
                          className="accent-[#285943]"
                        />
                        <span className="font-medium text-[#252D27]">Customer</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          value="admin"
                          checked={signUpRole === 'admin'}
                          onChange={() => setSignUpRole('admin')}
                          className="accent-[#285943]"
                        />
                        <span className="font-medium text-[#252D27]">Store Admin</span>
                      </label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {signUpLoading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Create Account & Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] text-[#667168]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleTabChange('signin')}
                    className="font-bold text-[#285943] hover:underline"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
