const express = require('express');
const cors = require('cors');
const serverless = require("serverless-http");
const authRoutes = require('../routes/auth');
const buyerRoutes = require('../routes/buyer');
const sellerRoutes = require('../routes/seller');
const { query } = require('../db/index');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", async (req, res) => {
    res.send("Running...");
});

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/seller'));
app.use('/api/items', require('../routes/buyer'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.use("/.netlify/functions/app", router);
// module.exports.handler = serverless(app);