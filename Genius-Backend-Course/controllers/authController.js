import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import Token from '../models/tokenModel.js';

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES || '7d';
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const signAccessToken = (user) =>
    jwt.sign(
        { id: user._id, role: user.role },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
    );

const signRefreshToken = (user) =>
    jwt.sign(
        { id: user._id, role: user.role },
        REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRES_IN }
    );

const saveRefreshToken = async (userId, refreshToken) => {
    const { exp } = jwt.decode(refreshToken);
    const expiresAt = new Date(exp * 1000);
    return Token.create({ userId, token: refreshToken, expiresAt });
};

const removeRefreshToken = async (refreshToken) => {
    await Token.deleteOne({ token: refreshToken });
};

export const register = async (req, res) => {
    try {
        const { username, email, password: pass } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        const user = await User.create({
            username,
            email,
            password: hash,
            role: 'user',
        });

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        await saveRefreshToken(user._id, refreshToken);

        const { password, ...userData } = user._doc;

        return res
            .status(201)
            .json({ accessToken, refreshToken, user: userData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password: pass } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(pass, user.password);

        if (!isValid) {
            return res.status(400).json({ message: 'Invalid password or email' });
        }

        const accessToken = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        await saveRefreshToken(user._id, refreshToken);

        const { password: _password, ...userData } = user._doc;
        void _password;

        return res.status(200).json({
            accessToken,
            refreshToken,
            user: userData,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to login' });
    }
};

export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: 'Missing refreshToken' });
        }

        const stored = await Token.findOne({ token: refreshToken });
        if (!stored) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        let payload;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (err) {
            await removeRefreshToken(refreshToken);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const user = await User.findById(payload.id);
        if (!user) {
            await removeRefreshToken(refreshToken);
            return res.status(401).json({ message: 'User not found' });
        }

        await removeRefreshToken(refreshToken);

        const newAccessToken = signAccessToken(user);
        const newRefreshToken = signRefreshToken(user);
        await saveRefreshToken(user._id, newRefreshToken);

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to refresh token' });
    }
};

export const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await removeRefreshToken(refreshToken);
        }
        return res.status(200).json({ message: 'Logged out' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Unable to logout' });
    }
};
