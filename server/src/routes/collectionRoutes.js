const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/authMiddleware');
const collectionController = require('../controllers/collectionController');

// Search is public or private? Usually private if it's "Add to binder" search, but encyclopedia search could be public.
// Let's keep it protected for now as it's under "Manage Collection".
router.get('/search', auth, collectionController.searchCards);

router.get('/', auth, collectionController.getCollection);

router.post(
  '/',
  [
    auth,
    check('card_id', 'Card ID is required').not().isEmpty(),
    check('quantity', 'Quantity must be a positive number').optional().isInt({ min: 1 })
  ],
  collectionController.addToCollection
);

router.put('/:id', auth, collectionController.updateItem);

router.delete('/:id', auth, collectionController.removeItem);

module.exports = router;
