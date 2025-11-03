# KinQuest - Family Events Discovery App

App that gives you personalized list of upcoming events near by you so you don't miss them.

> **📋 Quick Links**: [Implementation Summary](IMPLEMENTATION.md) | [Security Documentation](SECURITY.md) | [Requirements & Architecture](Requirements%20and%20Architecture.md)

## Overview

KinQuest is a full-stack web application that helps families discover personalized, family-friendly local events based on their ZIP code. Using AI-powered filtering, the app provides tailored event recommendations that match your family's demographics and interests.

## Features

- **Google OAuth Authentication**: Secure login with your Google account
- **Family Profiles**: Create detailed profiles including ZIP code, family members, ages, and gender
- **Smart Event Discovery**: AI-powered event filtering using GPT-4o-mini
- **Personalized Recommendations**: Get up to 10 curated events suitable for your family
- **Event Caching**: Efficient 24-hour caching per ZIP code for fast results
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18+ (with Hooks)
- React Router for navigation
- Vite for fast development and building
- Axios for API calls
- Plain CSS for styling

### Backend
- Node.js 20+ with Express
- MongoDB with Mongoose ODM
- Passport.js for Google OAuth
- OpenAI SDK for GPT-4o-mini integration
- Cheerio for web scraping
- Express Session for authentication

### Deployment
- Vercel for hosting (both frontend and backend)
- MongoDB Atlas for database

## Project Structure

```
kin-quest/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   └── passport.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── EventCache.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── profile.js
│   │   │   └── suggestions.js
│   │   ├── services/
│   │   │   ├── ScraperService.js
│   │   │   ├── CacheService.js
│   │   │   └── LLMService.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── EventCard.jsx
│   │   │   ├── EventModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Suggestions.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── vercel.json
├── .gitignore
├── README.md
└── Requirements and Architecture.md
```

## Setup Instructions

### Prerequisites
- Node.js 20+ installed
- MongoDB Atlas account (or local MongoDB)
- Google Cloud Console account (for OAuth)
- OpenAI API key

### 1. Clone the Repository
```bash
git clone https://github.com/RaviDasari/kin-quest.git
cd kin-quest
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kinquest
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o-mini
SESSION_SECRET=your-session-secret-key
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy Client ID and Client Secret to backend `.env` file

### 5. MongoDB Setup

1. Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address
5. Get your connection string and add it to backend `.env` file

### 6. OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to backend `.env` file

## Running the Application

### Development Mode

Start the backend server:
```bash
cd backend
npm run dev
```

In another terminal, start the frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. **Sign In**: Click "Get Started with Google" and authenticate with your Google account
2. **Create Profile**: Enter your ZIP code and add family members with their names, dates of birth, and optional gender
3. **View Suggestions**: Navigate to the Events page to see personalized event recommendations
4. **Refresh Events**: Click the refresh button to get updated events or re-scrape your ZIP code
5. **View Details**: Click on any event card to see full details and external links

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/logout` - Logout user
- `GET /auth/status` - Check authentication status

### Profile
- `GET /profile` - Get user profile
- `POST /profile` - Create/update profile
- `PUT /profile` - Update specific profile fields

### Suggestions
- `POST /suggestions` - Get personalized event suggestions
- `POST /suggestions/refresh` - Force refresh cache for user's ZIP code

## Deployment to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Configure environment variables in Vercel dashboard:
   - Add all variables from backend `.env.example`
   - Add all variables from frontend `.env.example`
   - Update `GOOGLE_CALLBACK_URL` and `FRONTEND_URL` to use production URLs

## Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection string
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - OAuth callback URL
- `OPENAI_API_KEY` - OpenAI API key
- `OPENAI_MODEL` - OpenAI model to use (default: gpt-4o-mini)
- `SESSION_SECRET` - Secret for session encryption
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Port for backend server (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Frontend
- `VITE_API_URL` - Backend API URL

## Security Considerations

- All authentication is handled through Google OAuth
- Sensitive data (DOB, gender) is encrypted in MongoDB
- Session cookies are HTTP-only and secure in production
- CORS is configured to only allow requests from the frontend
- Rate limiting should be added for production (not implemented in MVP)
- OpenAI API prompts are anonymized

## Future Enhancements

- Real web scraping from actual event sources
- Push notifications for new events
- Calendar integration
- Event filtering by interests/categories
- User favorites and event reminders
- Social features (share events with family)
- Mobile app version
- Support for multiple countries

## Contributing

This is a personal project, but suggestions and feedback are welcome. Please open an issue to discuss potential changes.

## License

ISC

## Contact

For questions or support, please open an issue on GitHub.

