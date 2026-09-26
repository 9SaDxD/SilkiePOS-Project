// src/controllers/auth.controller.js (ฉบับอัปเดต)
const Employee = require('../models/Employee.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * 🔑 POST /api/auth/login
 * (ฟังก์ชันเดิม)
 */
exports.login = async (req, res) => {
    // ... (โค้ดเดิม) ...
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
 * 🧑‍💼 POST /api/admin/employees
 * (ฟังก์ชันเดิม - ที่เราเคยแก้)
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
 * 🧑‍💼 GET /api/admin/employees
 * (ฟังก์ชันเดิม - ที่เราเคยแก้)
 */
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}).select('-passwordHash');
        res.status(200).json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// --- 👇 (นี่คือฟังก์ชันใหม่ 2 ฟังก์ชัน) ---

/**
 * 🧑‍💼 PUT /api/admin/employees/:id
 * (ใหม่) อัปเดตข้อมูลพนักงาน
 */
exports.updateEmployee = async (req, res) => {
    const { id } = req.params; // นี่คือ _id ของ MongoDB
    const { employeeId, name, username, role, password } = req.body;

    try {
        const updateData = { employeeId, name, username, role };

        // (Optional) ถ้ามีการส่งรหัสผ่านใหม่มาด้วย ให้ Hash ใหม่
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
        // (ป้องกัน Error ID/Username ซ้ำ)
        if (err.code === 11000) {
            return res.status(400).json({ message: "Employee ID or Username already exists." });
        }
        res.status(500).json({ message: err.message });
    }
};

/**
 * 🧑‍💼 DELETE /api/admin/employees/:id
 * (ใหม่) ลบพนักงาน
 */
exports.deleteEmployee = async (req, res) => {
    const { id } = req.params; // นี่คือ _id ของ MongoDB
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