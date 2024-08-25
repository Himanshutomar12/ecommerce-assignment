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
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const ses_token = sessionStorage.getItem("token");
        setToken(ses_token);
        setUserName(sessionStorage.getItem("username"));
        setRole(sessionStorage.getItem("role"));

        fetchProducts(ses_token);
    }, []);


    const fetchProducts = async (ses_token) => {
        setLoader(true);
        try {
            const { data } = await axios.get(Common.apiSeller, {
                headers: { Authorization: `Bearer ${ses_token}` },
            });
            setLoader(false);
            setProducts(data);
        } catch (err) {
            setLoader(false);
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
        setLoader(true);
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
                await axios.put(`${Common.apiSeller}/${editingProduct.id}`, form, config);
                setEditingProduct(null);
                fetchProducts(token);
                setLoader(false);
            } else {
                await axios.post(Common.apiSeller, form, config);
                fetchProducts(token);
                setLoader(false);
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
        setLoader(true);
        try {
            await axios.delete(`${Common.apiSeller}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLoader(false);
            setProducts(products.filter(product => product.id !== id));
        } catch (err) {
            setLoader(false);
            console.error('Error deleting product:', err);
        }
    };

    return (
        <>
            {loader && <div className="loader"></div>}
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
