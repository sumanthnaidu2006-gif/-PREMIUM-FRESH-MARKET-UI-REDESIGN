import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCard } from '../common/ProductCard';

export const ProductSection = ({
  title,
  subtitle,
  badge,
  badgeColor = 'bg-[#285943]',
  products = [],
  viewAllLink,
  onViewAll,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 border-b border-[#E5E3D9]/60 last:border-b-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            {badge && (
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-white text-[10px] font-bold uppercase tracking-wider mb-2 ${badgeColor}`}>
                <Sparkles className="w-3 h-3 text-[#EFA36B]" />
                {badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-[#1D4232] tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#667168] mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {(viewAllLink || onViewAll) && (
            <button
              type="button"
              onClick={onViewAll}
              className="group flex items-center gap-1.5 text-xs font-bold text-[#285943] hover:text-[#1D4232] transition-colors self-start sm:self-auto"
            >
              <span>Explore All ({products.length})</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product.coffeeId} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
