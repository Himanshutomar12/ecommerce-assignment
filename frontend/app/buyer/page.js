'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/Navbar";

const BuyerPage = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [cart, setCart] = useState([]);
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const [activeTab, setActiveTab] = useState('products'); // Manage active tab


    useEffect(() => {
        const ses_token = sessionStorage.getItem("token");
        setToken(ses_token);
        setUserName(sessionStorage.getItem("username"));
        setRole(sessionStorage.getItem("role"));
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items', {
                    params: { search, category },
                    headers: { Authorization: `Bearer ${ses_token}` },
                });
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products', err);
                if (err.response && err.response.status === 401) {
                    router.push("/");
                }
            }
        };

        fetchProducts();
        fetchCart(ses_token);
    }, [search, category]);

    const fetchCart = async (ses_token) => {
        try {
            const response = await axios.get('http://localhost:5000/api/items/cart', {
                headers: { Authorization: `Bearer ${ses_token}` },
            });
            setCart(response.data);
        } catch (err) {
            console.error('Error fetching products', err);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await axios.post('http://localhost:5000/api/items/cart', { productId, quantity: 1 }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCart(token);
            alert('Product added to cart');
        } catch (err) {
            console.error('Error adding product to cart', err);
        }
    };

    const handleRemoveFromCart = async (cartItemId, productid) => {
        try {
            await axios.delete('http://localhost:5000/api/items/cart/', {
                params: { cartId: cartItemId, productid: productid },
                headers: { Authorization: `Bearer ${token}` }
            });
            const itemIndex = cart.findIndex(item => item.id === cartItemId);

            if (cart[itemIndex].quantity > 1) {
                const updatedCart = [...cart];
                updatedCart[itemIndex].quantity -= 1;
                setCart(updatedCart);
            } else {
                // Remove item from cart locally
                setCart(cart.filter(item => item.id !== cartItemId));
            }
        } catch (err) {
            console.error('Error removing product from cart', err);
        }
    };

    return (
        <>
            <Navbar username={userName} role={role} />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

                {/* Tabs */}
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} focus:outline-none`}
                    >
                        Browse Products
                    </button>
                    <button
                        onClick={() => setActiveTab('cart')}
                        className={`py-2 px-4 ${activeTab === 'cart' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'} focus:outline-none`}
                    >
                        Cart Management {cart.length > 0 && '(' + cart.length + ')'}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'products' && (
                    <div>
                        <div className="flex space-x-4 mb-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name"
                                className="border rounded-lg p-2 w-1/2"
                            />
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Search by category"
                                className="border rounded-lg p-2 w-1/2"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4 shadow-lg">
                                    <h2 className="text-xl font-bold">{product.name}</h2>
                                    <p className="text-gray-600">{product.description}</p>
                                    <p className="text-gray-800 font-semibold">${product.price}</p>
                                    <button
                                        onClick={() => handleAddToCart(product.id)}
                                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'cart' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
                        {cart.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cart.map((item) => (
                                    <div key={item.id} className="border rounded-lg p-4 shadow-lg">
                                        <h2 className="text-xl font-bold">{item.name}</h2>
                                        <p className="text-gray-800 text-sm my-2">Price: {item.price} ({item.discount})% off</p>
                                        <p className="text-gray-800">Quantity: {item.quantity}</p>
                                        <button
                                            onClick={() => handleRemoveFromCart(item.id, item.product_id)}
                                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        >
                                            Remove from Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">Your cart is empty.</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default BuyerPage;
