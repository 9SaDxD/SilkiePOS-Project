// src/models/OrderItem.model.js (สร้างไฟล์ใหม่)

const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    // อ้างอิงกลับไปที่ Order หลัก (บิล)
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    // อ้างอิงกลับไปที่ Table (เพื่อความสะดวกของ KDS)
    tableId: {
        type: String,
        required: true
    },
    // รายละเอียดจาก Menu
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
    // สถานะของ "จานนี้" (นี่คือสิ่งที่เราจะ Mark Done)
    itemStatus: { 
        type: String,
        enum: ['Pending', 'Done'],
        default: 'Pending'
    },
    note: { 
        type: String,
        default: ''
    },
    price: Number, // ราคารวมของรายการนี้ (รวมท็อปปิ้ง)
    sentToKitchenAt: { 
        type: Date,
        default: Date.now 
    }
});

const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', OrderItemSchema);
module.exports = OrderItem;