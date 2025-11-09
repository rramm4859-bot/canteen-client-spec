export interface Student {
  studentId: string;
  name: string;
  college: string;
  email?: string;
  contact?: string;
  year?: string;
  preferences?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: 'Vegetarian' | 'Non-Vegetarian' | 'Juices' | 'Desserts';
  image?: string;
  available: boolean;
  description?: string;
  unavailableNote?: string;
}

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface HistoryEntry {
  entryId: string;
  timestamp: string;
  type: 'order' | 'received' | 'prepared' | 'unavailable';
  studentId: string;
  studentName: string;
  items: CartItem[];
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
}

export interface Rating {
  ratingId: string;
  entryId: string;
  studentId: string;
  serviceRating: number;
  tasteRating: number;
  comments?: string;
  timestamp: string;
}

export interface InventoryItem {
  itemId: string;
  name: string;
  quantity: number;
  threshold: number;
}

export interface College {
  collegeName: string;
  password: string;
}
