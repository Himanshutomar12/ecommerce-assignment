import React from 'react'
import Link from 'next/link';

function Navbar({ username, role }) {
    return (
        <div className='flex justify-between items-center bg-slate-700 text-white'>
            <div className='flex items-center'>
                <h1 className='text-3xl font-bold p-4'>{username}</h1>
                <span className='text-xl'>({role})</span>
            </div>
            <div>
                <Link href="/">
                    <span className='p-4 underline underline-offset-1'>Logout</span>
                </Link>
            </div>
        </div>
    )
}

export default Navbar
