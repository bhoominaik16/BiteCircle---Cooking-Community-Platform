// Front-end/src/utils/config.js
// This file stores configuration variables that can be loaded from environment variables
// For production, these should be set in the environment or loaded from .env files

/**
 * Unsplash API key - Loaded from environment variables
 * In development with Vite, create a .env file in the Front-end directory
 * with VITE_UNSPLASH_ACCESS_KEY=your_api_key
 */
export const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 
  // Please replace this with your actual Unsplash API key
  // You can get one at https://unsplash.com/developers
  'YOUR_UNSPLASH_ACCESS_KEY';