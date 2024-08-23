import Link from 'next/link';
// import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Tomar's Store</h1>
        <div className="space-x-4">
          <Link href="/auth/login">
            <span className="px-4 py-2 bg-blue-500 text-white rounded">Login</span>
          </Link>
          <Link href="/auth/signup">
            <span className="px-4 py-2 bg-green-500 text-white rounded">Sign Up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
