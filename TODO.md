# EchoScript.AI MVP Launch TODO

This list tracks remaining work to ship the MVP.

## Blocking Tasks 🚨

- [ ] **Backend:** Implement the FastAPI backend with all required endpoints (`/api/healthz`, `/api/auth/*`, `/api/transcribe`, `/api/stripe/*`, `/api/newsletter`, `/api/contact`).
- [ ] **Backend:** Configure Pydantic v2 models and `pydantic-settings` for environment management.
- [ ] **Backend:** Set up database models and migrations for users and transcripts.
- [ ] **Backend:** Implement JWT-based session management with HttpOnly cookies.
- [ ] **Deploy:** Set up Railway project for the backend and configure all production environment variables.
- [ ] **Deploy:** Set up Netlify project for the frontend and configure all `VITE_` environment variables.
- [ ] **Stripe:** Add `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to the backend environment.

## Non-Blocking Tasks (Post-Launch / Polish) ✨

- [ ] **Backend:** Write comprehensive unit and integration tests for all API endpoints.
- [ ] **CI/CD:** Expand GitHub Actions to include backend tests and deploy previews.
- [ ] **Frontend:** Implement full i18n for all user-facing strings.
- [ ] **Frontend:** Improve accessibility (a11y) scores across all pages.
- [ ] **Docs:** Write a complete `README.md` for both frontend and backend repositories.
- [ ] **Security:** Implement stricter Content Security Policy (CSP) headers.
- [ ] **Security:** Implement rate limiting on sensitive endpoints (`/login`, `/signup`, `/contact`).