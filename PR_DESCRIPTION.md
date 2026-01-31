# Pull Request: US-01 Project Setup

## Description
Implemented the initial project infrastructure as per US-01.

## Changes
- **Backend:** Initialized Node/Express app in `server/`.
- **Frontend:** Initialized React/Vite app in `client/`.
- **Database:** Added `docker-compose.yml` for PostgreSQL.
- **ORM:** Initialized Prisma in `server/` and configured connection.
- **Tests:** Added basic backend route test using `jest` and `supertest`.
- **Docs:** Created initial documentation and user stories.

## Verification
- [x] Backend runs (`node server/src/index.js`).
- [x] Frontend builds (`cd client && npm run build`).
- [x] Tests pass (`cd server && npm test`).
- [x] Docker compose file is valid.

## Next Steps
Merge this into `main` and proceed to US-02 (Card Data Sync).
