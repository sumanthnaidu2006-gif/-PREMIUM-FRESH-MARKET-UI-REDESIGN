export type CategoryType =
  | 'Food and Groceries'
  | 'Snacks and Beverages'
  | 'Kitchen and Home'
  | 'Beauty and Personal Care'
  | 'Electronics'
  | 'Sports and Fitness'
  | 'Accessories';

export interface Product {
  id: string;
  coffeeId?: string; // Backwards-compatible with original DynamoDB schema
  name: string;
  brand: string;
  category: CategoryType;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  available: boolean;
  stockCount: number;
  images: string[];
  image: string;
  description: string;
  specifications: Record<string, string>;
  badges?: string[];
  unit?: string;
  weight?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  deliveryTime: string;
  price: number;
  description: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: {
    type: string;
    last4?: string;
    status: 'Paid' | 'Failed' | 'Demo Approved';
  };
}

export interface UserProfile {
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
}
