const express = require('express');
const asyncHandler = require('express-async-handler');
const Activity = require('../../models/Activity');
const { protect } = require('../../middleware/auth');

const router = express.Router();

// @desc    Get recent activities for the logged-in user
// @route   GET /api/activity
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
    // Find all activities where the logged-in user is the recipient of the activity (e.g., liked, commented on their recipe)
    const activities = await Activity.find({ user: req.user._id })
                                     .sort({ createdAt: -1 })
                                     .populate('recipe', 'title') // Populate the recipe title for display
                                     .populate('liker', 'name profilePic') // Populate the name of the user who performed the action
                                     .limit(10); // Limit to the 10 most recent activities
    
    res.json(activities);
}));

module.exports = router;