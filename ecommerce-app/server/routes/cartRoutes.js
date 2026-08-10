const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  removeFromCart,
} = require('../controllers/cartController');

const auth = require('../middleware/auth');

router.get('/', auth, getCart);

router.post('/', auth, addToCart);

router.delete('/:itemId', auth, removeFromCart);

module.exports = router;