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
    // --- (เนเธเนเนเธ) ---
    // เน€เธเธฅเธตเนเธขเธเธเธฒเธ ObjectId เน€เธ”เธตเธขเธง เน€เธเนเธ Array เธเธญเธ ObjectIds
    currentOrderIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order' 
    }]
    // -----------------
});

module.exports = mongoose.model('Table', TableSchema);

