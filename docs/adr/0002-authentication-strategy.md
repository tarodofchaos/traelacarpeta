# 2. Authentication Strategy

Date: 2026-01-31

## Status
Accepted

## Context
We need a secure authentication system. The MVP requires simple Email/Password login, but the product roadmap explicitly includes Social Login (Discord, Google) as a future feature.

## Decision
We will implement a modular authentication service.

1.  **Primary Method (MVP):** Local Strategy (Email + Password + Salt/Hash via bcrypt/Argon2).
2.  **Architecture:** We will structure the User schema and Auth logic to support multiple providers (OAuth) from day one, using a library like `Passport.js` or a flexible structure in our own auth middleware.
3.  **Feature Flag:** Social login code paths will be written but disabled via environment variables or a configuration flag (`ENABLE_SOCIAL_LOGIN=false`).

## Schema Implications
The `User` table must handle:
-   `email` (Unique)
-   `password_hash` (Nullable - social users might not have one)
-   `auth_provider` (default: 'local')
-   `external_id` (for Discord/Google IDs)

## Consequences
-   **Pros:** Allows quick MVP delivery while preventing a full rewrite when adding Discord login later.
-   **Cons:** Slightly more complex initial schema setup than a purely local-only auth system.
