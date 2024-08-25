'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import * as Common from "../../../components/Common";
import $ from "jquery";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            const res = await axios.post(Common.apiLogin, { email, password }, {
                headers: { 'Content-Type': 'application/json' }
            });
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('username', res.data.name);
            sessionStorage.setItem('email', res.data.email);
            sessionStorage.setItem('role', res.data.role);
            setLoader(false);
            if (res.data.role === "seller") {
                router.push('/seller');
            } else {
                router.push('/buyer');
            }
        } catch (err) {
            setLoader(false);
            console.error('Login failed:', err.response ? err.response.data : err.message);
            alert(err.response.data.msg);
        }
    };

    return (
        <>
        {loader && <div className="loader"></div>}
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleLogin} className="p-4 w-80 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
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
                <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
                    Login
                </button>
            </form>
        </div>
        </>
    );
}
