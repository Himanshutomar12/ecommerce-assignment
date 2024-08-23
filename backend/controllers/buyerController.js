const { query } = require('../db');


const getUserInfo = async (email) => {
    try {
        const user = await query('SELECT id, email FROM users WHERE email = $1', [email]);
        return user.rows[0];
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw error;
    }
}

// Get products by name or category
const getProducts = async (req, res) => {
    const { search, category } = req.query;
    // const qry = 'SELECT * FROM products WHERE 1=1 ';
    // if (search != "")
    //     qry += "and name like $1 ";
    // if (category != "")
    //     qry += "and category like $2 ";
    try {
        const products = await query(
            'SELECT * FROM products WHERE (name LIKE $1 or category LIKE $2)',
            [`%${search}%`, `%${category}%`]
        );
        res.json(products.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// fetch cart product
const fetchCart = async (req, res) => {
    const email = req.auth.email;
    try {
        const userInfo = await getUserInfo(email);
        const userId = userInfo.id;
        const userEmail = userInfo.email;
        if (userEmail !== email) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        const cart = await query('select cart.id, user_id, product_id, quantity, name, category, description, price, discount from cart left outer join products on products.id = product_id where user_id = $1'
            , [userId]
        );
        res.json(cart.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching cart' });
    }
};

// Add product to cart
const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const email = req.auth.email;
    try {
        const userInfo = await getUserInfo(email);
        const userId = userInfo.id;
        const userEmail = userInfo.email;
        const qty = await query('SELECT count(*) as count FROM cart WHERE user_id = $1 and product_id = $2', [userId, productId]);
        if (userEmail !== email) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        if (qty.rows[0].count > 0) {
            await query(
                'update cart set quantity=quantity+1 where user_id = $1 and product_id = $2',
                [userId, productId]
            );
        } else {
            await query(
                'INSERT INTO cart(user_id, product_id, quantity) VALUES($1, $2, $3)',
                [userId, productId, quantity]
            );
        }
        res.status(201).json({ message: 'Product added to cart' });
    } catch (err) {
        res.status(500).json({ error: 'Error adding product to cart' });
    }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
    const { cartId, productid } = req.query;
    console.log(cartId);
    const email = req.auth.email;
    try {
        const userInfo = await getUserInfo(email);
        const userId = userInfo.id;
        const userEmail = userInfo.email;
        const qty = await query('SELECT quantity FROM cart WHERE user_id = $1 and product_id = $2', [userId, productid]);
        console.log(qty.rows[0].quantity);
        if (userEmail !== email) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        if (qty.rows[0].quantity > 1) {
            await query('update cart set quantity = quantity-1 WHERE id = $1 and user_id = $2', [cartId, userId]);
        } else {
            await query('DELETE FROM cart WHERE id = $1  and user_id = $2', [cartId, userId]);
        }
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (err) {
        res.status(500).json({ error: 'Error removing product from cart' });
    }
};

module.exports = { getProducts, addToCart, removeFromCart, fetchCart };
