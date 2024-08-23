const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const { getProducts, addToCart, removeFromCart, fetchCart } = require('../controllers/buyerController');

const authenticate = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true
});

const router = express.Router();

router.get('/', authenticate, getProducts);
router.get('/cart', authenticate, fetchCart);
router.post('/cart', authenticate, addToCart);
router.delete('/cart', authenticate, removeFromCart);

module.exports = router;
