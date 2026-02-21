🍽️ BiteCircle – Full Stack Recipe Sharing Platform

BiteCircle is a full-stack MERN application that enables users to discover, upload, and organize recipes with AI-powered suggestions and dynamic image integration.

The project is containerized using Docker and includes CI automation using GitHub Actions along with a Python-based deployment script.

✨ Features

1. 🔍 Recipe discovery with filtering and search
2. 🤖 AI-powered recipe suggestions (Gemini API)
3. 🖼 Dynamic image loading via Unsplash API
4. 🔐 User authentication and profile management
5. 📤 Recipe uploads with image support
6. 📅 Meal planning and organization
7. 🐳 Dockerized full-stack deployment
8. 🔁 CI pipeline using GitHub Actions

🛠 Tech Stack
Frontend : 

React

Redux Toolkit
Vite
Tailwind CSS
Nginx (for production build serving)

Backend : 
Node.js
Express.js
MongoDB
Mongoose

DevOps & Automation : 
Docker (multi-stage builds)
Docker Compose
GitHub Actions (CI pipeline)
Python (deployment automation using subprocess)

External APIs : 
Unsplash API (dynamic images)
Gemini API (AI-based recipe suggestions)

📂 Project Structure
BiteCircle/
│
├── Front-end/
├── server/
├── docker-compose.yml
├── automation.py
├── .github/workflows/ci.yml
└── README.md

⚙️ Environment Variables
Backend (server/.env)
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_key

Frontend (Front-end/.env)
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
VITE_API_URL=http://localhost:5000

🐳 Running with Docker (Recommended)
Build Containers : 
docker compose build
Start Application
docker compose up -d

Frontend: http://localhost:3000
Backend: http://localhost:5000

🔁 CI Pipeline

The GitHub Actions workflow:
Triggers on push to the main branch
Installs frontend and backend dependencies
Builds the frontend
Validates Docker build
This ensures the application builds successfully before deployment.

🐍 Python Deployment Script

The project includes a Python automation script (automation.py) that:
Pulls latest code
Builds Docker containers
Starts services
Stops execution if any command fails

Run it using:
python automation.py

📌 What This Project Demonstrates
Full-stack MERN development
Docker-based containerization
Multi-service orchestration using Docker Compose
CI automation using GitHub Actions
Deployment scripting using Python
