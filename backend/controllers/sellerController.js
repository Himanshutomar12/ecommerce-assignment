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

// Seller: Add a product
const addNewProduct = async (req, res) => {
    const { name, category, description, price } = req.body;
    const discount = req.body.discount === "" ? 0 : req.body.discount;
    const email = req.auth.email;
    console.log(email);
    try {
        // Ensure the user is a seller
        const user = await query('SELECT role,id FROM users WHERE email = $1', [email]);
        if (user.rows[0].role !== 'seller') {
            return res.status(403).json({ msg: 'Unauthorized' });
        }
        // Insert the product into the database
        await query(
            'INSERT INTO products (name, category, description, price, discount, seller_id) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, category, description, price, discount, user.rows[0].id]
        );

        res.status(201).json({ msg: 'Product added' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Buyer: Search for products by name or category
const fetchProduct = async (req, res) => {
    const { name, category } = req.query;
    const email = req.auth.email;
    try {
        const userInfo = await getUserInfo(email);
        const userId = userInfo.id;
        const userEmail = userInfo.email;
        let products;
        if (name) {
            products = await query('SELECT * FROM products WHERE seller_id = $1 name LIKE $2', [userId, `%${name}%`]);
        } else if (category) {
            products = await query('SELECT * FROM products WHERE seller_id = $1 category LIKE $2', [userId, `%${category}%`]);
        } else {
            products = await query('SELECT * FROM products where seller_id = $1 ', [userId]);
        }

        res.json(products.rows);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Seller: Edit a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, description, price, discount } = req.body;
    const email = req.auth.email;

    try {
        // Ensure the user is the owner of the product
        const product = await query('select email from products left outer join users on users.id = seller_id WHERE products.id = $1', [id]);
        if (product.rows[0].email !== email) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Update the product
        await query(
            'UPDATE products SET name = $1, category = $2, description = $3, price = $4, discount = $5 WHERE id = $6',
            [name, category, description, price, discount, id]
        );

        res.json({ msg: 'Product updated' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// Seller: Delete a product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const email = req.auth.email;
    console.log(email);
    try {
        // Ensure the user is the owner of the product
        const product = await query('select email from products left outer join users on users.id = seller_id WHERE products.id = $1', [id]);
        if (product.rows[0].email !== email) {
            return res.status(403).json({ msg: 'Unauthorized' });
        }

        // Delete the product
        await query('DELETE FROM products WHERE id = $1', [id]);

        res.json({ msg: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { addNewProduct, fetchProduct, updateProduct, deleteProduct };
