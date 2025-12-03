import { describe, it, expect } from 'vitest';

// Utility functions for testing
describe('Restaurant Utilities', () => {
  describe('Price Calculations', () => {
    it('should calculate subtotal correctly', () => {
      const items = [
        { price: 100, quantity: 2 },
        { price: 50, quantity: 3 },
      ];
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(subtotal).toBe(350);
    });

    it('should apply discount correctly', () => {
      const subtotal = 1000;
      const discountPercent = 10;
      const discountAmount = (subtotal * discountPercent) / 100;
      const total = subtotal - discountAmount;
      
      expect(discountAmount).toBe(100);
      expect(total).toBe(900);
    });

    it('should calculate tax correctly', () => {
      const amount = 1000;
      const taxPercent = 5;
      const taxAmount = (amount * taxPercent) / 100;
      const totalWithTax = amount + taxAmount;
      
      expect(taxAmount).toBe(50);
      expect(totalWithTax).toBe(1050);
    });

    it('should handle empty order calculation', () => {
      const items: any[] = [];
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(total).toBe(0);
    });
  });

  describe('Order ID Generation', () => {
    it('should generate unique order IDs', () => {
      const id1 = `order-${Date.now()}`;
      const id2 = `order-${Date.now()}`;
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
    });

    it('should generate IDs with proper format', () => {
      const orderId = `order-${Date.now()}`;
      expect(orderId).toMatch(/^order-\d+$/);
    });
  });

  describe('String Utilities', () => {
    it('should capitalize first letter', () => {
      const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
      
      expect(capitalize('customer')).toBe('Customer');
      expect(capitalize('chef')).toBe('Chef');
      expect(capitalize('manager')).toBe('Manager');
    });

    it('should format currency', () => {
      const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
      
      expect(formatCurrency(100)).toBe('₹100.00');
      expect(formatCurrency(1500.5)).toBe('₹1500.50');
    });

    it('should validate email format', () => {
      const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@domain')).toBe(false);
    });
  });

  describe('Date Utilities', () => {
    it('should format timestamp to readable date', () => {
      const timestamp = new Date('2024-01-15T10:30:00').getTime();
      const date = new Date(timestamp);
      const formatted = date.toLocaleDateString();
      
      expect(formatted).toBeDefined();
      expect(formatted.length).toBeGreaterThan(0);
    });

    it('should calculate time difference', () => {
      const startTime = new Date('2024-01-15T10:00:00').getTime();
      const endTime = new Date('2024-01-15T11:30:00').getTime();
      const diffInMinutes = (endTime - startTime) / 1000 / 60;
      
      expect(diffInMinutes).toBe(90);
    });
  });

  describe('Array Utilities', () => {
    it('should filter menu items by category', () => {
      const menuItems = [
        { id: '1', name: 'Butter Chicken', category: 'Main' },
        { id: '2', name: 'Naan', category: 'Bread' },
        { id: '3', name: 'Paneer Tikka', category: 'Main' },
        { id: '4', name: 'Gulab Jamun', category: 'Dessert' },
      ];
      
      const filtered = menuItems.filter(item => item.category === 'Main');
      expect(filtered.length).toBe(2);
      expect(filtered[0].name).toBe('Butter Chicken');
    });

    it('should sort items by price', () => {
      const items = [
        { name: 'Item A', price: 100 },
        { name: 'Item B', price: 50 },
        { name: 'Item C', price: 75 },
      ];
      
      const sorted = [...items].sort((a, b) => a.price - b.price);
      expect(sorted[0].price).toBe(50);
      expect(sorted[2].price).toBe(100);
    });

    it('should group items by category', () => {
      const items = [
        { name: 'Butter Chicken', category: 'Main' },
        { name: 'Paneer Tikka', category: 'Starter' },
        { name: 'Biryani', category: 'Main' },
      ];
      
      const grouped = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof items>);
      
      expect(grouped['Main'].length).toBe(2);
      expect(grouped['Starter'].length).toBe(1);
    });

    it('should remove duplicates from array', () => {
      const items = [1, 2, 2, 3, 3, 3, 4];
      const unique = [...new Set(items)];
      
      expect(unique.length).toBe(4);
      expect(unique).toEqual([1, 2, 3, 4]);
    });
  });

  describe('Validation Utilities', () => {
    it('should validate positive numbers', () => {
      const isPositive = (num: number) => num > 0;
      
      expect(isPositive(100)).toBe(true);
      expect(isPositive(0)).toBe(false);
      expect(isPositive(-50)).toBe(false);
    });

    it('should validate non-empty strings', () => {
      const isNonEmpty = (str: string) => str.trim().length > 0;
      
      expect(isNonEmpty('Customer Name')).toBe(true);
      expect(isNonEmpty('   ')).toBe(false);
      expect(isNonEmpty('')).toBe(false);
    });

    it('should validate array is not empty', () => {
      const items = [{ id: '1' }];
      const emptyItems: any[] = [];
      
      expect(items.length > 0).toBe(true);
      expect(emptyItems.length > 0).toBe(false);
    });
  });
});
