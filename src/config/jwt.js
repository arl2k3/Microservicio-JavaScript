const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30m';

const generateToken = (user) => {
    const payload = {
        id: user.id,
        user: user.user,
        email: user.email,
        isAdmin: user.isAdmin,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        throw new Error('Token inválido');
    }
}

const authToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error('No autorizado');
            error.status = 401;
            return next(error);
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        error.status = 401;
        error.message = 'No autorizado';
        error.response = error.message;
        next(error);
    }
}

module.exports = { generateToken, verifyToken, authToken };