# Domain Model & Data Schema Strategy

## 1. Card Definition vs. Collection Item
We must distinguish between the "Static" card data (metadata) and the "Instance" card data (what a user owns).

### Static Data (The Encyclopedia)
Source: Scryfall / MTGJSON.
Table: `Card`
-   `scryfall_id` (PK, UUID)
-   `name`
-   `set_code`
-   `set_name`
-   `collector_number`
-   `image_uri` (normal, small)
-   `oracle_text`
-   `type_line`
-   `rarity`
-   `prices` (JSONB - stores raw price data from source)

### User Data (The Binder)
Source: User Input.
Table: `CollectionItem`
-   `id` (PK, UUID)
-   `user_id` (FK)
-   `card_id` (FK -> Card.scryfall_id)
-   `quantity`
-   **Granularity Fields:**
    -   `condition` (Enum: NM, LP, MP, HP, D)
    -   `language` (String/Enum)
    -   `finish` (Enum: normal, foil, etched)
-   `is_for_trade` (Boolean, default true)

Table: `WantItem`
-   `id` (PK, UUID)
-   `user_id` (FK)
-   `card_name` (String - for fuzzy matching if specific ID not known)
-   `card_id` (FK -> Card.scryfall_id, Nullable if "Any Version")
-   `min_condition` (Nullable)

## 2. Trading Session Model

Table: `TradeSession`
-   `id` (PK, UUID)
-   `code` (String, Unique, e.g., "ABCD")
-   `user_a_id` (FK)
-   `user_b_id` (FK, Nullable initially)
-   `status` (OPEN, ACTIVE, COMPLETED, CANCELLED)
-   `created_at`

*Note: The actual "Transaction" logic might not need persistent storage of every negotiation step, but we need to log the final exchange.*

Table: `TradeTransaction` (The Receipt)
-   `id` (PK)
-   `session_id` (FK)
-   `timestamp`
-   `final_value_diff` (Decimal)

Table: `TradeExchangeItem`
-   `transaction_id` (FK)
-   `from_user_id` (FK)
-   `to_user_id` (FK)
-   `card_data` (Snapshot of the card details at time of trade)
