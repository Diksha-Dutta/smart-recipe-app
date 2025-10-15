import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const [diet, setDiet] = useState('');
  const [persons, setPersons] = useState(1);
  const [difficulty, setDifficulty] = useState('');
  const [mealsPerDay, setMealsPerDay] = useState(1);
  const [allergies, setAllergies] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        body: JSON.stringify({ diet, persons, difficulty, mealsPerDay, allergies }),
      });
      if (res.ok) {
        navigate('/dashboard');
      } else {
        setError('Failed to save preferences.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Set Preferences</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Diet Type</label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Diet</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="gluten-free">Gluten-Free</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Number of Persons</label>
            <input
              type="number"
              value={persons}
              onChange={(e) => setPersons(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cooking Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
              required
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Meals Per Day</label>
            <input
              type="number"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
              min="1"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Allergies/Illnesses</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
              placeholder="e.g., nuts, lactose"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#AF6E4D] text-white p-3 rounded-lg hover:bg-hover:bg-[#7B3F00]  disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Preferences;