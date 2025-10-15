import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-70 bg-[#AF6E4D] text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Smart Recipe Generator</h2>
      <p className="mb-6 text-blue-200">Welcome, {user?.name || 'User'}</p>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full text-left p-3 rounded-lg hover:bg-[#D99058] transition-colors"
          >
            📦 Inventory Input & Recipe
          </button>
        </li>
      
        <li>
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full text-left p-3 rounded-lg hover:bg-[#D99058] transition-colors"
          >
            👤 Profile
          </button>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;