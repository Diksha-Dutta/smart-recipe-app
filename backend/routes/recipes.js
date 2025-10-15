
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');

const { GoogleGenAI } = require('@google/genai'); 
const User = require('../models/User'); 
const Recipe = require('../models/Recipe'); 
const multer = require('multer');

const router = express.Router();


const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY
});


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};


const storage = multer.memoryStorage();
const upload = multer({ storage });


function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType
    },
  };
}


router.post('/generate', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });


const { ingredients } = req.body;
const imageFile = req.file;


let ingredientsString = 'none';

if (Array.isArray(ingredients)) {
   
    ingredientsString = ingredients.join(', ');
} else if (typeof ingredients === 'string' && ingredients.trim() !== '') {

    ingredientsString = ingredients;
}

if (ingredientsString === 'none' && !imageFile) {
    return res.status(400).json({ message: 'Ingredients or an image is required' });
}

let promptText = `Generate a detailed recipe using these ingredients: ${ingredientsString || 'from the image'}.`;

if (imageFile) {
    promptText = `Generate a detailed recipe using the contents of the image and these ingredients (if provided): ${ingredientsString}.`;
}


    
    promptText += `
      Include:
      - Recipe name
      - Ingredients list
      - Step-by-step instructions
      - Approximate nutrition info
      Make it ${user.preferences?.difficulty || 'easy'} and suitable for a ${user.preferences?.diet || 'non-vegetarian'} diet.
      Output **only** the JSON object.
      Example JSON format:
      {"name":"...","ingredients":["..."],"steps":"...","nutrition":"...","difficulty":"...","diet":"..."}
    `;

  
    const contents = [];

       if (imageFile) {
      contents.push(fileToGenerativePart(imageFile.buffer, imageFile.mimetype));
    }

  
    contents.push({ text: promptText });

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: contents, 
      config: {
        temperature: 0.7,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json', 
      },
    });


    const aiText = aiResponse.text;
    
    
    if (!aiText || aiText.trim() === '') {
        console.error('AI response failed to generate text. Response:', JSON.stringify(aiResponse));
        return res.status(500).json({ 
            message: 'AI failed to generate a recipe. This may be due to the image or ingredients provided.' 
        });
    }

   
    let recipeData;
    try {
      
      const jsonString = aiText.replace(/^```json\s*|^\s*```|```\s*$/g, '').trim();
      recipeData = JSON.parse(jsonString);
    } catch (parseErr) {
      console.error('AI JSON parse error:', parseErr, 'Raw AI text:', aiText);
      return res.status(500).json({ message: 'Failed to parse AI response' });
    }

  
    const newRecipe = new Recipe({
      userId: user._id,
      ...recipeData
    });
    await newRecipe.save();

    res.json({ recipes: [newRecipe] });
  } catch (error) {
    console.error('Recipe generation error:', error);
    res.status(500).json({ message: 'Failed to generate recipe' });
  }
});


router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });

    const prompt = `You are a helpful chef AI. Answer the user's cooking question: ${message}`;


    const aiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 300
      }
    });

    const responseText = aiResponse.text;

    if (!responseText) {
        return res.status(500).json({ message: 'AI failed to respond.' });
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to get AI response' });
  }
});


router.post('/rate', authMiddleware, async (req, res) => {
  try {
    const { recipeId, rating } = req.body;
    const recipe = await Recipe.findOne({ _id: recipeId, userId: req.userId });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    recipe.rating = rating;
    await recipe.save();

    res.json({ message: 'Rating saved' });
  } catch (error) {
    console.error('Rate error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;