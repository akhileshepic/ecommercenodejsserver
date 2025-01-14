import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Middleware to check if JWT is valid
const authenticateJWT = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization') ? req.header('Authorization').replace('Bearer ', '') : req.authorization ? req.authorization.replace('Bearer ', '') : null;
    // console.log(token)


    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret from the environment variable
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        if (!decode) {
            return res.status(401).json({
                message: "unauthorized access",
                error: true,
                success: false
            })
        }

        req.user = decode.id;

        next();

    } catch (err) {
        return res.status(500).json({
            message: "You have not login",///error.message || error,
            error: true,
            success: false
        })
    }
};

export default authenticateJWT;
