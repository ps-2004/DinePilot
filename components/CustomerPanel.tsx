import React, { useState, useEffect } from 'react';
import { MENU_ITEMS } from '../constants';
import { MenuItem, Order, OrderStatus, User } from '../types';
import { createOrder, getOrders, getOrdersByCustomer } from '../services/db';

interface CustomerPanelProps {
  user: User;
}

const CustomerPanel: React.FC<CustomerPanelProps> = ({ user }) => {
  const [view, setView] = useState<'menu' | 'profile'>('menu');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);

  // Fetch data
  const refreshData = () => {
    // Live orders for status (all active orders for context, or just ours)
    // For this demo, let's show user's active orders in sidebar
    const myOrders = getOrdersByCustomer(user.name);
    setOrderHistory(myOrders);
    setActiveOrders(myOrders.filter(o => o.status !== OrderStatus.SERVED));
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 3000);
    return () => clearInterval(interval);
  }, [user.name]);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    createOrder(cart, cartTotal, user.name);
    setCart([]);
    setView('profile'); // Switch to profile to see status
    refreshData();
    alert('Order Placed Successfully!');
  };

  return (
    <div>
      {/* Sub-nav for Customer */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 pb-1">
        <button 
          onClick={() => setView('menu')}
          className={`pb-2 px-1 font-medium transition-colors ${view === 'menu' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-orange-500'}`}
        >
          Menu & Order
        </button>
        <button 
          onClick={() => setView('profile')}
          className={`pb-2 px-1 font-medium transition-colors ${view === 'profile' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-orange-500'}`}
        >
          My Profile & History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area: Menu or Profile */}
        <div className="lg:col-span-2 space-y-6">
          {view === 'menu' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {MENU_ITEMS.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-orange-100 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                        <span className="font-semibold text-orange-600">₹{item.price}</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800 mb-2 inline-block">
                        {item.category}
                      </span>
                      <p className="text-gray-600 text-sm mt-1 mb-4">{item.description}</p>
                    </div>
                    <button
                      id={`add-${item.id}`}
                      onClick={() => addToCart(item)}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Add to Plate</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              {/* Profile Stats */}
              <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-100 p-4 rounded-full text-orange-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                        <p className="text-gray-500 text-sm">Customer since {new Date().getFullYear()}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-xs text-orange-800 uppercase font-bold">Total Orders</p>
                        <p className="text-2xl font-bold text-orange-600">{orderHistory.length}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-green-800 uppercase font-bold">Total Spent</p>
                        <p className="text-2xl font-bold text-green-600">₹{orderHistory.reduce((acc, o) => acc + o.totalAmount, 0)}</p>
                    </div>
                 </div>
              </div>

              {/* Order History */}
              <h3 className="text-xl font-bold text-gray-800">Your Order History</h3>
              {orderHistory.length === 0 ? (
                  <p className="text-gray-500 italic">No orders yet. Go to the Menu to place your first order!</p>
              ) : (
                  <div className="space-y-4">
                      {orderHistory.map(order => (
                          <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <span className="font-mono text-xs text-gray-400">#{order.id}</span>
                                      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                                  </div>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                      order.status === OrderStatus.SERVED ? 'bg-green-100 text-green-800' :
                                      order.status === OrderStatus.READY ? 'bg-green-500 text-white animate-pulse' :
                                      order.status === OrderStatus.COOKING ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                  }`}>
                                      {order.status}
                                  </span>
                              </div>
                              <div className="border-t border-gray-100 my-2 pt-2">
                                  <p className="text-sm text-gray-800 font-medium">
                                      {order.items.map(i => i.name).join(', ')}
                                  </p>
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                  <span className="text-gray-500 text-xs">{order.items.length} Items</span>
                                  <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Cart (Only visible in Menu view) */}
        {view === 'menu' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200 sticky top-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Your Plate
            </h2>
            
            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-2 rounded">
               Ordering as: <span className="font-bold text-gray-900">{user.name}</span>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-8">Your plate is empty.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">₹{item.price}</span>
                      <button onClick={() => removeFromCart(idx)} className="text-red-500 hover:text-red-700 font-bold">
                        &times;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-dashed border-gray-300">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <button
                id="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all transform active:scale-95 ${
                  cart.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Place Order
              </button>
            </div>
          </div>
          
           {/* Live Active Orders Mini View */}
           {activeOrders.length > 0 && (
             <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-2 text-sm">Preparing...</h4>
                {activeOrders.map(o => (
                    <div key={o.id} className="text-xs flex justify-between mb-1">
                        <span>Order #{o.id}</span>
                        <span className="font-bold">{o.status}</span>
                    </div>
                ))}
             </div>
           )}
        </div>
        )}
        
        {/* Sidebar Placeholder for Profile View */}
        {view === 'profile' && (
            <div className="hidden lg:block">
                 <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
                    <h3 className="font-bold text-xl mb-2">Did you know?</h3>
                    <p className="text-orange-100 text-sm">Our Butter Chicken is cooked for 6 hours to get that perfect creamy texture!</p>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPanel;