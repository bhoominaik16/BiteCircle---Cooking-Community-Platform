# BiteCircle - Frontend

This is the frontend for the BiteCircle application, a community-driven recipe sharing and meal planning platform.

## Features

- Recipe discovery with advanced filtering
- AI-powered recipe suggestions
- Dynamic image loading from Unsplash API
- User authentication and profiles
- Recipe uploads with image support
- Meal planning and organization

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   ```
   - See [UNSPLASH_GUIDE.md](./UNSPLASH_GUIDE.md) for detailed instructions

3. Start the development server:
```bash
npm run dev
```

## API Integration

- The frontend connects to a Node.js/Express backend API
- API proxy is configured in `vite.config.js` for seamless development
- See the server directory for backend code

## External APIs

- **Unsplash API**: Used for fetching high-quality recipe images
- **Gemini AI**: Used for AI-powered recipe suggestions

## Technologies Used

- React
- Redux Toolkit for state management
- Vite as the build tool
- Tailwind CSS for styling




