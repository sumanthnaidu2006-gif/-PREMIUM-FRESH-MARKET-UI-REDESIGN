import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, ChevronRight, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { useAppAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const OrdersPage = () => {
  const { orders } = useAppAuth();

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E3D9] mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
              Order History
            </h1>
            <p className="text-xs sm:text-sm text-[#667168] mt-1">
              Track active fresh shipments and view receipts from past orders
            </p>
          </div>

          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-[#285943] text-white text-xs font-bold hover:bg-[#1D4232] transition-colors"
          >
            Shop More
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-[#1D4232]">No orders placed yet</h2>
            <p className="text-xs text-[#667168] mt-1">
              Your order history will appear here once you make your first purchase.
            </p>
            <Link
              to="/"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-[#EFA36B] text-[#1D4232] font-black text-xs hover:bg-[#E39257]"
            >
              Browse Fresh Aisles
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl overflow-hidden shadow-xs hover:border-[#285943]/30 transition-all"
                >
                  {/* Order Top Strip */}
                  <div className="bg-[#F8F7F0] p-4 sm:p-6 border-b border-[#E5E3D9] flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                      <div>
                        <span className="text-[#667168] block text-[10px] uppercase font-bold">Order Placed</span>
                        <span className="font-semibold text-[#252D27]">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-[#667168] block text-[10px] uppercase font-bold">Order #</span>
                        <span className="font-mono font-bold text-[#1D4232]">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#667168] block text-[10px] uppercase font-bold">Total Amount</span>
                        <span className="font-extrabold text-[#1D4232]">${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-[#E9F0E7] text-[#28734D]'
                            : order.status === 'Processing'
                            ? 'bg-[#EFA36B]/20 text-[#94651C]'
                            : 'bg-[#285943]/10 text-[#285943]'
                        }`}
                      >
                        {order.status === 'Delivered' ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        <span>{order.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Order Items & Fulfillment Summary */}
                  <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 rounded-xl object-cover border border-[#E5E3D9] shrink-0"
                          />
                          <div className="flex-1">
                            <span className="text-[10px] font-bold text-[#285943] uppercase">
                              {item.brand}
                            </span>
                            <p className="text-sm font-bold text-[#252D27] line-clamp-1">{item.name}</p>
                            <p className="text-xs text-[#667168]">
                              Qty: {item.quantity} • ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination Mini Summary */}
                    <div className="lg:col-span-4 bg-[#F8F7F0] p-4 rounded-2xl border border-[#E5E3D9] text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-[#285943] font-bold">
                        <MapPin className="w-4 h-4" />
                        <span>Delivered to {order.deliveryAddress?.city}</span>
                      </div>
                      <p className="text-[#667168]">
                        {order.deliveryAddress?.street}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.postalCode}
                      </p>
                      <div className="pt-1 text-[11px] text-[#285943] font-semibold flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>{order.shippingMethod?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
