import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';

export const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlist.forEach((prod) => {
      addToCart(prod, 1);
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E3D9] mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-[#667168] mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for future orders
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleAddAllToCart}
                className="px-4 py-2.5 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] text-[#1D4232] font-black text-xs flex items-center gap-2 shadow-xs"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>Add All to Cart</span>
              </button>

              <button
                type="button"
                onClick={clearWishlist}
                className="px-4 py-2.5 rounded-xl border border-[#E5E3D9] hover:bg-[#FFFFFF] text-[#667168] hover:text-[#B83D32] font-semibold text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear List</span>
              </button>
            </div>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-12 text-center max-w-md mx-auto shadow-xs my-8">
            <div className="w-16 h-16 rounded-2xl bg-[#E9F0E7] text-[#B94A40] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 stroke-[1.8]" />
            </div>
            <h2 className="text-lg font-bold text-[#1D4232]">Your wishlist is empty</h2>
            <p className="text-xs text-[#667168] mt-1">
              Click the heart icon on any product card to bookmark it for later.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#285943] text-white font-bold text-xs hover:bg-[#1D4232]"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id || product.coffeeId} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
