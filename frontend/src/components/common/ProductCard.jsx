import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Plus, Check } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const productId = product.id || product.coffeeId;
  const isWishlisted = isInWishlist(productId);

  const cartItem = cartItems.find((i) => (i.product.id || i.product.coffeeId) === productId);
  const cartQty = cartItem ? cartItem.quantity : 0;

  const currentPrice = Number(product.price) || 0;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = product.discountPercentage || (hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  const isAvailable = product.available !== false && (product.stockCount === undefined || product.stockCount > 0);

  const handleCardClick = () => {
    navigate(`/details/${productId}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (isAvailable) {
      addToCart(product, 1);
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-[#FFFFFF] rounded-2xl border border-[#E5E3D9] overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-[#285943]/30 cursor-pointer"
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-md bg-[#B94A40] text-white text-[11px] font-bold tracking-wide shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {product.badges && product.badges.includes('Bestseller') && (
            <span className="px-2 py-0.5 rounded-md bg-[#285943] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
              Bestseller
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`p-2 rounded-full backdrop-blur-xs transition-colors pointer-events-auto shadow-xs ${
            isWishlisted
              ? 'bg-[#B94A40] text-white'
              : 'bg-[#FFFFFF]/90 text-[#667168] hover:text-[#B94A40] hover:bg-[#FFFFFF]'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white stroke-white' : ''}`} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative overflow-hidden bg-[#F8F7F0] pt-2">
        <ImageWithFallback
          src={product.image || (product.images && product.images[0])}
          alt={product.name}
          aspectRatio="aspect-4/3"
          className="group-hover:scale-105 transition-transform duration-300"
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-[#667168] text-white text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-[#667168] mb-1">
            <span className="font-medium text-[#285943]">{product.brand || 'Fresh Market'}</span>
            <span className="truncate max-w-[100px]">{product.category}</span>
          </div>

          {/* Name */}
          <h3 className="font-semibold text-sm text-[#252D27] line-clamp-2 leading-snug group-hover:text-[#285943] transition-colors mb-2">
            {product.name}
          </h3>

          {/* Ratings & Reviews */}
          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <div className="flex items-center text-[#94651C]">
              <Star className="w-3.5 h-3.5 fill-[#94651C] stroke-none" />
              <span className="font-bold ml-1 text-[#252D27]">{product.rating || 4.8}</span>
            </div>
            <span className="text-[#667168]">({product.reviewsCount || 42})</span>
            {product.unit && (
              <span className="ml-auto text-[11px] text-[#667168] font-medium bg-[#E9F0E7] px-2 py-0.5 rounded-md">
                {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Action */}
        <div className="pt-3 border-t border-[#E5E3D9] flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-[#1D4232]">
                ${currentPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#667168] line-through font-normal">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className={`text-[10px] font-medium ${isAvailable ? 'text-[#28734D]' : 'text-[#B83D32]'}`}>
              {isAvailable ? 'In Stock • Ready to deliver' : 'Currently Unavailable'}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
              !isAvailable
                ? 'bg-[#E5E3D9] text-[#667168] cursor-not-allowed'
                : cartQty > 0
                ? 'bg-[#285943] text-white hover:bg-[#1D4232]'
                : 'bg-[#EFA36B] text-[#1D4232] hover:bg-[#E39257]'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {cartQty > 0 ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{cartQty} in Cart</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
