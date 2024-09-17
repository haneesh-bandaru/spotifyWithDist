import pkg from 'jsonwebtoken';
import dotenv from 'dotenv'
import { StatusCodes } from 'http-status-codes';
dotenv.config();
const { verify } = pkg;

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Access denied || Token not found" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        req.role = decoded.role;
        req.username = decoded.userId;
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid Token" });
    }
}

export default verifyToken;