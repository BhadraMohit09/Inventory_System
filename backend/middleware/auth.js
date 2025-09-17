const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ message: "No token provided!" });

    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded token data to request object
        next(); // Proceed to the next middleware or route handler
    }
    catch(err){
        return res.status(401).json({ message: "Invalid or expired token!" });
    }
}

function permit(...allowedRoles) {
    return(req, res, next) =>{
        if (!req.user) return res.status(401).json({ message: "Unauthorized!" });

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You don't have enough privileges!" });
        }

        next();
    }
}

module.exports = { auth, permit };