const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  preferences: {
    diet: String,
    persons: Number,
    difficulty: String,
    mealsPerDay: Number,
    allergies: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);