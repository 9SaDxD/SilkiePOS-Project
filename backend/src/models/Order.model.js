// src/models/Order.model.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    tableId: {
        type: String, 
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        // --- 👇 (แก้ไข) เพิ่ม 'Served' ---
        enum: ['Preparing', 'Ready', 'Served', 'Paid', 'Cancelled'],
        default: 'Preparing' 
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: false 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
module.exports = Order;