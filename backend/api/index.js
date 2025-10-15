const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const recipeRoutes = require('../routes/recipes');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


let isConnected = false; 
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};
connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recipes', recipeRoutes);


module.exports = app;
