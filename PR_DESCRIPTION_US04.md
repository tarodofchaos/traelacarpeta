# Pull Request: US-04 Manage Collection (API)

## Description
Implemented the backend API for managing user collections (Virtual Binder).

## Changes
- **Database:** Added `CollectionItem` model with fields for Granularity (condition, finish, language).
- **API:**
    - `POST /api/collection`: Add card (upserts if exists).
    - `GET /api/collection`: Retrieve user's binder.
    - `PUT /api/collection/:id`: Update item details.
    - `DELETE /api/collection/:id`: Remove item.
    - `GET /api/collection/search`: Search encyclopedia to find cards to add.
- **Tests:** Added comprehensive integration tests in `collection.test.js`.

## Verification
- [x] All tests passed.
- [x] Verified CRUD operations.
