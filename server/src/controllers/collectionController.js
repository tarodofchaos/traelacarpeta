const { validationResult } = require('express-validator');
const { PrismaClient } = require('../generated/client');
const prisma = new PrismaClient();

// @desc    Search cards in encyclopedia
// @route   GET /api/collection/search?q=name
exports.searchCards = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'Query parameter q is required' });

  try {
    const cards = await prisma.card.findMany({
      where: {
        name: {
          contains: q,
          // mode: 'insensitive' // SQLite doesn't strictly support mode: insensitive without lowercasing, but Prisma usually handles it.
        },
      },
      take: 20,
    });
    res.json(cards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get user's collection
// @route   GET /api/collection
exports.getCollection = async (req, res) => {
  try {
    const items = await prisma.collectionItem.findMany({
      where: { user_id: req.user.id },
      include: {
        card: true, // Include card details
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Add card to collection
// @route   POST /api/collection
exports.addToCollection = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { card_id, quantity = 1, condition = 'NM', finish = 'normal', language = 'en' } = req.body;

  try {
    // Check if card exists in DB
    const card = await prisma.card.findUnique({ where: { id: card_id } });
    if (!card) {
      return res.status(404).json({ message: 'Card not found in encyclopedia' });
    }

    // Check if item already exists in collection (Same variant)
    let item = await prisma.collectionItem.findFirst({
      where: {
        user_id: req.user.id,
        card_id,
        condition,
        finish,
        language
      }
    });

    if (item) {
      // Update quantity
      item = await prisma.collectionItem.update({
        where: { id: item.id },
        data: { quantity: item.quantity + quantity }
      });
    } else {
      // Create new
      item = await prisma.collectionItem.create({
        data: {
          user_id: req.user.id,
          card_id,
          quantity,
          condition,
          finish,
          language
        }
      });
    }

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update collection item
// @route   PUT /api/collection/:id
exports.updateItem = async (req, res) => {
  const { quantity, condition, finish, language, is_for_trade } = req.body;

  try {
    let item = await prisma.collectionItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check user owns item
    if (item.user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item = await prisma.collectionItem.update({
      where: { id: req.params.id },
      data: {
        quantity: quantity !== undefined ? quantity : item.quantity,
        condition: condition || item.condition,
        finish: finish || item.finish,
        language: language || item.language,
        is_for_trade: is_for_trade !== undefined ? is_for_trade : item.is_for_trade
      }
    });

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Remove item from collection
// @route   DELETE /api/collection/:id
exports.removeItem = async (req, res) => {
  try {
    const item = await prisma.collectionItem.findUnique({
      where: { id: req.params.id }
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check user owns item
    if (item.user_id !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await prisma.collectionItem.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
