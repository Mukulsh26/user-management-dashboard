import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AuthForm = ({ isLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(''); 
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(loginStart());

        if (isLogin) {
            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result.error) {
                    dispatch(loginFailure());
                    alert(result.error);
                } else {
                    dispatch(loginSuccess(result.user));
                    router.push('/');
                }
            } catch (error) {
                dispatch(loginFailure());
                alert('Login failed, please try again.');
            }
        } else {
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role }), 
                });

                if (response.ok) {
                    const user = await response.json();
                    dispatch(loginSuccess(user));
                    router.push('/login');
                } else {
                    const errorData = await response.json();
                    dispatch(loginFailure());
                    alert(errorData.message);
                }
            } catch (error) {
                dispatch(loginFailure());
                alert('Signup failed, please try again.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center text-black">
                    {isLogin ? 'Login' : 'Sign Up'}
                </h2>
                {!isLogin && (<input
                    type="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded text-black"
                    required
                />)}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded text-black"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded text-black" 
                    required
                />
                {!isLogin && (
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-2 border rounded text-black"
                        required
                    >    
                        <option value="">Please Select Role</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                )}
                <button type="submit" className={`px-4 py-2 ${isLogin ? 'bg-blue-500' : 'bg-green-500'} text-white rounded`}>
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>

                <p className="mt-4 text-center text-black">
                    {isLogin ? (
                        <>Don&apos;t have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link></>
                    ) : (
                        <>Already have an account? <Link href="/login" className="text-green-500 hover:underline">Login</Link></>
                    )}
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
