// src/controllers/auth.controller.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
const Employee = require('../models/Employee.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * ๐”‘ POST /api/auth/login
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก)
 */
exports.login = async (req, res) => {
    // ... (เนเธเนเธ”เน€เธ”เธดเธก) ...
    try {
        const { username, password } = req.body;
        const employee = await Employee.findOne({ username });
        if (!employee) {
            return res.status(401).json({ message: "Invalid credentials (user)" });
        }
        const isMatch = await bcrypt.compare(password, employee.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials (pass)" });
        }
        const token = jwt.sign(
            { id: employee._id, role: employee.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                username: employee.username,
                name: employee.name,
                role: employee.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ๐ง‘โ€๐’ผ POST /api/admin/employees
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก - เธ—เธตเนเน€เธฃเธฒเน€เธเธขเนเธเน)
 */
exports.registerEmployee = async (req, res) => {
    try {
        const { employeeId, name, username, password, role } = req.body;
        const idExists = await Employee.findOne({ employeeId });
        if (idExists) {
            return res.status(400).json({ message: "Employee ID already exists" });
        }
        const userExists = await Employee.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const employee = await Employee.create({
            employeeId, name, username, passwordHash, role
        });
        res.status(201).json({ 
            message: "Employee registered successfully", 
            employee: { _id: employee._id, username: employee.username, role: employee.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/**
 * ๐ง‘โ€๐’ผ GET /api/admin/employees
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก - เธ—เธตเนเน€เธฃเธฒเน€เธเธขเนเธเน)
 */
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).select('-passwordHash');
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- ๐‘ (เธเธตเนเธเธทเธญเธเธฑเธเธเนเธเธฑเธเนเธซเธกเน 2 เธเธฑเธเธเนเธเธฑเธ) ---

/**
 * ๐ง‘โ€๐’ผ PUT /api/admin/employees/:id
 * (เนเธซเธกเน) เธญเธฑเธเน€เธ”เธ•เธเนเธญเธกเธนเธฅเธเธเธฑเธเธเธฒเธ
 */
exports.updateEmployee = async (req, res) => {
    const { id } = req.params; // เธเธตเนเธเธทเธญ _id เธเธญเธ MongoDB
    const { employeeId, name, username, role, password } = req.body;

    try {
        const updateData = { employeeId, name, username, role };

        // (Optional) เธ–เนเธฒเธกเธตเธเธฒเธฃเธชเนเธเธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเนเธกเธฒเธ”เนเธงเธข เนเธซเน Hash เนเธซเธกเน
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.passwordHash = await bcrypt.hash(password, salt);
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-passwordHash');

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json(updatedEmployee);
    } catch (err) {
        // (เธเนเธญเธเธเธฑเธ Error ID/Username เธเนเธณ)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Employee ID or Username already exists." });
        }
        res.status(500).json({ message: err.message });
    }
};

/**
 * ๐ง‘โ€๐’ผ DELETE /api/admin/employees/:id
 * (เนเธซเธกเน) เธฅเธเธเธเธฑเธเธเธฒเธ
 */
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params; // เธเธตเนเธเธทเธญ _id เธเธญเธ MongoDB
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Employee deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

