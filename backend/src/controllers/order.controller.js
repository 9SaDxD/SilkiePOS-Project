// src/controllers/order.controller.js (ฉบับสมบูรณ์)

const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Menu = require('../models/Menu.model');
const Table = require('../models/Table.model'); 
const mongoose = require('mongoose');

/**
 * 📝 POST /api/staff/orders
 * (แก้ไข) "สร้างบิลใหม่เสมอ" เพื่อไม่ให้แทรกคิว
 */
exports.createOrder = async (req, res) => {
    const { tableId, items } = req.body; 

    if (!tableId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Table ID and order items are required.' });
    }

    try {
        // 1. ค้นหาโต๊ะ
        const table = await Table.findOne({ tableId: tableId });
        if (!table) {
            return res.status(400).json({ message: 'Table not found.' });
        }

        // --- (Logic ใหม่) ---
        // 2. ⭐️ สร้างบิล (Order Header) ใหม่ "เสมอ"
        const newOrder = new Order({ 
            tableId: tableId, 
            status: 'Preparing', 
            totalAmount: 0 // (เราจะคำนวณด้านล่าง)
        });

        // 3. ประมวลผลรายการอาหาร
        let newItemsTotal = 0;
        const itemsToCreate = []; 

        for (const item of items) {
            const menuDoc = await Menu.findOne({ menuId: item.menuId });
            if (!menuDoc || !menuDoc.isAvailable) continue; 

            let itemPrice = menuDoc.price * item.quantity;

            itemsToCreate.push({
                orderId: newOrder._id, // 👈 ผูกกับบิลใหม่
                tableId: tableId,
                menuId: menuDoc._id,
                menuName: menuDoc.name,
                quantity: item.quantity,
                kitchenType: menuDoc.kitchenType,
                itemStatus: 'Pending',
                note: item.note || '',
                price: itemPrice,
            });
            newItemsTotal += itemPrice;
        }
        
        if (itemsToCreate.length === 0) {
            return res.status(400).json({ message: 'No valid order items found.' });
        }

        // 4. สร้าง OrderItem (รายการอาหาร)
        await OrderItem.insertMany(itemsToCreate);

        // 5. ⭐️ อัปเดต TotalAmount ของ "บิลใหม่"
        newOrder.totalAmount = newItemsTotal;
        await newOrder.save();

        // 6. ⭐️ (สำคัญ) "ยัด" ID บิลใหม่นี้เข้าไปใน Array ของโต๊ะ
        table.currentOrderIds.push(newOrder._id);
        table.status = 'Occupied';
        await table.save();
        // --- (จบ Logic ใหม่) ---

        res.status(201).json({
            message: 'New order created successfully and added to table.',
            orderId: newOrder._id,
            totalAmount: newItemsTotal
        });

    } catch (error) {
        console.error('Error creating order:', error.message);
        res.status(500).json({ message: 'Failed to create order.', error: error.message });
    }
};

/**
 * 🔍 GET /api/staff/orders
 * (ฟังก์ชันเดิม)
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .select('-__v'); 

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
};

/**
 * 🔎 GET /api/staff/orders/:orderId
 * (ฟังก์ชันเดิม)
 */
exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId).select('-__v');
        if (!order) {
            return res.status(400).json({ message: 'Order not found.' });
        }
        const items = await OrderItem.find({ orderId: orderId }).select('-__v');
        res.status(200).json({
            order: order,
            items: items
        });
    } catch (error) {
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid Order ID format.' });
        }
        res.status(500).json({ message: 'Error fetching order.', error: error.message });
    }
};

/**
 * 🗑️ DELETE /api/staff/orders/item/:itemId
 * (ฟังก์ชันยกเลิกไอเทม ที่เราเพิ่มไว้)
 */
exports.cancelOrderItem = async (req, res) => {
    const { itemId } = req.params; // นี่คือ _id ของ OrderItem

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
         return res.status(400).json({ message: 'Invalid Item ID format.' });
    }

    try {
        // 1. ค้นหารายการที่จะลบ
        const itemToDelete = await OrderItem.findById(itemId);
        if (!itemToDelete) {
            return res.status(400).json({ message: 'Order item not found.' });
        }
        if (itemToDelete.itemStatus === 'Done') {
            return res.status(400).json({ message: 'Cannot cancel item that is already completed.' });
        }
        
        const orderId = itemToDelete.orderId;
        const itemPrice = itemToDelete.price;

        // 2. (ป้องกัน) ตรวจสอบสถานะบิลหลัก
        const parentOrder = await Order.findById(orderId);
        if (!parentOrder) {
            return res.status(400).json({ message: 'Parent order not found.' });
        }
        if (parentOrder.status === 'Paid' || parentOrder.status === 'Cancelled') {
            return res.status(400).json({ message: `Cannot cancel item. Order is already ${parentOrder.status}.` });
        }

        // 3. ลบ OrderItem
        await OrderItem.findByIdAndDelete(itemId);

        // 4. อัปเดตบิลหลัก (Order) โดย "ลบ" ยอดเงินของรายการนี้ออก
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $inc: { totalAmount: -itemPrice } }, // $inc คือการบวก (บวกด้วยค่าติดลบ)
            { new: true }
        );

        // หากบิลเหลือ 0 บาท ให้ลบบิลนั้นเลย
        if (updatedOrder.totalAmount <= 0) {
            await Order.findByIdAndDelete(orderId);
            // และลบ ID บิลนี้ออกจากโต๊ะด้วย
            const table = await Table.findOne({ tableId: updatedOrder.tableId });
            if (table) {
                table.status = 'Open';
                table.currentOrderIds = [];
                await table.save();
            }
        }

        res.status(200).json({
            message: 'Item cancelled successfully.',
            deletedItemId: itemId,
            updatedOrder: updatedOrder
        });

    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order item.', error: error.message });
    }
};