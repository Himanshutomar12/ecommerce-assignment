const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../db/index');

const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(name, email);
    try {
        // Check if the user already exists
        const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // // Insert the new user into the database
        await query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
            [name, email, hashedPassword, role]
        );

        // // Generate a JWT token
        const token = jwt.sign({ email, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, role, email, name });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user
        const user = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ email, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, role: user.rows[0].role, email: user.rows[0].email, name: user.rows[0].name });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
