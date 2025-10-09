const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This creates the link to the User model
        required: true
    },
    recipe: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe', // Link to the Recipe model
        required: true
    },
    triedRecipe: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Comment', CommentSchema);