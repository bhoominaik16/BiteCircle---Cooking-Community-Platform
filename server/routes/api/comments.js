const express = require('express');
const asyncHandler = require('express-async-handler');
const Comment = require('../../models/Comment');
const Recipe = require('../../models/Recipe');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// @desc    Post a new comment on a recipe
// @route   POST /api/comments/:recipeId
// @access  Private
router.post('/:recipeId', protect, asyncHandler(async (req, res) => {
    const { text, triedRecipe } = req.body;
    const { recipeId } = req.params;
    const userId = req.user._id;

    if (!text || !recipeId) {
        res.status(400);
        throw new Error('Comment text and recipe ID are required.');
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        res.status(404);
        throw new Error('Recipe not found');
    }

    const comment = new Comment({
        user: userId,
        recipe: recipeId,
        text,
        triedRecipe: triedRecipe || false
    });

    const createdComment = await comment.save();

    recipe.comments.push(createdComment._id);
    await recipe.save();

    const populatedComment = await createdComment.populate('user', 'name profilePic');
    
    if (req.io) {
        req.io.emit('new_activity', {
            type: 'comment',
            data: {
                user: req.user.name,
                recipeTitle: recipe.title,
                recipeId: recipe._id,
                comment: populatedComment
            }
        });
    }

    res.status(201).json(populatedComment);
}));

module.exports = router;