import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Plus,
  Minus,
  Check,
  Edit3,
  Trash2,
  Save,
  X,
  Share2,
} from 'lucide-react';
import { getCoffee, updateCoffee, deleteCoffee } from './utils/apis';
import { useCart } from './context/CartContext';
import { useWishlist } from './context/WishlistContext';
import { useToast } from './context/ToastContext';
import { useAppAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProductCard } from './components/common/ProductCard';
import { INITIAL_PRODUCTS } from './utils/initialData';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const { isAdmin } = useAppAuth();

  const [coffee, setCoffee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getCoffee(id)
      .then((data) => {
        if (data && data.Item) {
          const item = data.Item;
          setCoffee(item);
          setEditedProduct(item);
        } else {
          // Fallback search in initial products
          const fallback = INITIAL_PRODUCTS.find((p) => (p.id || p.coffeeId) === id);
          if (fallback) {
            setCoffee(fallback);
            setEditedProduct(fallback);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching item:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode && coffee) {
      setEditedProduct({ ...coffee });
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = {
        ...coffee,
        ...editedProduct,
        price: Number(editedProduct.price),
      };
      await updateCoffee(id, updated);
      setCoffee(updated);
      setEditMode(false);
      showToast('Product details updated successfully in DynamoDB catalog', 'success');
    } catch (err) {
      console.error('Failed to update:', err);
      showToast('Failed to update product details', 'error');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${coffee?.name}" from the inventory?`)) {
      try {
        await deleteCoffee(id);
        showToast('Product deleted from inventory', 'info');
        navigate('/');
      } catch (err) {
        console.error('Failed to delete:', err);
        showToast('Failed to delete product', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full animate-pulse">
          <div className="h-6 bg-[#E9F0E7] w-48 rounded-lg mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-6 aspect-square bg-[#E9F0E7] rounded-3xl" />
            <div className="lg:col-span-6 space-y-4">
              <div className="h-8 bg-[#E9F0E7] w-3/4 rounded-xl" />
              <div className="h-6 bg-[#E9F0E7] w-1/4 rounded-lg" />
              <div className="h-24 bg-[#E9F0E7] rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!coffee) {
    return (
      <div className="min-h-screen bg-[#F8F7F0] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-[#E9F0E7] flex items-center justify-center text-[#285943] mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D4232]">Product Not Found</h1>
          <p className="text-sm text-[#667168] mt-2 max-w-md">
            The item you are looking for may have been removed, sold out, or moved to another aisle.
          </p>
          <Link
            to="/"
            className="mt-6 px-6 py-2.5 rounded-xl bg-[#285943] text-white font-semibold text-sm hover:bg-[#1D4232] transition-colors"
          >
            Back to Fresh Market
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(coffee.id || coffee.coffeeId);
  const currentPrice = Number(coffee.price) || 0;
  const originalPrice = coffee.originalPrice ? Number(coffee.originalPrice) : null;
  const hasDiscount = originalPrice && originalPrice > currentPrice;
  const discountPercent = coffee.discountPercentage || (hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
  const isAvailable = coffee.available !== false;

  const imagesList = coffee.images && coffee.images.length > 0
    ? coffee.images
    : [coffee.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'];

  const relatedProducts = INITIAL_PRODUCTS
    .filter((p) => p.category === coffee.category && (p.id || p.coffeeId) !== (coffee.id || coffee.coffeeId))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isAvailable) {
      addToCart(coffee, quantity);
    }
  };

  const handleBuyNow = () => {
    if (isAvailable) {
      addToCart(coffee, quantity);
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      {/* Breadcrumb strip */}
      <div className="border-b border-[#E5E3D9] bg-[#FFFFFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-[#667168]">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#285943] flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
            <span>/</span>
            <span>{coffee.category || 'General'}</span>
            <span>/</span>
            <span className="text-[#252D27] font-semibold truncate max-w-[200px]">
              {coffee.name}
            </span>
          </div>

          {/* Admin Controls Toolbar */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-[#E9F0E7] text-[#285943] px-2 py-0.5 rounded-full font-bold">
                Admin Mode
              </span>
              <button
                onClick={toggleEditMode}
                className="px-2.5 py-1 rounded-lg border border-[#285943] text-[#285943] hover:bg-[#285943] hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                {editMode ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                <span>{editMode ? 'Cancel' : 'Edit Product'}</span>
              </button>
              <button
                onClick={handleDelete}
                className="px-2.5 py-1 rounded-lg border border-[#B83D32] text-[#B83D32] hover:bg-[#B83D32] hover:text-white transition-colors flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Responsive Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#E5E3D9] shadow-sm">
              <img
                src={imagesList[selectedImage] || imagesList[0]}
                alt={coffee.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-[#B94A40] text-white text-xs font-bold tracking-wider shadow-md">
                  {discountPercent}% OFF
                </span>
              )}
              <button
                type="button"
                onClick={() => toggleWishlist(coffee)}
                className={`absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-md shadow-md transition-colors ${
                  isWishlisted
                    ? 'bg-[#B94A40] text-white'
                    : 'bg-[#FFFFFF]/90 text-[#667168] hover:text-[#B94A40]'
                }`}
                aria-label="Toggle Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white stroke-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Selectors */}
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === idx
                        ? 'border-[#285943] ring-2 ring-[#285943]/20 shadow-sm'
                        : 'border-[#E5E3D9] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            {editMode ? (
              /* Admin Edit Mode Form */
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E5E3D9] space-y-4 shadow-sm">
                <h2 className="text-lg font-bold text-[#1D4232] flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#285943]" /> Edit DynamoDB Record
                </h2>

                <div>
                  <label className="block text-xs font-semibold text-[#667168] mb-1">Product Name</label>
                  <input
                    type="text"
                    value={editedProduct.name || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm focus:ring-2 focus:ring-[#285943]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#667168] mb-1">Brand</label>
                    <input
                      type="text"
                      value={editedProduct.brand || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#667168] mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editedProduct.price || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#667168] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editedProduct.image || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#667168] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={editedProduct.description || ''}
                    onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="edit-available"
                    checked={Boolean(editedProduct.available)}
                    onChange={(e) => setEditedProduct({ ...editedProduct, available: e.target.checked })}
                    className="w-4 h-4 text-[#285943] rounded-sm focus:ring-[#285943]"
                  />
                  <label htmlFor="edit-available" className="text-sm font-semibold text-[#252D27]">
                    In Stock & Available
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-[#E5E3D9]">
                  <button
                    onClick={handleUpdate}
                    className="flex-1 py-3 rounded-xl bg-[#285943] text-white font-bold text-sm hover:bg-[#1D4232] transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="py-3 px-5 rounded-xl border border-[#E5E3D9] text-[#667168] text-sm font-semibold hover:bg-[#F8F7F0]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Customer Product View */
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#285943] bg-[#E9F0E7] px-2.5 py-1 rounded-md">
                      {coffee.brand || 'Fresh Market Selection'}
                    </span>
                    <span className="text-xs text-[#667168]">• {coffee.category}</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1D4232] tracking-tight leading-snug">
                    {coffee.name}
                  </h1>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 bg-[#F8F7F0] px-2.5 py-1 rounded-lg border border-[#E5E3D9]">
                      <Star className="w-4 h-4 fill-[#94651C] text-[#94651C]" />
                      <span className="text-sm font-bold text-[#252D27]">{coffee.rating || 4.8}</span>
                    </div>
                    <span className="text-xs text-[#667168]">
                      Based on {coffee.reviewsCount || 142} verified customer reviews
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3D9] flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#1D4232]">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {hasDiscount && (
                        <span className="text-base text-[#667168] line-through font-normal">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#667168] mt-0.5 block">
                      Taxes calculated at checkout • {coffee.unit || 'Standard Package'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                        isAvailable
                          ? 'bg-[#E9F0E7] text-[#28734D]'
                          : 'bg-[#B83D32]/10 text-[#B83D32]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      {isAvailable ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#667168] mb-2">
                    About this Product
                  </h3>
                  <p className="text-sm text-[#252D27] leading-relaxed">
                    {coffee.description ||
                      'Crafted with uncompromising attention to purity and flavor. Sourced directly from trusted regional producers adhering to rigorous sustainable practices.'}
                  </p>
                </div>

                {/* Specifications List */}
                {coffee.specifications && (
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E5E3D9]">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#667168] mb-3">
                      Product Specifications
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {Object.entries(coffee.specifications).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-[#E5E3D9]/50 last:border-b-0">
                          <dt className="text-[#667168] font-medium">{key}:</dt>
                          <dd className="text-[#252D27] font-semibold text-right">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {/* Quantity and Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#E5E3D9] rounded-xl bg-[#FFFFFF] p-1 shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1 || !isAvailable}
                        className="p-2 rounded-lg text-[#667168] hover:text-[#252D27] hover:bg-[#F8F7F0] disabled:opacity-40 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-[#1D4232]">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={!isAvailable}
                        className="p-2 rounded-lg text-[#667168] hover:text-[#252D27] hover:bg-[#F8F7F0] disabled:opacity-40 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      disabled={!isAvailable}
                      onClick={handleAddToCart}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-[#EFA36B] hover:bg-[#E39257] disabled:bg-[#E5E3D9] text-[#1D4232] font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                      <span>Add to Cart</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={handleBuyNow}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#285943] hover:bg-[#1D4232] disabled:bg-[#E5E3D9] text-white font-bold text-sm transition-all shadow-md active:scale-95"
                  >
                    Buy Now
                  </button>
                </div>

                {/* Delivery Guarantees */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#E5E3D9] text-center text-xs text-[#667168]">
                  <div className="flex flex-col items-center gap-1 p-2">
                    <Truck className="w-4 h-4 text-[#285943]" />
                    <span className="font-semibold text-[#252D27]">Under 2-Hr</span>
                    <span className="text-[10px]">Cold-chain delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2">
                    <ShieldCheck className="w-4 h-4 text-[#285943]" />
                    <span className="font-semibold text-[#252D27]">100% Quality</span>
                    <span className="text-[10px]">Freshness verified</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2">
                    <RefreshCw className="w-4 h-4 text-[#285943]" />
                    <span className="font-semibold text-[#252D27]">Easy Returns</span>
                    <span className="text-[10px]">Instant refund promise</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Shelf */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-[#E5E3D9]">
            <h2 className="text-xl font-bold text-[#1D4232] mb-6">
              More in {coffee.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id || prod.coffeeId} product={prod} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetails;
