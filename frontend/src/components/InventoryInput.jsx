import React, { useState } from 'react';

const InventoryInput = () => {
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecipes([]);

    try {
      const formData = new FormData();
      formData.append('ingredients', ingredients);
      if (image) formData.append('image', image);

      const res = await fetch('https://srecipegenerator-backend.vercel.app/api/recipes/generate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setRecipes(data.recipes || []);
      } else {
        setError(data.message || 'Failed to generate recipes.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate recipes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Inventory Input</h2>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Ingredients (comma-separated)</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="e.g., chicken, rice, broccoli"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Upload Image (Optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AF6E4D]"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-[#D99058] text-white p-3 rounded-lg hover:bg-[#AF6E4D] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Generating Recipes...' : 'Generate Recipes'}
        </button>
      </form>

      <div className="grid gap-6">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>

            {recipe.ingredients?.length > 0 && (
              <p className="text-gray-700 mb-2">
                <strong>Ingredients:</strong> {recipe.ingredients.join(', ')}
              </p>
            )}

            {recipe.steps && (
              <p className="text-gray-700 mb-2">
                <strong>Steps:</strong> {recipe.steps}
              </p>
            )}

            {recipe.nutrition && (
              <p className="text-gray-700 mb-2">
                <strong>Nutrition:</strong> {recipe.nutrition}
              </p>
            )}

            <p className="text-gray-700 mb-2">
              <strong>Difficulty:</strong> {recipe.difficulty || 'N/A'}
            </p>

            <p className="text-gray-700 mb-4">
              <strong>Diet:</strong> {recipe.diet || 'N/A'}
            </p>

    
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} className="text-yellow-400">
                  ★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryInput;
