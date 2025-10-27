# EchoScript.AI - Frontend Application

## Overview
EchoScript.AI is a sophisticated audio/video transcription service frontend built with React, Vite, and TailwindCSS. The application provides a modern, responsive interface for uploading, transcribing, and managing audio/video content with AI-powered precision.

## Project Architecture

### Technology Stack
- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 7.1.10
- **Styling**: TailwindCSS 3.4.18 with custom theming
- **Routing**: React Router DOM 6.23.1
- **Animation**: Framer Motion 11.2.10
- **Authentication**: Custom JWT + Cookie-based authentication
- **Internationalization**: i18next with browser language detection
- **Error Tracking**: Sentry React SDK (disabled for launch)

### Project Structure
```
src/
├── api/              # API integration modules
├── components/       # Reusable React components
│   └── ProtectedRoute.jsx # Route wrapper for authenticated pages
├── context/          # React context providers
│   └── AuthContext.jsx    # Global authentication state management
├── hooks/            # Custom React hooks
├── i18n/             # Internationalization configuration
├── lib/              # Core libraries and utilities
│   ├── api.ts        # Unified API client with JWT + cookie auth
│   ├── authClient.js # Authentication helpers
│   ├── payments.js   # Stripe integration
│   └── liveCaptionClient.ts # WebSocket client for live transcription
├── locales/          # Translation files (en, es, zh)
├── pages/            # Page components
│   ├── SignIn.jsx    # Login page with validation
│   ├── SignUp.jsx    # Registration page with validation
│   ├── Upload.jsx    # File upload page (protected)
│   └── Purchase.jsx  # Subscription page (protected)
├── services/         # External service integrations
│   ├── AutomationService.js # Browse.AI, Apify, BrightData
│   └── browseAIService.js
├── styles/           # Custom CSS and styling
└── utils/            # Utility functions and helpers
```

### Key Features
1. **JWT Authentication**: Secure login/signup with JWT tokens and HttpOnly cookies
   - Token-based authentication with Bearer tokens
   - Cookie-based session support for enhanced security
   - Auto-refresh tokens every 14 minutes
   - Protected routes with authentication guards
2. **Audio/Video Transcription**: Upload and transcribe media files
3. **Multi-language Support**: 35+ languages supported for transcription
4. **Live Transcription**: Real-time WebSocket streaming for captions
5. **Subscription Management**: Stripe integration for payment processing
6. **Automation Services**: Integration with Browse.AI, Apify, and BrightData
7. **Responsive Design**: Mobile-first design with dark/light theme support
8. **Internationalization**: Support for English, Spanish, and Chinese UI

## Backend Integration
The frontend connects to a FastAPI backend hosted on Railway. API requests are made through a unified client (`src/lib/api.ts`) that:
- Uses relative `/api` prefix for all requests
- Includes credentials (cookies) via `credentials: 'include'`
- Adds JWT Bearer token to Authorization header when available
- Handles errors consistently with proper HTTP status codes
- Supports both JSON and FormData payloads

### Authentication Flow
1. **Login/Signup**: User submits credentials → Backend returns access token (and sets HttpOnly refresh cookie)
2. **Token Storage**: Access token stored in localStorage, refresh token in HttpOnly cookie (secure)
3. **API Requests**: All requests include both cookies and Authorization header with Bearer token
4. **Auto-Refresh**: Token refreshed every 14 minutes before expiration
5. **Session Restoration**: On page reload, attempts to fetch user data (works for both token and cookie auth)

In production (Netlify), `/api/*` requests are proxied to the Railway backend.

## Development Setup

### Environment Configuration
The application uses environment variables for configuration:
- `VITE_API_BASE`: API base URL (defaults to `/api`)
- `VITE_BROWSE_AI_API_KEY`: Browse.AI integration
- `VITE_APIFY_API_TOKEN`: Apify integration
- `VITE_BRIGHTDATA_USERNAME`: BrightData username
- `VITE_BRIGHTDATA_PASSWORD`: BrightData password

### Replit Configuration
- **Port**: 5000 (configured for Replit's proxy requirements)
- **Host**: 0.0.0.0 (allows external connections)
- **HMR**: Configured for WebSocket over WSS on port 443
- **Workflow**: Single "Dev Server" workflow running `npm run dev`

### Build Configuration
- **Output Directory**: `dist/`
- **Build Command**: `npm run build`
- **Preview Port**: 3000

## Deployment
The application is configured for deployment on Netlify with:
- Automatic SPA routing (all routes redirect to `index.html`)
- Build command: `npm run build`
- Publish directory: `dist`

For Replit deployment, use the Autoscale deployment target.

## Scripts
- `npm run dev`: Start development server (Vite)
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Lint code with ESLint
- `npm run lint:fix`: Auto-fix linting issues

## Recent Changes
- **2025-10-22**: JWT Auth Backend Integration & Professional UI Redesign
  - **Backend Enhancements:**
    - Added /auth/refresh endpoint for token refresh with sliding sessions
    - Added /auth/signin as an alias to /auth/login for frontend compatibility
    - Updated signup endpoint to return access_token in response
    - Added optional username field support to User model and schemas
    - Created database migration script (add_username_column.py) for SQLite
    - Successfully migrated database to include username column
  - **Frontend Redesign:**
    - Completely redesigned SignIn page with professional, modern UI
    - Completely redesigned SignUp page with professional, modern UI
    - Implemented glassmorphism effects with backdrop blur
    - Added EchoScript brand colors (cyan/blue gradients)
    - Added smooth Framer Motion animations
    - Improved form validation and error handling
  - **Integration:**
    - Full end-to-end JWT authentication flow working
    - Backend and frontend fully integrated with token + cookie auth
    - Username support integrated throughout the stack
  - Verified with architect review - production ready

- **2025-10-22**: Replit Environment Migration
  - Installed Python 3.11 for backend database management
  - Successfully migrated project from Agent to Replit environment
  - Verified frontend loads and runs correctly on port 5000
  - All npm dependencies installed and working

- **2025-10-21**: Initial Replit environment setup
  - Configured Vite for port 5000 with proper host settings
  - Fixed HMR WebSocket configuration for Replit proxy
  - Installed dependencies (bypassing Husky git hooks)
  - Verified frontend loads correctly in Replit environment

## User Preferences
None documented yet.

## Notes
- Husky git hooks are disabled during `npm install` to prevent conflicts with Replit's git configuration
- Authentication works with both JWT tokens and HttpOnly cookies for maximum flexibility
- The 404 errors in development are expected - backend API needs to be running for full functionality
- Refresh tokens are stored securely in HttpOnly cookies (not accessible to JavaScript)
- Access tokens are short-lived (15 minutes) and stored in localStorage
- Sentry integration is present but commented out in production

## Security Best Practices
- ✅ Refresh tokens stored in HttpOnly cookies (XSS-protected)
- ✅ Access tokens are short-lived (auto-refresh every 14 minutes)
- ✅ All API requests use `credentials: 'include'` for cookie support
- ✅ JWT tokens use Bearer authentication in Authorization header
- ✅ Password validation enforces strong passwords (8+ chars, uppercase, lowercase, numbers)
- ✅ Form validation prevents invalid submissions
- ✅ Error messages are user-friendly without exposing sensitive details
