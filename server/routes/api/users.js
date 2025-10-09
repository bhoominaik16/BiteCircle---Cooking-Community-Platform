const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../../models/User');
const Recipe = require('../../models/Recipe');
const Collection = require('../../models/Collection');
const generateToken = require('../../utils/generateToken');
const { protect } = require('../../middleware/auth');

const router = express.Router();

router.post('/signup', asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await User.create({ name, email, password });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
}));

router.post('/login', asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
}));

router.get('/profile', protect, asyncHandler(async (req, res) => {
    res.json(req.user);
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.username = req.body.username || user.username;
        user.about = req.body.about || user.about;
        user.cuisine = req.body.cuisine || user.cuisine;
        user.profilePic = req.body.profilePic || user.profilePic;
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            username: updatedUser.username,
            about: updatedUser.about,
            cuisine: updatedUser.cuisine,
            profilePic: updatedUser.profilePic,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));

router.post('/collection', protect, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const newCollection = new Collection({
        user: req.user._id,
        name,
    });
    const createdCollection = await newCollection.save();
    res.status(201).json(createdCollection);
}));

router.get('/dashboard', protect, asyncHandler(async (req, res) => {
    const createdRecipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
    const likedRecipes = await Recipe.find({ likes: req.user._id });
    const collections = await Collection.find({ user: req.user._id });
    
    const stats = {
        recipesCreated: createdRecipes.length,
        recipesSaved: likedRecipes.length, 
        challengesJoined: 5,
        communityPoints: 350,
    };

    const recentActivities = createdRecipes.slice(0, 5).map(recipe => ({ 
        action: 'Uploaded',
        recipe: recipe.title,
        time: recipe.createdAt.toDateString(),
    }));

    res.json({
        stats,
        recentActivities,
        myCookbook: createdRecipes,
        likedRecipes,
        collections,
    });
}));

module.exports = router;