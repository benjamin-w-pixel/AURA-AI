export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const mockProducts: Product[] = [
  { id: '1', name: 'Ultra Boost Sneakers', price: 120, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', category: 'Footwear' },
  { id: '2', name: 'Leather Tech Backpack', price: 85, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', category: 'Accessories' },
  { id: '3', name: 'Wireless Noise-Cancelling Headphones', price: 250, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', category: 'Electronics' },
  { id: '4', name: 'Minimalist Watch', price: 150, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', category: 'Accessories' },
];

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  products: Product[];
  type: 'related' | 'personalized' | 'trending';
}
