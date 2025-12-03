export enum OrderStatus {
  PLACED = 'Placed',
  COOKING = 'Cooking',
  READY = 'Ready',
  SERVED = 'Served',
}

export interface MenuItem {
  id: string;
  name: string;
  price: number; // INR
  category: 'Main' | 'Starter' | 'Bread' | 'Rice' | 'Dessert' | 'Beverage';
  description: string;
  image?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  customerName: string;
  staffAssigned?: string;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  name: string;
  role: 'customer' | 'chef' | 'manager';
}

export interface Staff {
  id: string;
  name: string;
}