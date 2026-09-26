const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
    tableId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Open', 'Occupied', 'Closed'],
        default: 'Open'
    },
    // --- (แก้ไข) ---
    // เปลี่ยนจาก ObjectId เดียว เป็น Array ของ ObjectIds
    currentOrderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' 
    }]
    // -----------------
});

module.exports = mongoose.model('Table', TableSchema);