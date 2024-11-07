import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (status === 'unauthenticated') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-xl mb-4">You need to be logged in to view this page.</p>
                <Link href="/login" className="px-4 py-2 bg-blue-500 text-white rounded">Login</Link>
            </div>
        );
    }

    const handleLogout = () => signOut();
    const handleHome = () => {
        router.push("/")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md text-center">
            <h1 className="text-3xl font-bold mb-4 text-black">Profile</h1>
                <p className="text-lg mb-2 text-black"><strong>Email:</strong> {session.user.email}</p>
                <p className="text-lg mb-2 text-black"><strong>Role:</strong> {session.user.role || 'User'}</p>
                <button
                    onClick={handleLogout}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
                <br />
                <button 
                onClick={handleHome}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Go to Home
                </button>
            {/* <Link href="/" className="mt-4 text-blue-500 underline">Go to Home</Link> */}
            </div>
        </div>
    );
}
