import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/userModel.js';

export function checkAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = auth.replace('Bearer ', '').trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET is missing' });
    }

    try {
        const payload = jwt.verify(token, secret);
        req.user = { id: payload.sub, role: payload.role };
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

export function requireRole(allowed) {
    return (req, res, next) => {
        if (!req.user || !allowed.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
}

export async function checkBasicAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const base64Credentials = auth.split(' ')[1];
    let email;
    let password;

    try {
        const decoded = Buffer.from(base64Credentials, 'base64').toString('utf8');
        [email, password] = decoded.split(':');
    } catch {
        return res.status(400).json({ message: 'Invalid authorization header' });
    }

    if (!email || !password) {
        return res.status(400).json({ message: 'Invalid authorization header' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        req.user = { id: user._id.toString(), role: user.role };
        req.userDoc = user;
        return next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export function ensureOwnerOrAdmin(getOwnerId) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isAdmin = req.user.role === 'admin';
        if (isAdmin) return next();

        const ownerId = getOwnerId(req);
        if (!ownerId) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        return next();
    };
}

