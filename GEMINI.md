# MTG Card Trader

## Project Overview
An application to help Magic: The Gathering players exchange cards using a "virtual binder". The app facilitates managing collections, wants lists, and live trading sessions.

## Core Features
-   **Virtual Binder:** Users can add cards to their personal collection.
    -   **Granularity:** Must track Condition, Language, and Finish (Foil/Etched).
    -   **Import:** Supports CSV/Text import.
-   **Wants List:** Users can specify cards they are looking for.
-   **Trading Session:**
    -   Connect via QR code or short text code.
    -   **Matching:** Auto-match "Wants" vs "Haves".
    -   **Valuation:** Calculate total trade value in **EUR**. Show net difference (who pays whom).
    -   **Commit:** Users select cards to finalize trade, automatically updating their collection (Add/Remove).
-   **Public Profile:** Generate a unique URL for read-only binder browsing.
-   **Background Jobs:** Daily updates for card metadata and pricing via Scryfall/MTGJSON.

## Tech Stack
-   **Frontend:** React
-   **Backend:** Node.js + Express
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **External APIs:** Scryfall, MTGJSON

## Status

- [x] **Planning:** Analysis and requirement gathering.

    -   [x] Initial Requirements

    -   [x] Tech Stack Definition

    -   [x] Domain Modeling

- [ ] **Implementation:** In Progress.

    -   [x] US-01: Project Setup

    -   [x] US-02: Card Data Synchronization
    -   [x] US-03: User Registration & Authentication
    -   [x] US-04: Manage Collection (Backend API)