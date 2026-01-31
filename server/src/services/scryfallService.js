const axios = require('axios');
const { PrismaClient } = require('../generated/client');

const prisma = new PrismaClient();
const SCRYFALL_API_BASE = 'https://api.scryfall.com';

/**
 * Fetches cards from Scryfall for a specific set code.
 * Uses pagination to retrieve all cards in the set.
 * @param {string} setCode - The 3-character set code (e.g., 'fdn', 'neo').
 */
async function syncSet(setCode) {
  console.log(`Starting sync for set: ${setCode}`);
  let url = `${SCRYFALL_API_BASE}/cards/search?q=set:${setCode}`;
  let hasMore = true;
  let page = 1;
  let totalCards = 0;

  try {
    while (hasMore) {
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(url);
      const data = response.data;

      const cardsToUpsert = data.data.map(card => ({
        id: card.id,
        name: card.name,
        set_code: card.set,
        set_name: card.set_name,
        collector_number: card.collector_number,
        image_uri: card.image_uris?.normal || card.image_uris?.large || null, // Handle missing images
        small_image_uri: card.image_uris?.small || null,
        oracle_text: card.oracle_text || null,
        type_line: card.type_line,
        rarity: card.rarity,
        prices: card.prices,
      }));

      // Bulk upsert using transaction is ideal, but for SQLite/Prisma simple createMany or loop is fine.
      // Upsert is safer for re-runs.
      for (const card of cardsToUpsert) {
        await prisma.card.upsert({
          where: { id: card.id },
          update: card,
          create: card,
        });
      }

      totalCards += cardsToUpsert.length;
      hasMore = data.has_more;
      url = data.next_page;
      page++;
      
      // Respect Scryfall rate limits (50-100ms delay)
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log(`Sync complete. Processed ${totalCards} cards.`);
    return totalCards;
  } catch (error) {
    console.error('Error syncing cards:', error.message);
    throw error;
  }
}

module.exports = { syncSet };
