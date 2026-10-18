import { INITIAL_PRODUCTS } from './initialData';

const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://46435jfhh7.execute-api.us-east-1.amazonaws.com").replace(/\/+$/, '');

const getAccessToken = () => {
    try {
        const sessionStoragKeys = Object.keys(sessionStorage);
        const oidcKey = sessionStoragKeys.find(key => key.startsWith("oidc.user:https://cognito-idp."));
        if (!oidcKey) return undefined;
        const oidcContext = JSON.parse(sessionStorage.getItem(oidcKey) || "{}");
        const accessToken = oidcContext?.access_token || oidcContext?.id_token;
        return accessToken;
    } catch {
        return undefined;
    }
};

export const deleteAccessToken = () => {
    try {
        const sessionStoragKeys = Object.keys(sessionStorage);
        const oidcKey = sessionStoragKeys.find(key => key.startsWith("oidc.user:https://cognito-idp."));
        if (oidcKey) {
            sessionStorage.removeItem(oidcKey);
        }
    } catch (e) {
        console.error("Error clearing access token:", e);
    }
};

// Local storage cache key for user-added products (in case backend is offline or for instant responsiveness)
const LOCAL_PRODUCTS_KEY = 'fresh_market_custom_products';

const getLocalCustomProducts = () => {
    try {
        const stored = localStorage.getItem(LOCAL_PRODUCTS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const saveLocalCustomProduct = (product) => {
    try {
        const existing = getLocalCustomProducts();
        const updated = [...existing.filter(p => (p.id || p.coffeeId) !== (product.id || product.coffeeId)), product];
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Error saving local product:", e);
    }
};

const deleteLocalCustomProduct = (id) => {
    try {
        const existing = getLocalCustomProducts();
        const updated = existing.filter(p => (p.id || p.coffeeId) !== id);
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    } catch (e) {
        console.error("Error deleting local product:", e);
    }
};

export const fetchCoffees = async () => {
    let backendItems = [];
    try {
        const token = getAccessToken();
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Try primary /api/products route first
        let response = await fetch(`${API_BASE_URL}/api/products`, {
            method: "GET",
            headers,
        });

        // Fallback to /coffee if /api/products is not available
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/coffee`, {
                method: "GET",
                headers,
            });
        }

        if (response.ok) {
            const data = await response.json();
            // Supports both { products: [...] } and { Items: [...] }
            backendItems = data.products || data.Items || (Array.isArray(data) ? data : []);
        }
    } catch (err) {
        console.warn("API Gateway fetch failed or offline, falling back to local dataset:", err);
    }

    // Merge backend items with initial products and locally added products
    const custom = getLocalCustomProducts();
    const allCustom = [...backendItems, ...custom];

    // Combine while ensuring no duplicate IDs
    const merged = [...INITIAL_PRODUCTS];
    allCustom.forEach(item => {
        const normalized = {
            id: item.id || item.coffeeId || `custom-${Date.now()}`,
            coffeeId: item.coffeeId || item.id,
            name: item.name || 'Artisan Product',
            brand: item.brand || 'Fresh Market',
            category: item.category || 'Food and Groceries',
            price: Number(item.currentPrice || item.price) || 9.99,
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            discountPercentage: item.discountPercentage || 0,
            rating: Number(item.rating) || 4.8,
            reviewsCount: item.reviewCount || item.reviewsCount || 12,
            available: item.isActive !== false && item.available !== false,
            stockCount: item.stockQuantity || item.stockCount || 20,
            image: item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
            images: item.images || [item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'],
            description: item.description || 'Premium fresh product thoughtfully sourced from ethical farms and producers.',
            specifications: item.specifications || { 'Origin': 'Locally Sourced', 'Standard': 'Fresh Market Verified' },
            badges: item.badge ? [item.badge] : (item.badges || (item.isNewArrival ? ['New Arrivals'] : (item.isTrendingDeal ? ['Trending Deals'] : ['Bestseller']))),
        };
        const idx = merged.findIndex(p => p.id === normalized.id);
        if (idx >= 0) {
            merged[idx] = normalized;
        } else {
            merged.unshift(normalized);
        }
    });

    return { Items: merged };
};

export const getCoffee = async (id) => {
    try {
        const token = getAccessToken();
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Try /api/products/{id} first
        let response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: "GET",
            headers,
        });

        // Fallback to /coffee/{id}
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/coffee/${id}`, {
                method: "GET",
                headers,
            });
        }

        if (response.ok) {
            const data = await response.json();
            const product = data.product || data.Item || data;
            if (product && (product.id || product.coffeeId)) {
                return {
                    Item: {
                        id: product.id || product.coffeeId,
                        coffeeId: product.coffeeId || product.id,
                        name: product.name,
                        brand: product.brand || 'Fresh Market',
                        category: product.category || 'Food and Groceries',
                        price: Number(product.currentPrice || product.price),
                        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
                        discountPercentage: product.discountPercentage || 0,
                        rating: Number(product.rating) || 4.8,
                        reviewsCount: product.reviewCount || product.reviewsCount || 24,
                        available: product.isActive !== false && product.available !== false,
                        stockCount: product.stockQuantity || product.stockCount || 20,
                        image: product.image,
                        images: product.images || [product.image],
                        description: product.description,
                        specifications: product.specifications || {},
                        badges: product.badge ? [product.badge] : (product.badges || []),
                    }
                };
            }
        }
    } catch (err) {
        console.warn(`API Gateway fetch for product ${id} failed:`, err);
    }

    // Check custom products then initial products
    const custom = getLocalCustomProducts();
    const foundCustom = custom.find(p => (p.id || p.coffeeId) === id);
    if (foundCustom) {
        return { Item: foundCustom };
    }

    const foundInitial = INITIAL_PRODUCTS.find(p => (p.id || p.coffeeId) === id);
    if (foundInitial) {
        return { Item: foundInitial };
    }

    return { Item: null };
};

export const createCoffee = async (coffee) => {
    let result = null;
    try {
        const token = getAccessToken();
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        let response = await fetch(`${API_BASE_URL}/api/admin/products`, {
            method: "POST",
            headers,
            body: JSON.stringify(coffee),
        });
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/coffee`, {
                method: "POST",
                headers,
                body: JSON.stringify(coffee),
            });
        }
        if (response.ok) {
            result = await response.json();
        }
    } catch (err) {
        console.warn("API Gateway POST failed:", err);
    }

    saveLocalCustomProduct(coffee);
    return result || { success: true, item: coffee };
};

export const updateCoffee = async (id, coffee) => {
    let result = null;
    try {
        const token = getAccessToken();
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        let response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
            method: "PUT",
            headers,
            body: JSON.stringify(coffee),
        });
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/coffee/${id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(coffee),
            });
        }
        if (response.ok) {
            result = await response.json();
        }
    } catch (err) {
        console.warn(`API Gateway PUT for product ${id} failed:`, err);
    }

    saveLocalCustomProduct({ ...coffee, id, coffeeId: id });
    return result || { success: true, item: coffee };
};

export const deleteCoffee = async (id) => {
    let result = null;
    try {
        const token = getAccessToken();
        const headers = { "Content-Type": "application/json" };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        let response = await fetch(`${API_BASE_URL}/api/admin/products/${id}`, {
            method: "DELETE",
            headers,
        });
        if (!response.ok) {
            response = await fetch(`${API_BASE_URL}/coffee/${id}`, {
                method: "DELETE",
                headers,
            });
        }
        if (response.ok) {
            result = await response.json();
        }
    } catch (err) {
        console.warn(`API Gateway DELETE for product ${id} failed:`, err);
    }

    deleteLocalCustomProduct(id);
    return result || { success: true, id };
};