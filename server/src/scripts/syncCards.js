const { syncSet } = require('../services/scryfallService');
const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

async function main() {
  const setCode = process.argv[2] || 'fdn'; // Default to Foundations if no arg provided
  try {
    await syncSet(setCode);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
