import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '', preferences: {} });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState({
    diet: '',
    difficulty: '',
    mealsPerDay: '',
    persons: '',
    allergies: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!res.ok) return navigate('/login');

        const data = await res.json();
        setUser(data);
        setName(data.name);
        setEmail(data.email);
        setPreferences(data.preferences || {});
      } catch (err) {
        console.error(err);
        setError('Failed to load profile.');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update profile.');
      } else {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handlePreferencesUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Failed to update preferences.');
      } else {
        const data = await res.json();
        setPreferences(data.preferences);
        alert('Preferences updated successfully!');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

  
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D99058] text-white p-3 rounded-lg hover:bg-[#AF6E4D] disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      <hr className="my-4" />

   
      <form onSubmit={handlePreferencesUpdate} className="space-y-4">
        <h3 className="text-xl font-semibold mb-2">Preferences</h3>

        <div>
          <label className="block text-sm font-medium mb-1">Diet</label>
          <input
            type="text"
            value={preferences.diet || ''}
            onChange={(e) => setPreferences({ ...preferences, diet: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            placeholder="e.g., vegetarian, vegan"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Difficulty</label>
          <input
            type="text"
            value={preferences.difficulty || ''}
            onChange={(e) => setPreferences({ ...preferences, difficulty: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            placeholder="easy, medium, hard"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Meals per Day</label>
          <input
            type="number"
            value={preferences.mealsPerDay || ''}
            onChange={(e) => setPreferences({ ...preferences, mealsPerDay: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            placeholder="Number of meals per day"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Persons</label>
          <input
            type="number"
            value={preferences.persons || ''}
            onChange={(e) => setPreferences({ ...preferences, persons: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            placeholder="Number of persons"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Allergies</label>
          <input
            type="text"
            value={preferences.allergies || ''}
            onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            placeholder="e.g., nuts, gluten"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D99058] text-white p-3 rounded-lg hover:bg-[#AF6E4D] disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Preferences'}
        </button>
      </form>

      {error && <p className="text-red-500 text-center">{error}</p>}
    </div>
  );
};

export default Profile;
