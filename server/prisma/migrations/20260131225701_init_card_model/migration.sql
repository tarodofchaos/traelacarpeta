-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "set_code" TEXT NOT NULL,
    "set_name" TEXT NOT NULL,
    "collector_number" TEXT NOT NULL,
    "image_uri" TEXT,
    "small_image_uri" TEXT,
    "oracle_text" TEXT,
    "type_line" TEXT,
    "rarity" TEXT NOT NULL,
    "prices" JSONB,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Card_name_idx" ON "Card"("name");

-- CreateIndex
CREATE INDEX "Card_set_code_idx" ON "Card"("set_code");
