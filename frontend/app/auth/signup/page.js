'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer');
    const router = useRouter();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password, role });
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('username', res.data.name);
            sessionStorage.setItem('email', res.data.email);
            sessionStorage.setItem('role', res.data.role);
            if (res.data.role === "seller") {
                router.push('/seller');
            } else {
                router.push('/buyer');
            }
        } catch (err) {
            alert(err.response.data.msg);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSignup} className="p-4 w-80 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 mb-2 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 mb-2 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <select
                    className="w-full p-2 mb-2 border rounded"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                </select>
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Sign Up
                </button>
            </form>
        </div>
    );
}
