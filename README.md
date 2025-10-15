# Smart Recipe Generator

## Overview

Smart Recipe Generator is a full-stack web application that allows users to generate personalized recipes based on their available ingredients, dietary preferences, and cooking skill level. Users can sign up, log in, set preferences, input inventory, and interact with a recipe chat assistant. The app features a modern UI built with React and Tailwind CSS, and a robust backend with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: Secure signup and login using JSON Web Tokens (JWT).
- **Dietary Preferences**: Customize recipes by diet (vegetarian, vegan, gluten-free, non-vegetarian), number of persons, cooking difficulty, meals per day, and allergies.
- **Inventory Input**: Input ingredients and optionally upload images to generate tailored recipes.
- **Recipe Chat**: Interact with an AI-powered assistant for recipe suggestions and cooking tips.
- **Profile Management**: Update user profile details (name, email).
- **Responsive Design**: Clean, user-friendly interface styled with Tailwind CSS.
- **RESTful API**: Backend API for authentication, user management, and recipe generation.

## Tech Stack

- **Frontend**:
  - React (v18.2.0)
  - React Router (v6.8.0)
  - Tailwind CSS (v3.4.1)
- **Backend**:
  - Node.js
  - Express (v4.18.2)
  - MongoDB with Mongoose (v7.5.0)
  - JSON Web Tokens (jsonwebtoken v9.0.2)
  - bcryptjs (v2.4.3) for password hashing
- **Environment**:
  - MongoDB (local or MongoDB Atlas)
  - dotenv (v16.3.1) for environment variables


## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm (v8 or higher)
- Git (optional, for version control)
- PowerShell or Command Prompt (for Windows)

## Setup Instructions

### 1. Clone the Repository
If using Git:
```bash
git clone <repository-url>
cd smart-recipe-app
```


## Usage

 - **Sign Up**:

Navigate to http://localhost:3000/signup.
Enter name, email, and password (min 6 characters).
Redirects to Preferences page.


 - **Set Preferences**:

Select diet type, number of persons, cooking difficulty, meals per day, and allergies.
Save to proceed to Dashboard.


 - **Dashboard**:

Inventory Input: Enter comma-separated ingredients and optionally upload an image to generate recipes.
Recipe Chat: Ask for recipe ideas or cooking tips via the chat assistant.
Profile: Update name and email.


- **Logout**:

Click "Logout" in the sidebar to clear session and return to Login.



- **API Endpoints**:

Auth:

POST /api/auth/signup: Create user (name, email, password).
POST /api/auth/login: Authenticate user, return JWT.


User:

GET /api/user: Get user details (requires JWT).
PUT /api/user: Update user profile (requires JWT).
POST /api/user/preferences: Save dietary preferences (requires JWT).


Recipes:

POST /api/recipes/generate: Generate recipes from ingredients (requires JWT).
POST /api/recipes/chat: Interact with recipe chat assistant (requires JWT).
