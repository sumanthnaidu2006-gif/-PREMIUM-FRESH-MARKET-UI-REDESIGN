import React from 'react';
import {
  Apple,
  Coffee,
  UtensilsCrossed,
  Sparkles,
  Cpu,
  Activity,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { CATEGORIES } from '../../utils/initialData';

const CATEGORY_ICONS = {
  'Food and Groceries': Apple,
  'Snacks and Beverages': Coffee,
  'Kitchen and Home': UtensilsCrossed,
  'Beauty and Personal Care': Sparkles,
  'Electronics': Cpu,
  'Sports and Fitness': Activity,
  'Accessories': ShoppingBag,
};

export const CategoryTiles = ({ activeCategory, onSelectCategory }) => {
  return (
    <section className="py-12 bg-[#F8F7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#285943] mb-1">
              <span>Department Aisles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1D4232] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-[#667168] mt-1">
              Explore freshly sourced produce, pantry essentials, wellness gear, and home staples.
            </p>
          </div>

          {activeCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-xs font-semibold text-[#285943] hover:text-[#1D4232] underline underline-offset-4 self-start sm:self-auto"
            >
              Reset to all categories
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.name] || ShoppingBag;
            const isSelected = activeCategory === cat.name;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(isSelected ? null : cat.name)}
                className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-200 flex flex-col justify-between p-3 sm:p-3.5 ${
                  isSelected
                    ? 'border-[#285943] ring-2 ring-[#285943] bg-[#E9F0E7] shadow-md scale-[1.02]'
                    : 'border-[#E5E3D9] bg-[#FFFFFF] hover:border-[#285943]/40 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Visual Image container */}
                <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden mb-3 bg-[#E9F0E7]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#285943] shadow-xs">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                </div>

                {/* Category Details */}
                <div>
                  <h3 className={`text-xs sm:text-sm font-bold line-clamp-2 leading-tight transition-colors ${
                    isSelected ? 'text-[#1D4232]' : 'text-[#252D27] group-hover:text-[#285943]'
                  }`}>
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-[#667168] font-medium block mt-1">
                    {cat.itemCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
