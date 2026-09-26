const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee.model');

// Middleware 1: ตรวจสอบ Token
exports.verifyToken = async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            // ดึง Token จาก 'Bearer <token>'
            token = authHeader.split(' ')[1];
            
            // ตรวจสอบ Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // ดึงข้อมูล Employee (ไม่เอา passwordHash) มาแนบกับ req
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

// Middleware 2: ตรวจสอบ Role (สิทธิ์)
exports.checkRole = (roles) => {
    return (req, res, next) => {
        // req.user มาจาก verifyToken
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Requires one of: ${roles.join(', ')}` 
            });
        }
        next();
    };
};