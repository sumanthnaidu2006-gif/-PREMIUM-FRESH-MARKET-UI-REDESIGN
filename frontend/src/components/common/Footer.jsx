import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';
import { CATEGORIES } from '../../utils/initialData';

export const Footer = () => {
  return (
    <footer className="bg-[#1D4232] text-white pt-16 pb-12 border-t border-[#285943]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Value Proposition Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Under 2-Hour Delivery</h4>
              <p className="text-xs text-white/70">Scheduled chill-pack direct delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Quality Inspected</h4>
              <p className="text-xs text-white/70">Hand-selected produce & artisanal goods</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Effortless Returns</h4>
              <p className="text-xs text-white/70">Instant refund or replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#285943] flex items-center justify-center text-[#EFA36B] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">AWS Serverless Secured</h4>
              <p className="text-xs text-white/70">Cognito auth & DynamoDB resilience</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12 border-b border-white/10 text-sm">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EFA36B] flex items-center justify-center text-[#1D4232]">
                <ShoppingBag className="w-5 h-5 text-[#1D4232] stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Fresh<span className="text-[#EFA36B]">Market</span>
              </span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              Your premium destination for farm-fresh organic food, specialty coffee, culinary cookware, natural skincare, and home essentials. Thoughtfully curated and delivered right to your kitchen counter.
            </p>
            <div className="pt-2 text-xs text-white/60">
              Operating nationwide across 42 metro zones with temperature-controlled fulfillment.
            </div>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#EFA36B] mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-white/80">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/?category=${encodeURIComponent(cat.name)}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#EFA36B] mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track Delivery
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Saved Addresses
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Admin */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#EFA36B] mb-4">
              Operations & Tech
            </h5>
            <ul className="space-y-2.5 text-xs text-white/80">
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
              <li className="text-white/60 text-[11px] leading-relaxed">
                AWS Lambda + DynamoDB backend with Amazon Cognito Authentication.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Fresh Market Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
