import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';
import { getOrders, updateOrderStatus, clearAllOrders } from '../services/db';
import { STAFF_LIST } from '../constants';

const ManagerPanel: React.FC = () => {
  const [readyOrders, setReadyOrders] = useState<Order[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Record<string, string>>({});

  const fetchData = () => {
    const all = getOrders();
    setReadyOrders(all.filter(o => o.status === OrderStatus.READY));
    setHistory(all.filter(o => o.status === OrderStatus.SERVED).reverse());
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignAndServe = (orderId: string) => {
    const staffId = selectedStaff[orderId];
    if (!staffId) {
      alert("Please assign a staff member first.");
      return;
    }
    updateOrderStatus(orderId, OrderStatus.SERVED, staffId);
    fetchData();
    alert(`Order ${orderId} marked SERVED. SMS Notification sent to customer.`);
  };

  const handleStaffSelect = (orderId: string, staffId: string) => {
    setSelectedStaff(prev => ({...prev, [orderId]: staffId}));
  };

  const calculateTotalRevenue = () => history.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Ready Orders</p>
             <h3 className="text-3xl font-bold text-orange-600">{readyOrders.length}</h3>
           </div>
           <div className="p-3 bg-orange-100 rounded-full text-orange-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Orders Served</p>
             <h3 className="text-3xl font-bold text-green-600">{history.length}</h3>
           </div>
           <div className="p-3 bg-green-100 rounded-full text-green-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
           <div>
             <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
             <h3 className="text-3xl font-bold text-blue-600">₹{calculateTotalRevenue()}</h3>
           </div>
           <div className="p-3 bg-blue-100 rounded-full text-blue-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
      </div>

      {/* Ready Orders Action Area */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Ready for Service</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Staff</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {readyOrders.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No orders ready for service.</td>
                </tr>
              ) : (
                readyOrders.map((order) => (
                    <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {order.items.map(i => i.name).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border"
                            value={selectedStaff[order.id] || ""}
                            onChange={(e) => handleStaffSelect(order.id, e.target.value)}
                        >
                            <option value="">Select Waiter...</option>
                            {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                            onClick={() => handleAssignAndServe(order.id)}
                            className="btn-serve bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Mark Served
                        </button>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Log */}
      <div>
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-gray-800">Served History (Log)</h2>
             <button onClick={() => { clearAllOrders(); fetchData(); }} className="text-red-500 text-sm hover:underline">Reset System Data</button>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-4 h-64 overflow-y-auto border border-gray-200">
            {history.map(order => (
                <div key={order.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <div>
                        <span className="font-mono text-xs text-gray-500 mr-2">{order.id}</span>
                        <span className="text-sm font-medium text-gray-800">{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                            Served by: {STAFF_LIST.find(s => s.id === order.staffAssigned)?.name || 'Unknown'}
                        </span>
                        <span className="text-sm font-bold text-green-600">Served</span>
                    </div>
                </div>
            ))}
            {history.length === 0 && <p className="text-center text-gray-400 mt-10">No history yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default ManagerPanel;