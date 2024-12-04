export type ProductCategory = 'iptv' | 'vod' | 'charing' | string;

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: ProductCategory;
  description?: string;
  paymentLink?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: ProductCategory;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Slide {
  id: number;
  url: string;
  title: string;
  description: string;
}

export interface PaymentRecord {
  id: string;
  productId: number;
  amount: number;
  customerEmail: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  delivered: boolean;
}