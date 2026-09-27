const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee.model');

// Middleware 1: เธ•เธฃเธงเธเธชเธญเธ Token
exports.verifyToken = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // เธ”เธถเธ Token เธเธฒเธ 'Bearer <token>'
            token = authHeader.split(' ')[1];
            
            // เธ•เธฃเธงเธเธชเธญเธ Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // เธ”เธถเธเธเนเธญเธกเธนเธฅ Employee (เนเธกเนเน€เธญเธฒ passwordHash) เธกเธฒเนเธเธเธเธฑเธ req
            req.user = await Employee.findById(decoded.id).select('-passwordHash'); 
            
            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Middleware 2: เธ•เธฃเธงเธเธชเธญเธ Role (เธชเธดเธ—เธเธดเน)
exports.checkRole = (roles) => {
    return (req, res, next) => {
        // req.user เธกเธฒเธเธฒเธ verifyToken
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Requires one of: ${roles.join(', ')}` 
            });
        }
        next();
    };
};

