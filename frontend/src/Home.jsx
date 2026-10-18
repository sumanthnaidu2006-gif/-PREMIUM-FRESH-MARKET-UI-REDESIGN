import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCoffees } from './utils/apis';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroBanner } from './components/home/HeroBanner';
import { CategoryTiles } from './components/home/CategoryTiles';
import { ProductSection } from './components/home/ProductSection';
import { ProductCard } from './components/common/ProductCard';
import { X, ShoppingBag } from 'lucide-react';
import { INITIAL_PRODUCTS } from './utils/initialData';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const categoriesRef = useRef(null);
  const productsRef = useRef(null);

  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || null;
  const isDealsOnly = searchParams.get('deals') === 'true';

  useEffect(() => {
    setLoading(true);
    fetchCoffees()
      .then((data) => {
        setProducts(data.Items || []);
      })
      .catch((err) => {
        console.error('Error loading fresh products:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectCategory = (catName) => {
    if (!catName) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catName);
    }
    setSearchParams(searchParams);
  };

  const handleClearFilters = () => {
    setSearchParams({});
  };

  const scrollToCategories = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProducts = () => {
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Curated Section Splits
  const bestsellers = useMemo(
    () => products.filter((p) => p.badges && p.badges.includes('Bestseller')).slice(0, 4),
    [products]
  );

  const trendingDeals = useMemo(
    () =>
      products
        .filter((p) => (p.originalPrice && p.originalPrice > p.price) || (p.badges && p.badges.includes('Trending Deals')))
        .slice(0, 4),
    [products]
  );

  const newArrivals = useMemo(
    () => products.filter((p) => p.badges && p.badges.includes('New Arrivals')).slice(0, 4),
    [products]
  );

  const kitchenEssentials = useMemo(
    () => products.filter((p) => p.category === 'Kitchen and Home').slice(0, 4),
    [products]
  );

  const beautyCare = useMemo(
    () => products.filter((p) => p.category === 'Beauty and Personal Care').slice(0, 4),
    [products]
  );

  const recommendedProducts = useMemo(
    () => products.filter((p) => p.badges && p.badges.includes('Recommended')).slice(0, 4),
    [products]
  );

  // Filtered view when search, category, or deals filter is active
  const filteredCatalog = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = searchQuery
        ? (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesCat = categoryParam ? p.category === categoryParam : true;

      const matchesDeals = isDealsOnly
        ? (p.originalPrice && p.originalPrice > p.price) || (p.badges && p.badges.includes('Trending Deals'))
        : true;

      return matchesSearch && matchesCat && matchesDeals;
    });
  }, [products, searchQuery, categoryParam, isDealsOnly]);

  const isFilteringActive = Boolean(searchQuery || categoryParam || isDealsOnly);

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      {/* Hero Banner (Shown on main home view) */}
      {!isFilteringActive && (
        <HeroBanner
          onShopNow={scrollToProducts}
          onExploreCategories={scrollToCategories}
        />
      )}

      {/* Category Tiles Section */}
      <div ref={categoriesRef}>
        <CategoryTiles
          activeCategory={categoryParam}
          onSelectCategory={handleSelectCategory}
        />
      </div>

      <main ref={productsRef} className="flex-1">
        {isFilteringActive ? (
          /* Filtered Results View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E3D9] mb-8 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#285943]">
                  Search & Aisles
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
                  {categoryParam
                    ? categoryParam
                    : searchQuery
                    ? `Results for "${searchQuery}"`
                    : 'Trending Deals'}
                </h1>
                <p className="text-xs text-[#667168] mt-1">
                  Showing {filteredCatalog.length} available fresh items
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 rounded-xl border border-[#E5E3D9] bg-[#FFFFFF] hover:bg-[#F8F7F0] text-xs font-bold text-[#667168] hover:text-[#B83D32] flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear All Filters</span>
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-3/4 bg-[#E9F0E7] rounded-2xl" />
                ))}
              </div>
            ) : filteredCatalog.length === 0 ? (
              <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs my-8">
                <div className="w-16 h-16 rounded-2xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-[#1D4232]">No matching products found</h2>
                <p className="text-xs text-[#667168] mt-1 max-w-xs mx-auto">
                  Try checking your spelling or explore our popular departments.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#285943] text-white font-bold text-xs hover:bg-[#1D4232]"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredCatalog.map((prod) => (
                  <ProductCard key={prod.id || prod.coffeeId} product={prod} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Editorial Homepage Hierarchy */
          <div className="pb-16">
            {/* 1. Bestsellers */}
            <ProductSection
              title="Customer Bestsellers"
              subtitle="The most-ordered groceries and daily kitchen staples this week"
              badge="Top Rated"
              badgeColor="bg-[#285943]"
              products={bestsellers}
              onViewAll={() => handleSelectCategory('Food and Groceries')}
            />

            {/* 2. Trending Deals */}
            <div className="bg-[#E9F0E7]/40">
              <ProductSection
                title="Trending Deals & Seasonal Discounts"
                subtitle="Exclusive savings on cold-pressed pantry essentials and organic snacks"
                badge="Limited Time"
                badgeColor="bg-[#B94A40]"
                products={trendingDeals}
                onViewAll={() => {
                  searchParams.set('deals', 'true');
                  setSearchParams(searchParams);
                }}
              />
            </div>

            {/* 3. New Arrivals */}
            <ProductSection
              title="New Harvest & Artisan Arrivals"
              subtitle="Fresh additions sourced from local small-batch and eco-certified makers"
              badge="Just Arrived"
              badgeColor="bg-[#285943]"
              products={newArrivals}
              onViewAll={() => handleSelectCategory('Snacks and Beverages')}
            />

            {/* 4. Kitchen and Home Essentials */}
            <div className="bg-[#FFFFFF]">
              <ProductSection
                title="Kitchen & Culinary Essentials"
                subtitle="Enamelled cast iron, Damascus knives, and European flax linen"
                badge="Home Living"
                badgeColor="bg-[#1D4232]"
                products={kitchenEssentials}
                onViewAll={() => handleSelectCategory('Kitchen and Home')}
              />
            </div>

            {/* 5. Beauty and Personal Care */}
            <ProductSection
              title="Clean Beauty & Botanical Care"
              subtitle="Non-toxic, cold-pressed face oils and artisan goat milk soaps"
              badge="Botanical"
              badgeColor="bg-[#285943]"
              products={beautyCare}
              onViewAll={() => handleSelectCategory('Beauty and Personal Care')}
            />

            {/* 6. Recommended Products */}
            {recommendedProducts.length > 0 && (
              <div className="bg-[#E9F0E7]/30">
                <ProductSection
                  title="Recommended for Your Kitchen"
                  subtitle="Curated pairing recommendations for thoughtful cooking and living"
                  badge="Handpicked"
                  badgeColor="bg-[#285943]"
                  products={recommendedProducts}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;