export type UserRole = "customer" | "admin";
export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_disabled: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  specs: Record<string, string>;
  price: number;
  compare_at_price: number | null;
  category_id: string;
  brand_id: string;
  stock_quantity: number;
  sku: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  rating_avg: number;
  rating_count: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
  profile?: Pick<Profile, "full_name" | "avatar_url">;
}

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  tax: number;
  total: number;
  currency: string;
  shipping_address: Omit<Address, "id" | "user_id" | "is_default">;
  payment_status: PaymentStatus;
  payment_provider: string | null;
  payment_intent_id: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  product?: Pick<Product, "images" | "slug">;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}
