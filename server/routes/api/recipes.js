// server/routes/api/recipes.js
const express = require('express');
const asyncHandler = require('express-async-handler');
const Recipe = require('../../models/Recipe');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const Activity = require('../../models/Activity');
const { getAISuggestions } = require('../../utils/geminiAI');

const router = express.Router();

router.post('/ai-suggest', asyncHandler(async (req, res) => {
    const { query, ingredients, dietaryPreferences } = req.body;
    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }
    const aiResponse = await getAISuggestions(query, ingredients || [], dietaryPreferences || []);
    res.json(aiResponse);
}));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// FIX: Added .populate() to the main GET route
router.get('/', asyncHandler(async (req, res) => {
    const recipes = await Recipe.find({})
        .populate('user', 'name profilePic'); 
    res.json(recipes);
}));

router.get('/:id', asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
      .populate('user', 'name profilePic')
      .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'name profilePic'
        }
      });
      
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404);
        throw new Error('Recipe not found');
    }
}));

router.post('/', protect, upload.single('video'), asyncHandler(async (req, res) => {
    const {
        title,
        description,
        prepTime,
        cookTime,
        servings,
        difficulty,
        category,
        ingredients,
        steps,
        tags,
        dietary,
    } = req.body;

    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newRecipe = new Recipe({
        user: req.user._id,
        title,
        description,
        prepTime: parseInt(prepTime),
        cookTime: parseInt(cookTime),
        servings: parseInt(servings),
        difficulty,
        category,
        ingredients: JSON.parse(ingredients),
        steps: JSON.parse(steps),
        tags: JSON.parse(tags),
        dietary: JSON.parse(dietary),
        videoUrl,
    });

    const createdRecipe = await newRecipe.save();
    
    // Create an activity record
    await Activity.create({
        user: createdRecipe.user,
        recipe: createdRecipe._id,
        action: 'Uploaded',
    });
    
    // FIX: Return the populated recipe object so the frontend can display the user name immediately
    const populatedRecipe = await createdRecipe.populate('user', 'name profilePic');
    res.status(201).json(populatedRecipe);
}));

router.put('/:id/like', protect, asyncHandler(async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user._id;

    const recipe = await Recipe.findById(recipeId).populate('user');

    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    const isLiked = recipe.likes.includes(userId);

    if (isLiked) {
        recipe.likes.pull(userId);
    } else {
        recipe.likes.push(userId);

        // NEW: Create a persistent record of the like activity
        await Activity.create({
            user: recipe.user._id, 
            action: 'Liked',
            recipe: recipeId,
            liker: req.user._id, 
        });
        
        if (recipe.user._id.toString() !== userId.toString()) {
            const recipeAuthorId = recipe.user._id.toString();
            const likerName = req.user.name;
            
            const io = req.io;
            const userSocketMap = req.userSocketMap;
            const recipientSocketId = userSocketMap.get(recipeAuthorId);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('new_notification', {
                    type: 'like',
                    message: `${likerName} liked your recipe "${recipe.title}".`,
                    link: `/recipe/${recipeId}`
                });
            }
        }
    }

    await recipe.save();
    res.json({ message: 'Recipe liked/unliked successfully', likesCount: recipe.likes.length });
}));

module.exports = router;