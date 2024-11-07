// src/middleware/auth.js
import { getSession } from 'next-auth/react';

export const requireAdmin = async (req, res, next) => {
    const session = await getSession({ req });

    if (!session || session.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied' });
    }

    next();
};
