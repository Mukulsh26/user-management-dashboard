// src/pages/index.js
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function HomePage() {
    const { data: session } = useSession();

    return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-black">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-black">
                    Welcome to the User Management Dashboard
                </h1>

                {!session ? (
                    <div className="flex space-x-6 justify-center mt-6">
                        <Link
                            href="/login"
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                        >
                            Sign Up
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col items-center mt-6">
                        <p className="mb-6 text-lg text-gray-700">Hello, {session.user.email}</p>
                        <div className="flex flex-col items-center w-full space-y-4">
                            <Link
                                href="/profile"
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg w-full text-center hover:bg-blue-600 transition duration-300"
                            >
                                Go to Profile
                            </Link>
                            {session.user.role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="px-6 py-3 bg-red-500 text-white rounded-lg w-full text-center hover:bg-red-600 transition duration-300"
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
