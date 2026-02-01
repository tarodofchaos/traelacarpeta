# Pull Request: US-02 Card Data Synchronization

## Description
Implemented the card data synchronization service using the Scryfall API.

## Changes
- **Database:** Added `Card` model to Prisma schema.
- **Service:** Created `scryfallService.js` to fetch and upsert cards.
- **Script:** Added `scripts/syncCards.js` for CLI execution.
- **Testing:** Added `scryfallService.test.js` and verified with a real run (Foundations & Aftermath sets).

## Verification
- [x] Schema migration applied (SQLite for dev).
- [x] Script `node server/src/scripts/syncCards.js mat` correctly populated 50 cards.
- [x] Unit tests pass.

## Notes
- Temporarily switched to SQLite due to Docker availability. Needs revert to Postgres for production.
