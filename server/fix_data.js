const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Assuming you have this file
const Recipe = require('./models/Recipe'); // Adjust path if needed

dotenv.config();

// Connect to database using your existing configuration
connectDB();

const cleanupData = async () => {
    try {
        console.log('Starting data migration to fix the likes field...');

        // Find all recipes where the 'likes' field is NOT an array (i.e., it's the old Number type or corrupted string)
        const result = await Recipe.updateMany(
            { likes: { $not: { $type: 4 } } }, // $type 4 means Number. This targets anything that isn't an array or number.
            { $set: { likes: [] } } // Set the corrupted field to an empty array
        );

        console.log(`Successfully processed ${result.modifiedCount} recipes.`);
        console.log('Cleanup complete. You can now restart your main server.');

        // Disconnect after cleanup
        mongoose.connection.close();

    } catch (error) {
        console.error('Error during data cleanup:', error.message);
        mongoose.connection.close();
    }
};

// Check if mongoose is already connected before calling cleanupData
if (mongoose.connection.readyState === 1) {
    cleanupData();
} else {
    // Wait for the connection to open if it hasn't already
    mongoose.connection.on('open', cleanupData);
}
