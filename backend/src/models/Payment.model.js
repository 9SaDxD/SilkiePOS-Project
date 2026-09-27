// src/models/Payment.model.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    // --- ๐‘ (เนเธเนเนเธ) ---
    // เน€เธเธฅเธตเนเธขเธเธเธฒเธ orderId (เน€เธ”เธตเนเธขเธง) เน€เธเนเธ orderIds (Array)
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

