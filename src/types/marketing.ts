export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface AbandonedCart {
  id: string;
  userId: string;
  items: CartItem[];
  totalValue: number;
  abandonedAt: number;
  status: 'abandoned' | 'recovered' | 'email_sent';
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  lastEdited: number;
}
