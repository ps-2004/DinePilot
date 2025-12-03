import { Order, OrderStatus, MenuItem } from '../types';

// Simulate a database with LocalStorage
const STORAGE_KEY = 'dinepilot_orders';

export const getOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const getOrdersByCustomer = (customerName: string): Order[] => {
  const allOrders = getOrders();
  // Case-insensitive match for demo purposes
  return allOrders.filter(o => o.customerName.toLowerCase() === customerName.toLowerCase()).reverse();
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const createOrder = (items: MenuItem[], total: number, customerName: string): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    id: `ORD-${Math.floor(Math.random() * 10000)}`,
    items: items.map(i => ({ ...i, quantity: 1 })), // Simplified for demo
    totalAmount: total,
    status: OrderStatus.PLACED,
    customerName,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: OrderStatus, staffId?: string): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === orderId);
  
  if (index === -1) return null;

  const order = orders[index];
  order.status = status;
  order.updatedAt = Date.now();
  if (staffId) order.staffAssigned = staffId;

  // Mock AWS SNS Trigger
  if (status === OrderStatus.READY || status === OrderStatus.SERVED) {
    console.log(`[AWS SNS MOCK] Publishing message: Order ${orderId} is ${status} for ${order.customerName}`);
  }

  orders[index] = order;
  saveOrders(orders);
  return order;
};

export const clearAllOrders = () => {
  localStorage.removeItem(STORAGE_KEY);
}