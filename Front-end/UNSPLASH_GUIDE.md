# Unsplash API Integration Guide

This guide explains how to set up and use the Unsplash API integration for recipe images in the BiteCircle application.

## Setup Instructions

1. **Get an Unsplash API Key**
   - Sign up for a developer account at [Unsplash Developer](https://unsplash.com/developers)
   - Create a new application
   - Copy your Access Key (Client ID)

2. **Configure Environment Variables**
   - Create a file named `.env` in the `Front-end` directory
   - Add your Unsplash API key:
     ```
     VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
     ```
   - Restart your development server for changes to take effect

3. **Alternative Configuration**
   - If you don't want to use environment variables, you can directly edit:
     - Open `Front-end/src/utils/config.js`
     - Replace `'YOUR_UNSPLASH_ACCESS_KEY'` with your actual key

## How It Works

The application uses the Unsplash API to fetch relevant images for recipes:

1. When a recipe card is displayed, an API call is made to Unsplash to search for images matching the recipe name
2. The API returns high-quality images related to the recipe
3. The application displays the image with proper attribution to the photographer (as required by Unsplash API terms)
4. If the API call fails or no matching images are found, a fallback image is displayed

## Unsplash API Usage Guidelines

Remember to follow Unsplash's API guidelines:
- Always provide attribution for images
- Do not exceed rate limits (50 requests per hour for demo applications)
- For production applications, consider increasing your rate limits through Unsplash

## Troubleshooting

If images are not loading:
1. Check your browser console for error messages
2. Verify your API key is correctly set in the environment variables
3. Check your network tab to ensure API requests are being made successfully
4. Make sure you're not exceeding Unsplash's rate limits