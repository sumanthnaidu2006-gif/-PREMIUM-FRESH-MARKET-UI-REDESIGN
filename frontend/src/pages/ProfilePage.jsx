import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Check,
  ShieldCheck,
  Mail,
  Phone,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  Edit2,
} from 'lucide-react';
import { useAppAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const ProfilePage = () => {
  const {
    user,
    addresses,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    isAuthenticated,
    signOut,
    loginAsDemo,
    updateProfile,
    isAdmin,
  } = useAppAuth();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    street: '',
    apartment: '',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    phone: user?.phone || '',
    isDefault: false,
  });

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (profileName.trim()) {
      updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      setIsEditingProfile(false);
    }
  };

  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    if (addressForm.fullName && addressForm.street) {
      addAddress(addressForm);
      setIsAddingAddress(false);
      setAddressForm({
        fullName: user?.name || '',
        street: '',
        apartment: '',
        city: 'Seattle',
        state: 'WA',
        postalCode: '98101',
        country: 'United States',
        phone: user?.phone || '',
        isDefault: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="pb-6 border-b border-[#E5E3D9] mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
            Customer Profile & Addresses
          </h1>
          <p className="text-xs sm:text-sm text-[#667168] mt-1">
            Manage your personal credentials, contact info, and delivery destinations
          </p>
        </div>

        {!isAuthenticated ? (
          /* Unauthenticated State View */
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#1D4232]">Sign in to View Your Profile</h2>
            <p className="text-xs sm:text-sm text-[#667168] mt-2 leading-relaxed">
              Log in or create a new Fresh Market account to view your saved addresses, track recent orders, and manage account preferences.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Account</span>
              </Link>

              <Link
                to="/signup"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#285943] text-[#285943] hover:bg-[#E9F0E7] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E5E3D9]">
              <p className="text-[11px] font-bold text-[#667168] uppercase tracking-wider mb-3">
                Or Try Demo Account
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => loginAsDemo('customer')}
                  className="px-3 py-1.5 rounded-lg bg-[#F8F7F0] hover:bg-[#E9F0E7] text-xs font-semibold text-[#1D4232] border border-[#E5E3D9]"
                >
                  Demo Customer
                </button>
                <button
                  type="button"
                  onClick={() => loginAsDemo('admin')}
                  className="px-3 py-1.5 rounded-lg bg-[#F8F7F0] hover:bg-[#E9F0E7] text-xs font-semibold text-[#1D4232] border border-[#E5E3D9]"
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated User View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Profile Card */}
            <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#285943] text-white flex items-center justify-center font-bold text-xl shadow-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1D4232]">{user?.name}</h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28734D] bg-[#E9F0E7] px-2 py-0.5 rounded-full mt-0.5">
                      <ShieldCheck className="w-3 h-3" /> {isAdmin ? 'Market Administrator' : 'Fresh Market Member'}
                    </span>
                  </div>
                </div>

                {!isEditingProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileName(user?.name || '');
                      setProfilePhone(user?.phone || '');
                      setIsEditingProfile(true);
                    }}
                    className="p-2 rounded-xl text-[#667168] hover:text-[#1D4232] hover:bg-[#F8F7F0] transition-colors"
                    title="Edit profile information"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleProfileSave} className="space-y-3 pt-2 border-t border-[#E5E3D9]">
                  <div>
                    <label className="block text-[11px] font-bold text-[#667168] uppercase mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#667168] uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-lg bg-[#285943] text-white text-xs font-bold hover:bg-[#1D4232]"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-3 py-1.5 rounded-lg border border-[#E5E3D9] text-xs text-[#667168] hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-xs border-t border-[#E5E3D9] pt-4">
                  <div className="flex items-center gap-2.5 text-[#667168]">
                    <Mail className="w-4 h-4 text-[#285943]" />
                    <span className="font-medium text-[#252D27] truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[#667168]">
                    <Phone className="w-4 h-4 text-[#285943]" />
                    <span className="font-medium text-[#252D27]">
                      {user?.phone || 'No phone number added'}
                    </span>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#B83D32] text-[#B83D32] hover:bg-[#B83D32]/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Right Column: Address Book */}
            <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E3D9]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#285943]" />
                  <h2 className="text-xl font-bold text-[#1D4232]">Saved Delivery Destinations</h2>
                </div>

                {!isAddingAddress && (
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="text-xs font-bold text-[#285943] hover:text-[#1D4232] flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Address</span>
                  </button>
                )}
              </div>

              {isAddingAddress ? (
                <form onSubmit={handleAddAddressSubmit} className="space-y-4 bg-[#F8F7F0] p-6 rounded-2xl border border-[#E5E3D9]">
                  <h3 className="text-sm font-bold text-[#1D4232]">New Address Details</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">Full Name</label>
                      <input
                        type="text"
                        value={addressForm.fullName}
                        onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#667168] mb-1">Street Address</label>
                    <input
                      type="text"
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                      placeholder="e.g. 742 Evergreen Terrace"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">City</label>
                      <input
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">State</label>
                      <input
                        type="text"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">ZIP Code</label>
                      <input
                        type="text"
                        value={addressForm.postalCode}
                        onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-xs shadow-xs"
                    >
                      Save Destination
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingAddress(false)}
                      className="px-4 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] font-medium text-xs hover:bg-[#FFFFFF]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-[#F8F7F0] rounded-2xl border border-[#E5E3D9]">
                  <MapPin className="w-8 h-8 text-[#667168] mx-auto mb-2 opacity-60" />
                  <p className="text-xs text-[#667168]">No delivery destinations saved yet.</p>
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(true)}
                    className="mt-3 px-4 py-2 rounded-xl bg-[#285943] text-white text-xs font-bold hover:bg-[#1D4232]"
                  >
                    Add Your First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-[#285943] bg-[#E9F0E7]/40 ring-1 ring-[#285943]'
                          : 'border-[#E5E3D9] bg-[#FFFFFF] hover:bg-[#F8F7F0]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-[#1D4232]">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-[#285943] text-white px-2 py-0.5 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#252D27]">{addr.street}</p>
                      {addr.apartment && <p className="text-xs text-[#667168]">{addr.apartment}</p>}
                      <p className="text-xs text-[#667168]">
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      {addr.phone && <p className="text-xs text-[#667168] mt-2 font-medium">{addr.phone}</p>}

                      <div className="mt-4 pt-3 border-t border-[#E5E3D9] flex items-center justify-between text-xs">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[#285943] hover:underline font-semibold"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-[#28734D] font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Default
                          </span>
                        )}

                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => deleteAddress(addr.id)}
                            className="text-[#B83D32] hover:underline font-semibold"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
