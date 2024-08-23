'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../../components/Navbar";
import * as Common from "../../components/Common";
import { useRouter } from 'next/navigation';

export default function SellerDashboard() {
    //const token = sessionStorage.getItem("token");
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: '', category: '', description: '', price: '', discount: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [token, setToken] = useState("");
    const [userName, setUserName] = useState("");
    const [role, setRole] = useState("");
    const router = useRouter();

    useEffect(() => {
        const ses_token = sessionStorage.getItem("token");
        setToken(ses_token);
        setUserName(sessionStorage.getItem("username"));
        setRole(sessionStorage.getItem("role"));

        fetchProducts(ses_token);
    }, []);


    const fetchProducts = async (ses_token) => {
        try {
            const { data } = await axios.get('http://localhost:5000/api/products', {
                headers: { Authorization: `Bearer ${ses_token}` },
            });
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
            if (err.response.status === 401) {
                router.push("/");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        if (form.name === "" || form.category === "" || form.price === "") {
            alert("Please fill mendatory fields");
        }
        try {
            if (editingProduct) {
                await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, form, config);
                setEditingProduct(null);
                fetchProducts(token);
            } else {
                await axios.post('http://localhost:5000/api/products', form, config);
                fetchProducts(token);
            }
            setForm({ name: '', category: '', description: '', price: '', discount: '' });
            router.refresh(); // Refresh the data
        } catch (err) {
            console.error('Error saving product:', err);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditingProduct(product);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    return (
        <>
            <Navbar username={userName} role={role} />
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name*"
                        value={form.name}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category*"
                        value={form.category}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="number"
                        name="price"
                        placeholder="Price*"
                        value={form.price}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <input
                        type="number"
                        name="discount"
                        placeholder="Discount"
                        value={form.discount}
                        onChange={handleInputChange}
                        className="border p-2 mb-2 w-full"
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                </form>

                <ul className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    {products.map(product => (
                        <li key={product.id} className="border p-2 mb-2">
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p>{product.category}</p>
                            <p>{product.description}</p>
                            <p>Price: Rs.{product.price}</p>
                            <p>Discount: {product.discount}%</p>
                            <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white p-1 rounded mr-2">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white p-1 rounded">
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
