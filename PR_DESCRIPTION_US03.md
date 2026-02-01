# Pull Request: US-03 User Registration & Authentication

## Description
Implemented user registration and login using Email/Password, JWT, and bcrypt.

## Changes
- **Database:** Added `User` model.
- **Dependencies:** Added `bcryptjs`, `jsonwebtoken`, `express-validator`.
- **API:**
    - `POST /api/auth/register`: Creates user, returns token.
    - `POST /api/auth/login`: Validates credentials, returns token.
    - `GET /api/auth/me`: Protected route, returns user info.
- **Middleware:** `authMiddleware` verifies JWT.
- **Refactor:** Extracted `app` from `index.js` for better testing.
- **Tests:** Added comprehensive integration tests in `server/src/tests/auth.test.js`.

## Verification
- [x] All tests passed (`npm test`).
- [x] Verified user creation and password hashing in DB.
