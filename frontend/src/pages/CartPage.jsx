import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Bookmark,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    savedForLater,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
    removeFromSaved,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    freeShippingDiff,
  } = useCart();

  const isFreeShipping = shipping === 0 && subtotal > 0;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E3D9] mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-[#667168] mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your fresh market basket
            </p>
          </div>

          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#285943] hover:text-[#1D4232]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Polished Empty Cart State */
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs my-8">
            <div className="w-20 h-20 rounded-3xl bg-[#E9F0E7] flex items-center justify-center text-[#285943] mx-auto mb-5">
              <ShoppingBag className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h2 className="text-xl font-bold text-[#1D4232]">Your cart is empty</h2>
            <p className="text-sm text-[#667168] mt-2 max-w-sm mx-auto">
              Looks like you haven't added any fresh groceries or home goods yet. Explore our fresh aisles to start building your order.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <span>Explore Fresh Market</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Indicator */}
              <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#E5E3D9] shadow-xs">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <div className="flex items-center gap-2 text-[#285943]">
                    <Truck className="w-4 h-4" />
                    <span>
                      {isFreeShipping ? (
                        <strong className="text-[#28734D]">You've unlocked FREE 2-Hour Delivery!</strong>
                      ) : (
                        `Add $${freeShippingDiff.toFixed(2)} more for FREE delivery`
                      )}
                    </span>
                  </div>
                  <span className="text-[#667168]">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E9F0E7] overflow-hidden">
                  <div
                    className="h-full bg-[#285943] rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] divide-y divide-[#E5E3D9] overflow-hidden shadow-xs">
                {cartItems.map((item) => {
                  const p = item.product;
                  const productId = p.id || p.coffeeId;
                  const itemPrice = Number(p.price) || 0;
                  const itemTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={productId}
                      className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#F8F7F0]/40 transition-colors"
                    >
                      {/* Product Thumbnail & Details */}
                      <div className="flex items-center gap-4 flex-1">
                        <Link
                          to={`/details/${productId}`}
                          className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F8F7F0] border border-[#E5E3D9] shrink-0"
                        >
                          <ImageWithFallback
                            src={p.image || (p.images && p.images[0])}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        <div className="space-y-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#285943]">
                            {p.brand || 'Fresh Market'}
                          </span>
                          <Link
                            to={`/details/${productId}`}
                            className="text-sm sm:text-base font-bold text-[#252D27] hover:text-[#285943] line-clamp-1 transition-colors"
                          >
                            {p.name}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-[#667168]">
                            <span>${itemPrice.toFixed(2)} each</span>
                            {p.unit && <span>• {p.unit}</span>}
                          </div>

                          {/* Quick item actions */}
                          <div className="flex items-center gap-4 pt-1 text-xs">
                            <button
                              type="button"
                              onClick={() => saveForLater(productId)}
                              className="text-[#667168] hover:text-[#285943] flex items-center gap-1 font-medium transition-colors"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Save for later</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(productId)}
                              className="text-[#B83D32] hover:text-[#942E24] flex items-center gap-1 font-medium transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controller & Row Total */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E5E3D9]">
                        <div className="flex items-center border border-[#E5E3D9] rounded-xl bg-[#FFFFFF] p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(productId, item.quantity - 1)}
                            className="p-1.5 rounded-lg text-[#667168] hover:text-[#252D27] hover:bg-[#F8F7F0] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-[#1D4232]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(productId, item.quantity + 1)}
                            className="p-1.5 rounded-lg text-[#667168] hover:text-[#252D27] hover:bg-[#F8F7F0] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right sm:w-24">
                          <span className="text-base font-extrabold text-[#1D4232]">
                            ${itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Saved For Later Section */}
              {savedForLater.length > 0 && (
                <div className="mt-8 bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 shadow-xs">
                  <h3 className="text-base font-bold text-[#1D4232] mb-4 flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#285943]" />
                    <span>Saved for Later ({savedForLater.length})</span>
                  </h3>

                  <div className="divide-y divide-[#E5E3D9]">
                    {savedForLater.map((item) => {
                      const p = item.product;
                      const productId = p.id || p.coffeeId;

                      return (
                        <div
                          key={productId}
                          className="py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image || (p.images && p.images[0])}
                              alt={p.name}
                              className="w-14 h-14 rounded-xl object-cover border border-[#E5E3D9]"
                            />
                            <div>
                              <p className="text-sm font-bold text-[#252D27]">{p.name}</p>
                              <p className="text-xs text-[#667168]">${Number(p.price).toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => moveToCart(productId)}
                              className="px-3.5 py-1.5 rounded-xl bg-[#E9F0E7] hover:bg-[#285943] hover:text-white text-[#285943] text-xs font-bold transition-colors"
                            >
                              Move to Cart
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromSaved(productId)}
                              className="p-1.5 text-[#667168] hover:text-[#B83D32]"
                              aria-label="Delete saved item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Summary Column */}
            <div className="lg:col-span-4 sticky top-28 space-y-4">
              <div className="bg-[#FFFFFF] rounded-3xl border border-[#E5E3D9] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-[#1D4232] pb-4 border-b border-[#E5E3D9]">
                  Order Summary
                </h2>

                <div className="py-4 space-y-3 text-sm">
                  <div className="flex justify-between text-[#667168]">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-[#252D27]">${subtotal.toFixed(2)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#28734D]">
                      <span>Discounts & Savings</span>
                      <span className="font-semibold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#667168]">
                    <span>Estimated Shipping</span>
                    <span className="font-semibold text-[#252D27]">
                      {isFreeShipping ? (
                        <span className="text-[#28734D] font-bold">FREE</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#667168]">
                    <span>Estimated Sales Tax</span>
                    <span className="font-semibold text-[#252D27]">${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-[#E5E3D9] flex justify-between items-baseline">
                    <span className="text-base font-bold text-[#1D4232]">Total</span>
                    <span className="text-2xl font-black text-[#1D4232]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] text-[#1D4232] font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <p className="text-[11px] text-center text-[#667168] mt-3">
                  Safe and secure simulated checkout powered by AWS serverless architecture.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="bg-[#E9F0E7]/60 rounded-2xl border border-[#D5E1D3] p-4 text-xs space-y-2 text-[#285943]">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#285943]" />
                  <span>Freshness Guarantee</span>
                </div>
                <p className="text-[11px] text-[#667168]">
                  Not satisfied with any item in your basket? Get an instant replacement or refund with zero hassle.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
