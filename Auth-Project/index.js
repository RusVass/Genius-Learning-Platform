
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import './config/db.js';
import { User } from './models/userModel.js';
import { checkAuth, requireRole, checkBasicAuth } from './middleware/checkAuth.js';
import { checkAdmin } from './middleware/checkAdmin.js';

const app = express();
const port = process.env.PORT || 3001;
const jwtSecret = process.env.JWT_SECRET;

// middleware for parsing JSON
app.use(bodyParser.json());

function signToken(user) {
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not set');
    }
    return jwt.sign({ sub: user._id.toString(), role: user.role }, jwtSecret, { expiresIn: '1h' });
}

app.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await User.create({ firstName, lastName, email, password, role: 'user' });
        const token = signToken(user);
        return res.status(201).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            token,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing credentials' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = signToken(user);
        return res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/profile', checkAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/admin', checkAuth, checkAdmin, (req, res) => {
    return res.status(200).json({ message: 'Admin access granted' });
});

app.post('/admin/users', checkAuth, checkAdmin, async (req, res) => {
    const { firstName, lastName, email, password, role = 'user' } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const user = await User.create({ firstName, lastName, email, password, role });
        return res.status(201).json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/basic-profile', checkBasicAuth, (req, res) => {
    const user = req.userDoc;
    return res.status(200).json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

