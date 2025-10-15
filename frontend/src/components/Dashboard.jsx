import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import InventoryInput from './InventoryInput';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-[#FFEFD5]">
      <Sidebar user={user} setActiveTab={setActiveTab} />
      <div className="flex-1 p-6">
        {activeTab === 'inventory' && <InventoryInput />}
       
      </div>
    </div>
  );
};

export default Dashboard;