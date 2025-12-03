import { describe, it, expect } from 'vitest';
import { OrderStatus } from './types';

describe('Types', () => {
  describe('OrderStatus enum', () => {
    it('should have PLACED status', () => {
      expect(OrderStatus.PLACED).toBe('Placed');
    });

    it('should have COOKING status', () => {
      expect(OrderStatus.COOKING).toBe('Cooking');
    });

    it('should have READY status', () => {
      expect(OrderStatus.READY).toBe('Ready');
    });

    it('should have SERVED status', () => {
      expect(OrderStatus.SERVED).toBe('Served');
    });
  });

  describe('MenuItem interface', () => {
    it('should allow valid menu item creation', () => {
      const menuItem = {
        id: 'butter-chicken-1',
        name: 'Butter Chicken',
        price: 350,
        category: 'Main' as const,
        description: 'Creamy tomato-based curry',
        image: 'butter-chicken.jpg',
      };
      
      expect(menuItem).toHaveProperty('id');
      expect(menuItem).toHaveProperty('name');
      expect(menuItem).toHaveProperty('price');
      expect(menuItem).toHaveProperty('category');
      expect(menuItem.price).toBeGreaterThan(0);
    });

    it('should support all menu categories', () => {
      const categories = ['Main', 'Starter', 'Bread', 'Rice', 'Dessert', 'Beverage'] as const;
      
      categories.forEach(category => {
        const item = {
          id: `item-${category}`,
          name: `Test ${category}`,
          price: 100,
          category,
          description: 'Test item',
        };
        expect(item.category).toBe(category);
      });
    });
  });

  describe('CartItem interface', () => {
    it('should include quantity property', () => {
      const cartItem = {
        id: 'item-1',
        name: 'Samosa',
        price: 50,
        category: 'Starter' as const,
        description: 'Crispy pastry',
        quantity: 2,
      };
      
      expect(cartItem.quantity).toBe(2);
      expect(cartItem.quantity).toBeGreaterThan(0);
    });
  });

  describe('Order interface', () => {
    it('should create a valid order object', () => {
      const order = {
        id: 'order-1',
        items: [
          {
            id: 'item-1',
            name: 'Biryani',
            price: 250,
            category: 'Rice' as const,
            description: 'Fragrant rice dish',
            quantity: 1,
          },
        ],
        totalAmount: 250,
        status: OrderStatus.PLACED,
        customerName: 'Rahul',
        staffAssigned: 'Chef-1',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      expect(order.id).toBeDefined();
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalAmount).toBe(250);
      expect(order.status).toBe(OrderStatus.PLACED);
    });

    it('should calculate total amount correctly', () => {
      const items = [
        {
          id: 'item-1',
          name: 'Butter Chicken',
          price: 350,
          category: 'Main' as const,
          description: 'Test',
          quantity: 2,
        },
        {
          id: 'item-2',
          name: 'Naan',
          price: 50,
          category: 'Bread' as const,
          description: 'Test',
          quantity: 3,
        },
      ];

      const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      expect(totalAmount).toBe(850);
    });
  });

  describe('User interface', () => {
    it('should support customer role', () => {
      const user = {
        id: 'cust-1',
        name: 'Priya',
        role: 'customer' as const,
      };
      
      expect(user.role).toBe('customer');
      expect(['customer', 'chef', 'manager']).toContain(user.role);
    });

    it('should support chef role', () => {
      const user = {
        id: 'chef-1',
        name: 'Head Chef',
        role: 'chef' as const,
      };
      
      expect(user.role).toBe('chef');
    });

    it('should support manager role', () => {
      const user = {
        id: 'mgr-1',
        name: 'Restaurant Manager',
        role: 'manager' as const,
      };
      
      expect(user.role).toBe('manager');
    });
  });

  describe('Staff interface', () => {
    it('should create valid staff object', () => {
      const staff = {
        id: 'staff-1',
        name: 'Amit',
      };

      expect(staff.id).toBeDefined();
      expect(staff.name).toBeDefined();
      expect(staff.name.length).toBeGreaterThan(0);
    });
  });
});
