import jwt from 'jsonwebtoken'
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token" });
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id;

        const user = await User.findById(userId)


        if(!user){
            return res.json({ success: false, message: "Not authorised, user not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({message: "Not authorised, token failed" });
    }
}