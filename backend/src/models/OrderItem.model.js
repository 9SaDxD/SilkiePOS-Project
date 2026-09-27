// src/models/OrderItem.model.js (เธชเธฃเนเธฒเธเนเธเธฅเนเนเธซเธกเน)

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    // เธญเนเธฒเธเธญเธดเธเธเธฅเธฑเธเนเธเธ—เธตเน Order เธซเธฅเธฑเธ (เธเธดเธฅ)
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    // เธญเนเธฒเธเธญเธดเธเธเธฅเธฑเธเนเธเธ—เธตเน Table (เน€เธเธทเนเธญเธเธงเธฒเธกเธชเธฐเธ”เธงเธเธเธญเธ KDS)
    tableId: {
        type: String,
        required: true
    },
    // เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธ Menu
    menuId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Menu', 
        required: true 
    }, 
    menuName: String, 
    quantity: {
        type: Number,
        required: true
    },
    kitchenType: { 
        type: String,
        enum: ['Ramen', 'Fry', 'Drink', 'Other'],
        required: true
    },
    // เธชเธ–เธฒเธเธฐเธเธญเธ "เธเธฒเธเธเธตเน" (เธเธตเนเธเธทเธญเธชเธดเนเธเธ—เธตเนเน€เธฃเธฒเธเธฐ Mark Done)
    itemStatus: { 
        type: String,
        enum: ['Pending', 'Done'],
        default: 'Pending'
    },
    note: { 
        type: String,
        default: ''
    },
    price: Number, // เธฃเธฒเธเธฒเธฃเธงเธกเธเธญเธเธฃเธฒเธขเธเธฒเธฃเธเธตเน (เธฃเธงเธกเธ—เนเธญเธเธเธดเนเธ)
    sentToKitchenAt: { 
        type: Date,
        default: Date.now 
    }
});

const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);
module.exports = OrderItem;

