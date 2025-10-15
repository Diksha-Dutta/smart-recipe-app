import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Preferences from './components/Preferences';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
       }
  }, [token]);

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/signup" element={<Signup setToken={setToken} />} />
      <Route path="/preferences" element={<Preferences />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login setToken={setToken} />} />
    </Routes>
  );
}

export default App;
