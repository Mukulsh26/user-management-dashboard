import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const AdminDashboard = () => {
    const { data: session } = useSession();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser , setSelectedUser ] = useState(null);
    const [newRole, setNewRole] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users', {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            } else {
                setError('Failed to fetch users');
            }
        } catch (error) {
            setError('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            // Store session in localStorage when session data is available
            localStorage.setItem('session', JSON.stringify(session));
            if (session.user.role === 'admin') {
                fetchUsers();
            }
        }
    }, [session]);

    const deleteUser  = async (userId) => {
        const session = JSON.parse(localStorage.getItem('session'));

        if (!session) {
            console.error('No session found. Please login.');
            return;
        }
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/users?userId=${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                },
            });
            if (res.ok) {
                setUsers(users.filter(user => user._id !== userId));
            } else {
                setError('Failed to delete user');
            }
        } catch (error) {
            setError('Error deleting user');
        }
    };

    const updateUserRole = async (userId, newRole) => {
        const session = JSON.parse(localStorage.getItem('session'));

        if (!session) {
            console.error('No session found. Please login.');
            return;
        }

        try {
            const res = await fetch(`/api/users?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log('User  role updated successfully:', data.updatedUser );
                // Refresh users after updating the role
                fetchUsers();
            } else {
                console.error('Error updating user role:', data.message);
            }
        } catch (error) {
            console.error('Error updating user role:', error);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-4xl font-semibold text-center mb-8">Admin Dashboard</h2>
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}

            {loading ? (
                <p className="text-center text-gray-500">Loading users...</p>
            ) : (
                <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-100">
                                <td className="px-6 py-4 text-sm text-gray-700">{user .email}</td>
                                <td className="px-6 py-4 text-sm text-gray-700 capitalize">{user.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-700">
                                    <button
                                        onClick={() => deleteUser (user._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow mr-2"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedUser (user._id);
                                            setNewRole(user.role);
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow"
                                    >
                                        Update Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Update Role Modal */}
            {selectedUser  && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-semibold mb-4 text-black">Update User Role</h3>
                        <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="p-2 border rounded mb-4 w-full text-black"
                        >
                            <option value="">Select Role</option>
                            <option value="user">User </option>
                            <option value="admin">Admin</option>
                        </select>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setSelectedUser (null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    updateUserRole(selectedUser , newRole); // Pass newRole here
                                    setSelectedUser (null);
                                    setNewRole(''); // Reset the role after updating
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                            >
                                Update Role
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;