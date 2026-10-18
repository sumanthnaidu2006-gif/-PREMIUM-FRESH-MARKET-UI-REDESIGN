import React from 'react';
import { ArrowRight, Sparkles, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';

export const HeroBanner = ({ onShopNow, onExploreCategories }) => {
  return (
    <section className="relative overflow-hidden bg-[#E9F0E7] border-b border-[#D5E1D3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#D5E1D3] text-[#285943] text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-4 h-4 text-[#EFA36B]" />
              <span>Autumn Fresh Harvest • Farm-to-Door Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1D4232] tracking-tight leading-[1.15]">
              Everyday essentials, <br className="hidden sm:inline" />
              <span className="text-[#285943] underline decoration-[#EFA36B] decoration-wavy decoration-2">
                thoughtfully delivered.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#667168] max-w-xl leading-relaxed">
              Discover cold-pressed oils, hand-harvested produce, artisan coffees, chef-grade cookware, and clean botanical skincare — delivered to your doorstep in as little as 2 hours.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onShopNow}
                className="px-6 py-3.5 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] text-[#1D4232] font-bold text-sm sm:text-base flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>Shop Fresh Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={onExploreCategories}
                className="px-6 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F8F7F0] border border-[#285943]/20 text-[#285943] font-semibold text-sm sm:text-base transition-all hover:border-[#285943]"
              >
                Explore Categories
              </button>
            </div>

            {/* Micro Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#D5E1D3]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#285943] shrink-0" />
                <span className="text-xs font-semibold text-[#252D27]">Under 2-Hour Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#285943] shrink-0" />
                <span className="text-xs font-semibold text-[#252D27]">100% Quality Inspected</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#285943] shrink-0" />
                <span className="text-xs font-semibold text-[#252D27]">Direct Farm Sourced</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Decorative Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFFFF] aspect-4/3 sm:aspect-square bg-[#FFFFFF]">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=80"
                  alt="Fresh organic produce and market basket"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white p-3 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20">
                  <p className="text-xs font-bold text-[#EFA36B] uppercase tracking-wider">
                    Fresh Catch of the Day
                  </p>
                  <p className="text-sm font-semibold">
                    Organic California Haas Avocados & Single-Origin Coffees
                  </p>
                </div>
              </div>

              {/* Floating Pill Accent 1 */}
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 bg-[#FFFFFF] text-[#252D27] p-3 rounded-2xl shadow-xl border border-[#E5E3D9] flex items-center gap-2.5 animate-bounce duration-1000">
                <div className="w-8 h-8 rounded-xl bg-[#E9F0E7] flex items-center justify-center text-[#285943]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#667168]">Instant Delivery</p>
                  <p className="text-xs font-extrabold text-[#1D4232]">Arrives in 45 Mins</p>
                </div>
              </div>

              {/* Floating Pill Accent 2 */}
              <div className="absolute -bottom-3 -right-3 sm:-bottom-5 sm:-right-5 bg-[#1D4232] text-white p-3 rounded-2xl shadow-xl border border-[#285943] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#EFA36B] flex items-center justify-center text-[#1D4232] font-black text-xs">
                  5★
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-white/70">Verified Customer</p>
                  <p className="text-xs font-bold text-white">4.9 / 5 Store Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
