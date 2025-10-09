// server/models/Collection.js
const mongoose = require('mongoose');

const collectionSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    recipes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
    }],
}, {
    timestamps: true,
});

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;