const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  ingredients: [String],
  steps: [String],
  nutrition: String,
  difficulty: String,
  diet: String,
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);