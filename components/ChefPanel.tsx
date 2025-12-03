import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { getOrders, updateOrderStatus } from '../services/db';

const ChefPanel: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    const all = getOrders();
    // Chef only cares about Placed or Cooking
    const pending = all.filter(o => 
      o.status === OrderStatus.PLACED || o.status === OrderStatus.COOKING
    );
    setOrders(pending);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    fetchOrders();
    if (newStatus === OrderStatus.READY) {
      alert(`Order ${orderId} marked READY. SNS Notification sent!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Chef's Kitchen Display</h2>
        <span className="bg-red-100 text-red-800 px-4 py-1 rounded-full font-medium text-sm animate-pulse">
          {orders.length} Pending Orders
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-xl">Kitchen is clear. Relax!</p>
            </div>
        )}
        
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-lg border-t-4 border-orange-500 overflow-hidden flex flex-col">
            <div className="p-4 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">#{order.id}</h3>
                <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                order.status === OrderStatus.COOKING ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="p-4 flex-grow">
              <ul className="space-y-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700 font-medium border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                    <span>{item.name}</span>
                  </li>
                ))}
              </ul>
              {order.items.length > 3 && <p className="text-xs text-gray-400 mt-2 text-center">...</p>}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
              {order.status === OrderStatus.PLACED && (
                <button
                  onClick={() => handleStatusChange(order.id, OrderStatus.COOKING)}
                  className="btn-cook col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-colors"
                >
                  Start Cooking
                </button>
              )}
              {order.status === OrderStatus.COOKING && (
                <button
                  onClick={() => handleStatusChange(order.id, OrderStatus.READY)}
                  className="btn-ready col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold transition-colors shadow-sm"
                >
                  Mark Ready
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChefPanel;