# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0-mvp] - YYYY-MM-DD

### Added
- Initial MVP release of EchoScript.AI.
- Core features: user authentication, audio/video transcription, and Stripe integration for subscriptions.
- Frontend built with React, Vite, and Tailwind CSS.
- Backend powered by FastAPI.
- Deployed via Netlify (frontend) and Railway (backend).

### Fixed
- Resolved numerous merge conflicts and stabilized the frontend codebase.
- Standardized all API communication through a unified client (`/lib/api.ts`).
- Implemented Netlify proxy redirects to resolve CORS issues.
- Added robust environment variable handling and examples.