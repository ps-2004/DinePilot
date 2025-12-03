import React, { useState } from 'react';
import CustomerPanel from './components/CustomerPanel';
import ChefPanel from './components/ChefPanel';
import ManagerPanel from './components/ManagerPanel';
import DevOpsPanel from './components/DevOpsPanel';
import LoginScreen from './components/LoginScreen';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showDevOps, setShowDevOps] = useState(false);

  // If not logged in and not viewing DevOps, show Login
  if (!user && !showDevOps) {
    return <LoginScreen onLogin={setUser} onDevOps={() => setShowDevOps(true)} />;
  }

  const handleLogout = () => {
    setUser(null);
    setShowDevOps(false);
  };

  const renderContent = () => {
    if (showDevOps) return <DevOpsPanel />;
    if (!user) return null; // Should be handled by login screen

    switch (user.role) {
      case 'customer': return <CustomerPanel user={user} />;
      case 'chef': return <ChefPanel />;
      case 'manager': return <ManagerPanel />;
      default: return <div>Unknown Role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-orange-50/50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-orange-600 to-red-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDevOps(false)}>
              <div className="bg-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 className="text-white text-xl font-bold tracking-wide hidden sm:block">
                DinePilot<span className="font-light text-orange-200">POS</span>
              </h1>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {user && !showDevOps && (
                 <div className="text-right hidden sm:block">
                    <p className="text-xs text-orange-200 uppercase font-semibold">{user.role}</p>
                    <p className="text-sm text-white font-bold">{user.name}</p>
                 </div>
              )}

              {/* DevOps Toggle (Visible if logged in or viewing devops) */}
              <button 
                onClick={() => setShowDevOps(!showDevOps)} 
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${showDevOps ? 'bg-white text-orange-800' : 'bg-orange-800 text-orange-200 hover:bg-orange-700'}`}
              >
                {showDevOps ? 'Close Code' : 'DevOps/Code'}
              </button>

              {/* Logout */}
              <button 
                onClick={handleLogout} 
                className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
              >
                {user ? (
                   <>
                     <span>Logout</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                     </svg>
                   </>
                ) : (
                  <span>Back to Login</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm">
        <p>&copy; 2024 DinePilot Restaurant System. AWS Backend Simulated.</p>
      </footer>
    </div>
  );
};

export default App;