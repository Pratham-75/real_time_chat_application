import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // Get token from the request header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user data to request object
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid token" });
    }
};

export default authMiddleware;
