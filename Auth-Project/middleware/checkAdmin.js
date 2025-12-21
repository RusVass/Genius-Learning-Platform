export function checkAdmin(req, res, next) {
    try {
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        return next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

