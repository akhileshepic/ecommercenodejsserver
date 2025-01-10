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
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token using the secret from the environment variable 
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token.' });
            }

            // Attach the user information to the request object
            req.user = user.id;
            //console.log(user.id)
            // Proceed to the next middleware or route handler
            next();
        });
    } catch (err) {
        return res.status(500).json({ message: 'Something went wrong.' });
    }
};

export default authenticateJWT;
