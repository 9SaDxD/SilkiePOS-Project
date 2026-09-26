// src/models/Payment.model.js (ฉบับอัปเดต)
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    // --- 👇 (แก้ไข) ---
    // เปลี่ยนจาก orderId (เดี่ยว) เป็น orderIds (Array)
    orderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    // ------------------
    method: {
        type: String,
        enum: ['Cash', 'QR'],
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
});

const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
module.exports = Payment;