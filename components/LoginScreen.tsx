import React, { useState } from 'react';
import { User } from '../types';

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onDevOps: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onDevOps }) => {
  const [role, setRole] = useState<'customer' | 'staff' | null>(null);
  const [customerName, setCustomerName] = useState('');

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) return;
    onLogin({
      id: `cust-${Date.now()}`,
      name: customerName,
      role: 'customer'
    });
  };

  const handleStaffLogin = (staffRole: 'chef' | 'manager') => {
    onLogin({
      id: `${staffRole}-${Date.now()}`,
      name: staffRole === 'chef' ? 'Head Chef' : 'Restaurant Manager',
      role: staffRole
    });
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">DinePilot</h1>
          <p className="text-orange-100">Indian Cuisine Management System</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {!role ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 text-center mb-6">Select your role</h2>
              <button
                onClick={() => setRole('customer')}
                className="w-full bg-white border-2 border-orange-100 hover:border-orange-500 hover:bg-orange-50 p-4 rounded-xl flex items-center gap-4 transition-all group"
              >
                <div className="bg-orange-100 p-3 rounded-full text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">Customer</h3>
                  <p className="text-sm text-gray-500">Order food & view profile</p>
                </div>
              </button>

              <button
                onClick={() => setRole('staff')}
                className="w-full bg-white border-2 border-blue-100 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-xl flex items-center gap-4 transition-all group"
              >
                <div className="bg-blue-100 p-3 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">Restaurant Staff</h3>
                  <p className="text-sm text-gray-500">Chef & Manager Portal</p>
                </div>
              </button>
            </div>
          ) : role === 'customer' ? (
            <form onSubmit={handleCustomerLogin} className="space-y-6">
              <button type="button" onClick={() => setRole(null)} className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1">
                &larr; Back
              </button>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rahul, Priya"
                  className="w-full border-gray-300 border rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
                Enter Restaurant
              </button>
            </form>
          ) : (
            <div className="space-y-4">
               <button type="button" onClick={() => setRole(null)} className="text-sm text-gray-500 hover:text-orange-600 flex items-center gap-1">
                &larr; Back
              </button>
              <h3 className="font-bold text-gray-800 text-center">Select Staff Role</h3>
              <button
                onClick={() => handleStaffLogin('chef')}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>👨‍🍳 Chef Panel</span>
              </button>
              <button
                onClick={() => handleStaffLogin('manager')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>👔 Manager Dashboard</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
           <button onClick={onDevOps} className="text-xs text-gray-500 underline hover:text-gray-800">
             View DevOps & Code Configuration
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;