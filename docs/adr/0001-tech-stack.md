# 1. Tech Stack Selection

Date: 2026-01-31

## Status
Accepted

## Context
We need to build a web application for trading Magic: The Gathering cards. The application requires a robust backend for handling card data and user collections, a dynamic frontend for the user interface, and scheduled tasks for data synchronization.

## Decision
We will use the following technology stack:

-   **Backend:** Node.js with Express.js.
-   **Frontend:** React.
-   **Database:** PostgreSQL.
-   **ORM:** Prisma.
-   **Data Sources:** Scryfall API and MTGJSON.

## Consequences
-   **Pros:** Unified JavaScript/TypeScript ecosystem, strong community support for React/Node, relational data integrity with Postgres, type safety with Prisma (if we use TS).
-   **Cons:** Requires hosting that supports persistent Node processes and Postgres.
