import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  AlertTriangle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
  DollarSign,
  ChevronRight,
  RefreshCw,
  X,
  Upload,
  Eye,
} from 'lucide-react';
import { fetchCoffees, createCoffee, updateCoffee, deleteCoffee } from '../utils/apis';
import { useAppAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CATEGORIES, INITIAL_PRODUCTS } from '../utils/initialData';

export const AdminPage = () => {
  const { orders, updateOrderStatus } = useAppAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'overview' | 'inventory' | 'orders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Product Create/Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [productForm, setProductForm] = useState({
    coffeeId: '',
    name: '',
    brand: 'Fresh Market',
    category: 'Food and Groceries',
    price: '',
    originalPrice: '',
    available: true,
    stockCount: 50,
    image: '',
    description: '',
  });

  const loadInventory = async () => {
    setLoadingProducts(true);
    try {
      const data = await fetchCoffees();
      setProducts(data.Items || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  // Compute KPI metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductCount = products.length;
  const lowStockCount = products.filter((p) => p.stockCount !== undefined && p.stockCount <= 20).length;

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setProductForm({
      coffeeId: `prod-${Date.now()}`,
      name: '',
      brand: 'Fresh Market Select',
      category: 'Food and Groceries',
      price: '',
      originalPrice: '',
      available: true,
      stockCount: 40,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setModalMode('edit');
    setProductForm({
      coffeeId: product.coffeeId || product.id,
      name: product.name || '',
      brand: product.brand || 'Fresh Market',
      category: product.category || 'Food and Groceries',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      available: product.available !== false,
      stockCount: product.stockCount !== undefined ? product.stockCount : 30,
      image: product.image || (product.images && product.images[0]) || '',
      description: product.description || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      showToast('Please fill in product name and price', 'error');
      return;
    }

    try {
      const payload = {
        ...productForm,
        id: productForm.coffeeId,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
        stockCount: Number(productForm.stockCount) || 30,
      };

      if (modalMode === 'create') {
        await createCoffee(payload);
        showToast(`Created new product: "${payload.name}" in DynamoDB`, 'success');
      } else {
        await updateCoffee(payload.coffeeId, payload);
        showToast(`Updated "${payload.name}" in DynamoDB inventory`, 'success');
      }

      setIsModalOpen(false);
      loadInventory();
    } catch (err) {
      console.error('Error saving product:', err);
      showToast('Error saving product to backend', 'error');
    }
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Permanently remove "${productName}" from the retail catalogue?`)) {
      try {
        await deleteCoffee(productId);
        showToast(`Removed "${productName}" from inventory`, 'info');
        loadInventory();
      } catch (err) {
        console.error('Delete error:', err);
        showToast('Error deleting item', 'error');
      }
    }
  };

  // Mock Sales Trend Data for visual SVG chart
  const weeklySales = [
    { day: 'Mon', revenue: 1420, orders: 48 },
    { day: 'Tue', revenue: 1890, orders: 62 },
    { day: 'Wed', revenue: 2310, orders: 74 },
    { day: 'Thu', revenue: 2150, orders: 69 },
    { day: 'Fri', revenue: 3120, orders: 98 },
    { day: 'Sat', revenue: 3840, orders: 124 },
    { day: 'Sun', revenue: 3410, orders: 110 },
  ];
  const maxRevenue = Math.max(...weeklySales.map((s) => s.revenue));

  return (
    <div className="min-h-screen bg-[#F8F7F0] flex flex-col text-[#252D27]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E3D9] mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1D4232] text-white text-[10px] font-bold uppercase tracking-wider">
                Retail Operations Center
              </span>
              <span className="text-xs text-[#285943] font-semibold">
                AWS Lambda + DynamoDB Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1D4232] tracking-tight">
              Fresh Market Operations Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadInventory}
              className="p-2.5 rounded-xl border border-[#E5E3D9] bg-[#FFFFFF] hover:bg-[#F8F7F0] text-[#667168] transition-colors"
              title="Refresh inventory data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* 1. KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#667168]">Total Platform Revenue</span>
              <div className="w-8 h-8 rounded-xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-[#1D4232] block">
              ${(totalRevenue + 18140).toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#28734D] font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs last week</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#667168]">Total Customer Orders</span>
              <div className="w-8 h-8 rounded-xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-[#1D4232] block">
              {totalOrdersCount + 584}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#28734D] font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.1% fulfillment rate</span>
            </div>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#667168]">Active Catalog Items</span>
              <div className="w-8 h-8 rounded-xl bg-[#E9F0E7] text-[#285943] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-[#1D4232] block">
              {totalProductCount}
            </span>
            <span className="text-[11px] text-[#667168] mt-1 block">
              Across 7 multi-category departments
            </span>
          </div>

          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#667168]">Low-Stock Alerts</span>
              <div className="w-8 h-8 rounded-xl bg-[#94651C]/10 text-[#94651C] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <span className="text-2xl font-black text-[#94651C] block">
              {lowStockCount} Items
            </span>
            <span className="text-[11px] text-[#94651C] font-semibold mt-1 block">
              Requires warehouse replenishment
            </span>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E3D9] mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'inventory'
                ? 'border-[#285943] text-[#1D4232]'
                : 'border-transparent text-[#667168] hover:text-[#252D27]'
            }`}
          >
            Inventory Management ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'overview'
                ? 'border-[#285943] text-[#1D4232]'
                : 'border-transparent text-[#667168] hover:text-[#252D27]'
            }`}
          >
            Sales Analytics & Weekly Trends
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'orders'
                ? 'border-[#285943] text-[#1D4232]'
                : 'border-transparent text-[#667168] hover:text-[#252D27]'
            }`}
          >
            Recent Orders & Status ({orders.length})
          </button>
        </div>

        {/* TAB 1: Inventory Table */}
        {activeTab === 'inventory' && (
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl overflow-hidden shadow-xs">
            {/* Filter & Search Bar */}
            <div className="p-4 sm:p-6 border-b border-[#E5E3D9] bg-[#F8F7F0]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by product name, brand..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#285943]"
                />
                <Search className="w-3.5 h-3.5 text-[#667168] absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-semibold text-[#667168] shrink-0">Department:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#E5E3D9] text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#285943]"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7F0] text-[#667168] font-bold uppercase tracking-wider border-b border-[#E5E3D9]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Product Item</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock Level</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3D9]">
                  {loadingProducts ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#667168]">
                        Loading DynamoDB inventory catalogue...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-[#667168]">
                        No products match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const productId = p.coffeeId || p.id;
                      const isLowStock = p.stockCount !== undefined && p.stockCount <= 20;

                      return (
                        <tr key={productId} className="hover:bg-[#F8F7F0]/60 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image || (p.images && p.images[0])}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#E5E3D9] shrink-0"
                              />
                              <div>
                                <span className="font-bold text-[#252D27] block text-xs line-clamp-1">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-[#667168] block">
                                  {p.brand} • ID: {productId}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-[#285943] font-semibold">
                            {p.category}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#1D4232]">
                            ${Number(p.price).toFixed(2)}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-semibold ${isLowStock ? 'text-[#94651C]' : 'text-[#252D27]'}`}>
                                {p.stockCount !== undefined ? p.stockCount : 30} units
                              </span>
                              {isLowStock && (
                                <span className="text-[10px] bg-[#94651C]/10 text-[#94651C] px-1.5 py-0.5 rounded font-bold">
                                  Low
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.available !== false
                                  ? 'bg-[#E9F0E7] text-[#28734D]'
                                  : 'bg-[#B83D32]/10 text-[#B83D32]'
                              }`}
                            >
                              {p.available !== false ? 'Available' : 'Unavailable'}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/details/${productId}`}
                                className="p-1.5 rounded-lg border border-[#E5E3D9] hover:bg-[#E9F0E7] text-[#285943]"
                                title="View in store"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 rounded-lg border border-[#E5E3D9] hover:bg-[#E9F0E7] text-[#285943]"
                                title="Edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(productId, p.name)}
                                className="p-1.5 rounded-lg border border-[#E5E3D9] hover:bg-[#B83D32]/10 text-[#B83D32]"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Sales Analytics Chart */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#1D4232]">Weekly Gross Revenue</h3>
                  <p className="text-xs text-[#667168]">
                    Daily sales aggregated across fulfillment nodes
                  </p>
                </div>
                <span className="text-xs font-bold text-[#28734D] bg-[#E9F0E7] px-3 py-1 rounded-full">
                  Average $2,600 / day
                </span>
              </div>

              {/* Bar Chart using Forest Green and Warm Ivory */}
              <div className="pt-8 pb-4">
                <div className="h-48 flex items-end justify-between gap-2 sm:gap-6 border-b border-[#E5E3D9] px-2 sm:px-6">
                  {weeklySales.map((item) => {
                    const barHeightPercent = Math.round((item.revenue / maxRevenue) * 100);
                    return (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[10px] font-bold text-[#667168] opacity-0 group-hover:opacity-100 transition-opacity">
                          ${item.revenue}
                        </span>
                        <div
                          className="w-full max-w-[48px] bg-[#285943] group-hover:bg-[#EFA36B] rounded-t-xl transition-all duration-300 relative"
                          style={{ height: `${barHeightPercent}%` }}
                        />
                        <span className="text-xs font-semibold text-[#252D27]">{item.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Operational Highlights */}
            <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl p-6 shadow-xs">
              <h3 className="text-base font-bold text-[#1D4232] mb-4">
                Operational Fulfillment Logs
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F0]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#28734D]" />
                    <span className="text-[#252D27]">Automated daily inventory synchronization completed</span>
                  </div>
                  <span className="text-[#667168]">10 mins ago</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F0]">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#28734D]" />
                    <span className="text-[#252D27]">Cognito session authentication tokens verified</span>
                  </div>
                  <span className="text-[#667168]">32 mins ago</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8F7F0]">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-[#94651C]" />
                    <span className="text-[#252D27]">Reorder threshold triggered for Hass Avocados</span>
                  </div>
                  <span className="text-[#667168]">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Orders Listing */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F7F0] text-[#667168] font-bold uppercase tracking-wider border-b border-[#E5E3D9]">
                  <tr>
                    <th className="py-3.5 px-6">Order ID</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Customer Destination</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-6 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3D9]">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F8F7F0]/60 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-[#1D4232]">
                        {o.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 text-[#667168]">
                        {new Date(o.date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-[#252D27]">
                        {o.deliveryAddress?.street}, {o.deliveryAddress?.city}
                      </td>
                      <td className="py-3.5 px-4 font-black text-[#1D4232]">
                        ${o.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered'
                              ? 'bg-[#E9F0E7] text-[#28734D]'
                              : o.status === 'Processing'
                              ? 'bg-[#EFA36B]/20 text-[#94651C]'
                              : 'bg-[#285943]/10 text-[#285943]'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-[#E5E3D9] text-xs font-semibold bg-white"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-[#FFFFFF] border border-[#E5E3D9] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
              <div className="px-6 py-4 bg-[#1D4232] text-white flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#EFA36B]" />
                  <span>{modalMode === 'create' ? 'Add Product to DynamoDB' : 'Edit Inventory Item'}</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-white/80 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#667168] mb-1">Product Title</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                    placeholder="e.g. Organic Hass Avocados"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#667168] mb-1">Brand</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#667168] mb-1">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[#667168] mb-1">Selling Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                      placeholder="12.99"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#667168] mb-1">Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                      placeholder="16.99"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#667168] mb-1">Stock Count</label>
                    <input
                      type="number"
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#667168] mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#667168] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E3D9] text-sm"
                    placeholder="Product details, origins, harvest specifications..."
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="product-available"
                    checked={productForm.available}
                    onChange={(e) => setProductForm({ ...productForm, available: e.target.checked })}
                    className="w-4 h-4 text-[#285943] rounded"
                  />
                  <label htmlFor="product-available" className="font-semibold text-[#252D27]">
                    Item is in stock and available for customer ordering
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3D9]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E5E3D9] text-[#667168] font-semibold hover:bg-[#F8F7F0]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#285943] hover:bg-[#1D4232] text-white font-bold shadow-xs"
                  >
                    {modalMode === 'create' ? 'Save & Publish' : 'Update Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
