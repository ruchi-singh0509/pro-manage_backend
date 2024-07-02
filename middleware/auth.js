const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');

const isLoggedIn = async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        throw new Error('Unauthorized request', 401);
    }

    try {
        const decodedUser = jwt.verify(accessToken, process.env.JWT);
        const user = await userModel
            .findById(decodedUser?._id)
            .select('-password -refreshToken');

        if (!user) {
            res.status(404).json({ message: 'Invalid access token' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(404).json({ message: 'Invalid access token' });
    }
};

module.exports = { isLoggedIn };