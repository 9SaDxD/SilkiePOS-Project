// src/models/Employee.model.js
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        // --- ๐‘ (เนเธเนเนเธ) ---
        enum: ['Admin', 'Staff', 'Kitchen'], // (เธเนเธฒเธขเธเธถเนเธ)
        // ------------------
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;

