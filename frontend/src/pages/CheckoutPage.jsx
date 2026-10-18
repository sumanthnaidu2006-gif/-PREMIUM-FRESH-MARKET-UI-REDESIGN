import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Truck,
  CheckCircle2,
  CreditCard,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAppAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

const SHIPPING_METHODS = [

  {
    id: 'express',
    name: 'Fresh Market Express 2-Hour',
    deliveryTime: 'Today within 2 Hours',
    price: 0.00,
    description: 'Chilled packaging with local bicycle/van courier',
  },
  {
    id: 'standard',
    name: 'Same-Day Evening Delivery',
    deliveryTime: 'Today between 6:00 PM – 9:00 PM',
    price: 0.00,
    description: 'Optimal for after-work arrival',
  },
  {
    id: 'morning',
    name: 'Next-Day Morning Sunrise',
    deliveryTime: 'Tomorrow 7:00 AM – 10:00 AM',
    price: 0.00,
    description: 'Fresh breakfast produce & whole milk',
  },
];

export const CheckoutPage = () => {
  const { cartItems, subtotal, discount, shipping, tax, total, clearCart } = useCart();
  const { user, addresses, addAddress, createOrder } = useAppAuth();
  const { showToast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ''
  );
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    fullName: user?.name || '',
    street: '',
    apartment: '',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    phone: user?.phone || '+1 (206) 555-0142',
    isDefault: false,
  });

  // Demo Payment Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleAddNewAddressSubmit = (e) => {
    e.preventDefault();
    if (!newAddressForm.street || !newAddressForm.fullName) {
      showToast('Please enter full name and street address', 'error');
      return;
    }
    addAddress(newAddressForm);
    setIsAddingNewAddress(false);
  };

  const handleProcessDemoPayment = (simulateSuccess = true) => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    setTimeout(() => {
      setIsProcessingPayment(false);

      if (!simulateSuccess) {
        setPaymentError('Simulated Card Decline: The demo payment gateway intentionally rejected the test card transaction.');
        showToast('Payment simulation failed (Test Mode)', 'error');
        return;
      }

      // Create confirmed order
      const orderPayload = {
        items: cartItems.map((i) => ({
          id: i.product.id || i.product.coffeeId,
          name: i.product.name,
          brand: i.product.brand,
          price: Number(i.product.price),
          quantity: i.quantity,
          image: i.product.image || (i.product.images && i.product.images[0]),
        })),
        subtotal,
        discount,
        shipping,
        tax,
        total,
        deliveryAddress: selectedAddress,
        shippingMethod: selectedShippingMethod,
        paymentMethod: {
          type: 'Demo Payment (Visa)',
          last4: '4242',
          status: 'Demo Approved',
        },
      };

      const placedOrder = createOrder(orderPayload);
      setConfirmedOrder(placedOrder);
      clearCart();
      setCurrentStep(5); // Confirmation step
      showToast('Order confirmed! Receipt generated.', 'success');
    }, 1200);
  };

  if (cartItems.length === 0 && currentStep !== 5) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#E9F0E7] flex items-center justify-center text-[#285943] mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D4232]">Your cart is empty</h1>
          <p className="text-sm text-[#667168] mt-2">Add items to your cart before proceeding to checkout.</p>
          <Link
            to="/"
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#285943] text-white font-semibold text-sm hover:bg-[#1D4232]"
          >
            Start Shopping
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const steps = [
    { num: 1, label: 'Delivery Address' },
    { num: 2, label: 'Shipping Method' },
    { num: 3, label: 'Order Review' },
    { num: 4, label: 'Demo Payment' },
    { num: 5, label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Progress Step Bar */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-[#E5E3D9] z-0" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#285943] transition-all duration-300 z-0"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((s) => {
              const isDone = currentStep > s.num;
              const isCurrent = currentStep === s.num;

              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isDone
                        ? 'bg-[#285943] text-white'
                        : isCurrent
                        ? 'bg-[#EFA36B] text-[#1D4232] ring-4 ring-[#EFA36B]/30'
                        : 'bg-[#FFFFFF] text-[#667168] border border-[#E5E3D9]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-semibold mt-2 hidden sm:block whitespace-nowrap ${
                      isCurrent ? 'text-[#1D4232]' : 'text-[#667168]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 5: Order Confirmation */}
        {currentStep === 5 && confirmedOrder ? (
          <div className="max-w-2xl mx-auto bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-8 sm:p-12 text-center shadow-md animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-[#E9F0E7] text-[#28734D] flex items-center justify-center mx-auto mb-6 shadow-xs">
              <CheckCircle2 className="w-10 h-10 stroke-[2.2]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-wider text-[#285943] bg-[#E9F0E7] px-3 py-1 rounded-full">
              Order Confirmed & Placed
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] mt-3">
              Thank you for your order!
            </h1>
            <p className="text-sm text-[#667168] mt-2">
              We've dispatched your order details to our local fulfillment center. Your fresh items are being packed in temperature-controlled chill packaging.
            </p>

            <div className="bg-[#F8F7F0] p-6 rounded-2xl border border-[#E5E3D9] text-left my-8 space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E5E3D9] pb-2">
                <span className="text-[#667168]">Order Reference:</span>
                <span className="font-bold text-[#1D4232]">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b border-[#E5E3D9] pb-2">
                <span className="text-[#667168]">Delivery Destination:</span>
                <span className="font-semibold text-[#252D27]">
                  {confirmedOrder.deliveryAddress.street}, {confirmedOrder.deliveryAddress.city}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E5E3D9] pb-2">
                <span className="text-[#667168]">Estimated Delivery:</span>
                <span className="font-bold text-[#285943]">
                  {confirmedOrder.shippingMethod.deliveryTime}
                </span>
              </div>
              <div className="flex justify-between border-b border-[#E5E3D9] pb-2">
                <span className="text-[#667168]">Payment Method:</span>
                <span className="font-semibold text-[#252D27]">
                  {confirmedOrder.paymentMethod.type} (Demo Approved)
                </span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-[#1D4232]">
                <span>Total Amount Charged:</span>
                <span>${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/orders"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm shadow-md transition-all"
              >
                View Order History
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#E5E3D9] hover:bg-[#F8F7F0] text-[#252D27] font-semibold text-sm transition-all"
              >
                Back to Fresh Market
              </Link>
            </div>
          </div>
        ) : (
          /* Multi-step Layout with Sidebar */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Form Column */}
            <div className="lg:col-span-8 bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 sm:p-8 shadow-xs">
              {/* Step 1: Delivery Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E3D9]">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-5 h-5 text-[#285943]" />
                      <h2 className="text-xl font-bold text-[#1D4232]">Delivery Destination</h2>
                    </div>
                    {!isAddingNewAddress && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(true)}
                        className="text-xs font-bold text-[#285943] hover:text-[#1D4232] hover:underline"
                      >
                        + Add New Address
                      </button>
                    )}
                  </div>

                  {isAddingNewAddress ? (
                    <form onSubmit={handleAddNewAddressSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-[#667168] mb-1">
                            Recipient Full Name
                          </label>
                          <input
                            type="text"
                            value={newAddressForm.fullName}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, fullName: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#667168] mb-1">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            value={newAddressForm.phone}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, phone: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#667168] mb-1">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={newAddressForm.street}
                          onChange={(e) =>
                            setNewAddressForm({ ...newAddressForm, street: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                          placeholder="e.g. 742 Evergreen Terrace"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#667168] mb-1">City</label>
                          <input
                            type="text"
                            value={newAddressForm.city}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, city: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#667168] mb-1">State</label>
                          <input
                            type="text"
                            value={newAddressForm.state}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, state: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-[#667168] mb-1">ZIP Code</label>
                          <input
                            type="text"
                            value={newAddressForm.postalCode}
                            onChange={(e) =>
                              setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-[#285943] text-white font-semibold text-xs"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingNewAddress(false)}
                          className="px-4 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        return (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id)}
                            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#285943] bg-[#E9F0E7]/60 ring-2 ring-[#285943]'
                                : 'border-[#E5E3D9] hover:bg-[#F8F7F0]'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
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
                            <p className="text-xs text-[#667168] mt-2 font-medium">{addr.phone}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-6 border-t border-[#E5E3D9] flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
                    >
                      <span>Continue to Shipping</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Method */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E3D9]">
                    <Truck className="w-5 h-5 text-[#285943]" />
                    <h2 className="text-xl font-bold text-[#1D4232]">Select Delivery Window</h2>
                  </div>

                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => {
                      const isSelected = selectedShippingMethod.id === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedShippingMethod(method)}
                          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-[#285943] bg-[#E9F0E7]/60 ring-2 ring-[#285943]'
                              : 'border-[#E5E3D9] hover:bg-[#F8F7F0]'
                          }`}
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-sm text-[#1D4232] block">
                              {method.name}
                            </span>
                            <span className="text-xs text-[#285943] font-semibold block">
                              {method.deliveryTime}
                            </span>
                            <span className="text-xs text-[#667168] block">
                              {method.description}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-bold text-[#28734D]">
                              {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-6 border-t border-[#E5E3D9] flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] text-xs font-bold hover:bg-[#F8F7F0] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
                    >
                      <span>Review Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-[#E5E3D9]">
                    <CheckCircle2 className="w-5 h-5 text-[#285943]" />
                    <h2 className="text-xl font-bold text-[#1D4232]">Review Items & Fulfillment</h2>
                  </div>

                  {/* Summary of destination & shipping */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8F7F0] p-4 rounded-2xl border border-[#E5E3D9] text-xs">
                    <div>
                      <span className="font-bold text-[#667168] uppercase text-[10px] block mb-1">
                        Shipping To:
                      </span>
                      <p className="font-semibold text-[#252D27]">{selectedAddress.fullName}</p>
                      <p className="text-[#667168]">
                        {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.postalCode}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-[#667168] uppercase text-[10px] block mb-1">
                        Delivery Method:
                      </span>
                      <p className="font-semibold text-[#285943]">{selectedShippingMethod.name}</p>
                      <p className="text-[#667168]">{selectedShippingMethod.deliveryTime}</p>
                    </div>
                  </div>

                  {/* Item List Preview */}
                  <div className="divide-y divide-[#E5E3D9]">
                    {cartItems.map((item) => (
                      <div
                        key={item.product.id || item.product.coffeeId}
                        className="py-3 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image || (item.product.images && item.product.images[0])}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#E5E3D9]"
                          />
                          <div>
                            <p className="font-bold text-sm text-[#252D27]">{item.product.name}</p>
                            <p className="text-[#667168]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[#1D4232] text-sm">
                          ${(Number(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#E5E3D9] flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] text-xs font-bold hover:bg-[#F8F7F0] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm flex items-center gap-2 shadow-xs"
                    >
                      <span>Proceed to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Demo Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#E5E3D9]">
                    <div className="flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#285943]" />
                      <h2 className="text-xl font-bold text-[#1D4232]">Payment Method</h2>
                    </div>

                    {/* DEMO NOTICE BADGE */}
                    <span className="px-3 py-1 rounded-full bg-[#E9F0E7] text-[#285943] text-xs font-bold tracking-wide border border-[#285943]/20">
                      Demo Payment — No Real Money Charged
                    </span>
                  </div>

                  {paymentError && (
                    <div className="p-4 rounded-2xl bg-[#B83D32]/10 border border-[#B83D32]/30 flex items-start gap-3 text-xs text-[#B83D32]">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Transaction Simulation Error</p>
                        <p>{paymentError}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-6 rounded-2xl bg-[#F8F7F0] border border-[#E5E3D9] space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#667168]">
                      <span className="font-bold uppercase tracking-wider text-[#1D4232]">
                        Simulated Credit Card
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-[#28734D]">
                        <Lock className="w-3.5 h-3.5" /> 256-bit Encrypted
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#667168] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#667168] mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#667168] mb-1">
                          Security CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Simulator Testing Actions */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold text-[#667168] text-center">
                      Choose an outcome to test payment authorization:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() => handleProcessDemoPayment(true)}
                        className="py-3.5 px-6 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] disabled:opacity-50 text-[#1D4232] font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                      >
                        {isProcessingPayment ? (
                          <div className="w-5 h-5 rounded-full border-2 border-[#1D4232]/30 border-t-[#1D4232] animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                            <span>Complete Order (Authorize)</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={() => handleProcessDemoPayment(false)}
                        className="py-3.5 px-6 rounded-xl border border-[#B83D32] hover:bg-[#B83D32]/10 disabled:opacity-50 text-[#B83D32] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>Test Payment Failure</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E3D9] flex justify-start">
                    <button
                      type="button"
                      disabled={isProcessingPayment}
                      onClick={() => setCurrentStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] text-xs font-bold hover:bg-[#F8F7F0] flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to Review
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Order Summary */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#1D4232] pb-3 border-b border-[#E5E3D9]">
                  Order Total
                </h3>

                <div className="py-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-[#667168]">
                    <span>Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
                    <span className="font-semibold text-[#252D27]">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#28734D]">
                      <span>Savings</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#667168]">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#252D27]">
                      {shipping === 0 ? <strong className="text-[#28734D]">FREE</strong> : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#667168]">
                    <span>Estimated Tax</span>
                    <span className="font-semibold text-[#252D27]">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-[#E5E3D9] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-[#1D4232]">Order Total</span>
                    <span className="text-xl font-black text-[#1D4232]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-[#667168] space-y-1">
                  <p className="flex items-center gap-1 text-[#285943] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Fresh Market Guarantee
                  </p>
                  <p>Guaranteed freshness upon delivery or 100% money back.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
