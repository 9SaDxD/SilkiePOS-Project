// src/controllers/kitchen.controller.js (ฉบับสมบูรณ์ที่ได้รับการแก้ไข)
const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const mongoose = require('mongoose');

// GET /api/kitchen/orders/:kitchenType
exports.getPendingOrders = async (req, res) => {
    const { kitchenType } = req.params;
    try {
        // 1. ดึง Order ที่ยัง Active (Preparing หรือ Ready)
        const activeOrders = await Order.find({
            status: { $in: ['Preparing', 'Ready'] } 
        }).select('_id');

        if (activeOrders.length === 0) {
            return res.status(200).json({ items: [] });
        }

        const orderIds = activeOrders.map(o => o._id);
        
        // 2. ดึง OrderItem ที่ผูกกับ Order ที่ Active และ (สำคัญ) ยัง Pending อยู่
        const items = await OrderItem.find({
            orderId: { $in: orderIds },
            kitchenType: kitchenType,
            itemStatus: 'Pending' // <--- การแก้ไขที่สำคัญ: ดึงเฉพาะรายการที่ยังไม่เสร็จ
        })
        .sort({ sentToKitchenAt: 1 }) 
        // Populate orderId เพื่อดึง tableId และ status
        .populate('orderId', 'tableId status');

        // 3. (Optional: สำหรับ Debug)
        // ถ้าต้องการเห็นรายการที่เสร็จแล้ว (Done) ด้วยชั่วคราว ให้ลบ itemStatus: 'Pending' ออก
        // แต่ในการทำงานจริง ควรใช้ itemStatus: 'Pending'

        res.status(200).json({
            message: `Active items for ${kitchenType} kitchen.`,
            items: items
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};

// POST /api/kitchen/item/:itemId/toggle (Logic นี้ใช้ได้อยู่แล้ว)
exports.toggleItemStatus = async (req, res) => {
    const { itemId } = req.params;
    try {
        const item = await OrderItem.findById(itemId);
        if (!item) {
            return res.status(400).json({ message: 'Item not found.' });
        }
        
        const newStatus = (item.itemStatus === 'Pending') ? 'Done' : 'Pending';
        item.itemStatus = newStatus;
        await item.save();

        const orderId = item.orderId;
        // เช็คว่ารายการที่เหลือทั้งหมดในบิลนี้เสร็จหมดหรือยัง
        const pendingItemsCount = await OrderItem.countDocuments({ 
            orderId: orderId, 
            itemStatus: 'Pending' 
        });

        // อัปเดตสถานะบิลหลัก (Order Header)
        let newOrderStatus = (pendingItemsCount === 0) ? 'Ready' : 'Preparing';

        const finalOrder = await Order.findByIdAndUpdate(
            orderId,
            { status: newOrderStatus },
            { new: true }
        );

        res.status(200).json({ 
            message: `Item status toggled to ${newStatus}. Order status is ${newOrderStatus}.`, 
            orderItem: item,
            order: finalOrder
        });

    } catch (error) {
        res.status(500).json({ message: 'Error toggling item status.', error: error.message });
    }
};

// POST /api/kitchen/order/:orderId/served
exports.markOrderServed = async (req, res) => {
    const { orderId } = req.params;
    try {
        // 1. ⭐️ เช็คก่อนว่ามีรายการไหนในบิลนี้ที่ยังไม่เสร็จ (Pending) หลงเหลืออยู่ไหม (ไม่เกี่ยงประเภทครัว)
        const pendingCount = await OrderItem.countDocuments({
            orderId: orderId,
            itemStatus: 'Pending'
        });

        let updatedOrder;

        if (pendingCount > 0) {
            // 2.1 ถ้ายังมีรายการค้าง (เช่น ของทอดยังไม่เสร็จ)
            // ห้ามเปลี่ยนเป็น Served! ให้เปลี่ยนเป็น 'Ready' หรือคงเดิมไว้
            // (เพื่อให้ครัวอื่นยังดึงข้อมูลบิลนี้เจอ)

            checkOrderStatus = await Order.findById(orderId);
            if (!checkOrderStatus) {
                return res.status(400).json({ message: 'Order not found.' });
            }

            if (checkOrderStatus.status === 'Served') {
                return res.status(400).json({ message: 'Order already served.' });
            }

            if (checkOrderStatus.status === 'Paid') {
                return res.status(400).json({ message: 'Cannot mark a paid order as served.' });
            }

            updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: 'Ready' }, // ยังไม่ Served เพราะครัวอื่นยังทำอยู่
                { new: true }
            );
            
            return res.status(200).json({ 
                message: 'Order partilly served (items pending in other kitchens).', 
                order: updatedOrder,
                isFullyServed: false
            });

        } else {
            // 2.2 ถ้าไม่เหลือรายการค้างแล้ว (เสร็จทุกครัว) -> ปิดบิลเป็น Served ได้เลย
            updatedOrder = await Order.findByIdAndUpdate(
                orderId,
                { status: 'Served' }, 
                { new: true }
            );

            if (!updatedOrder) {
                return res.status(400).json({ message: 'Order not found.' });
            }

            return res.status(200).json({ 
                message: 'Order fully served.', 
                order: updatedOrder,
                isFullyServed: true
            });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error marking order as served.', error: error.message });
    }
};

// POST /api/kitchen/order/:orderId/undo
exports.undoServeOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(400).json({ message: 'Order not found.' });
        }
        if (order.status !== 'Served') {
            return res.status(400).json({ message: `Cannot undo. Order status is ${order.status}.`});
        }
        order.status = 'Ready';
        await order.save();
        res.status(200).json({ message: 'Order serve undone successfully.', order });
    } catch (error) {
        res.status(500).json({ message: 'Error undoing order serve.', error: error.message });
    }
};