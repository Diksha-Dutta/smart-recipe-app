require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user); 
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();

    const updatedUser = await User.findById(req.userId).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/preferences', authMiddleware, async (req, res) => {
  try {
    const { diet, persons, difficulty, mealsPerDay, allergies } = req.body;

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.preferences = { diet, persons, difficulty, mealsPerDay, allergies };
    await user.save();

    res.json({ message: 'Preferences saved successfully', preferences: user.preferences });
  } catch (err) {
    console.error('Save preferences error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
