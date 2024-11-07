import dbConnect from '../../utils/dbConnect';
import User from '../../models/User';

async function updateUserRole(userId, role) {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        );

        if (!updatedUser) {
            throw new Error('User not found');
        }

        return updatedUser;
    } catch (error) {
        throw new Error(error.message || 'Error updating user role');
    }
}

export default async function handler(req, res) {
    await dbConnect();

    if (req.method === 'GET') {
        try {
            const users = await User.find({}, 'email role');
            return res.status(200).json(users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Error fetching users' });
        }
    }

    if (req.method === 'DELETE') {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        try {
            await User.findByIdAndDelete(userId);
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    if (req.method === 'PUT') {
        const { userId } = req.query;
        const { role } = req.body;

        if (!userId || !role || !['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid user ID or role' });
        }

        try {
            const updatedUser = await updateUserRole(userId, role);

            return res.status(200).json({ message: 'User role updated successfully', updatedUser });
        } catch (error) {
            console.error('Error updating user role:', error);
            return res.status(500).json({ message: error.message });
        }
    }
    
    res.status(405).json({ message: 'Method Not Allowed' });
}
