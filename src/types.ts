export interface Product {
  id: string;
  name: string;
  category: "savon" | "huile" | "soin" | "coffret";
  categoryLabel: string;
  price: number; // in TND (Tunisian Dinar)
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string;
  isPopular?: boolean;
  stock: number;
  weight?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Message {
  id: string;
  sender: "user" | "selma";
  text: string;
  timestamp: Date;
}

export interface TrackingStep {
  status: string;
  description: string;
  date: string;
  location: string;
  completed: boolean;
  isCurrent: boolean;
}

export interface TrackingInfo {
  number: string;
  senderName: string;
  recipientName: string;
  destination: string;
  estimatedDelivery: string;
  carrier: string;
  steps: TrackingStep[];
}

export interface OrderDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "cod" | "card";
  cartItems: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}
