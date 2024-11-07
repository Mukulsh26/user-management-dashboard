import { useSession } from 'next-auth/react';

const UserProfile = () => {
    const { data: session } = useSession();

    if (!session) return <p>Loading...</p>;

    return (
        <div className="user-profile">
            <h2>Welcome, {session.user.email}</h2>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Role:</strong> {session.user.role || 'User'}</p>
            {/* Additional profile info if available */}
        </div>
    );
};

export default UserProfile;
