const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
        enum: ['Liked', 'Commented', 'Uploaded', 'Saved'],
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe',
    },
    liker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    commentText: {
        type: String,
    },
    // Add other fields as needed for different activities
}, {
    timestamps: true,
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;