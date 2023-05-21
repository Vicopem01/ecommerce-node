const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};

module.exports = isAuthenticated;