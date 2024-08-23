const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const { addNewProduct, fetchProduct, updateProduct, deleteProduct } = require('../controllers/sellerController');

const authenticate = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true
});

const router = express.Router();

router.post('/', authenticate, addNewProduct);
router.get('/', authenticate, fetchProduct);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;
