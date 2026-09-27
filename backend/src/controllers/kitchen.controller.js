// src/controllers/kitchen.controller.js (เธเธเธฑเธเธชเธกเธเธนเธฃเธ“เนเธ—เธตเนเนเธ”เนเธฃเธฑเธเธเธฒเธฃเนเธเนเนเธ)
const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const mongoose = require('mongoose');

// GET /api/kitchen/orders/:kitchenType
exports.getPendingOrders = async (req, res) => {
    const { kitchenType } = req.params;
    try {
        // 1. เธ”เธถเธ Order เธ—เธตเนเธขเธฑเธ Active (Preparing เธซเธฃเธทเธญ Ready)
        const activeOrders = await Order.find({
            status: { $in: ['Preparing', 'Ready'] } 
        }).select('_id');

        if (activeOrders.length === 0) {
            return res.status(200).json({ items: [] });
        }

        const orderIds = activeOrders.map(o => o._id);
        
        // 2. เธ”เธถเธ OrderItem เธ—เธตเนเธเธนเธเธเธฑเธ Order เธ—เธตเน Active เนเธฅเธฐ (เธชเธณเธเธฑเธ) เธขเธฑเธ Pending เธญเธขเธนเน
        const items = await OrderItem.find({
            orderId: { $in: orderIds },
            kitchenType: kitchenType,
            itemStatus: 'Pending' // <--- เธเธฒเธฃเนเธเนเนเธเธ—เธตเนเธชเธณเธเธฑเธ: เธ”เธถเธเน€เธเธเธฒเธฐเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเธขเธฑเธเนเธกเนเน€เธชเธฃเนเธ
        })
        .sort({ sentToKitchenAt: 1 }) 
        // Populate orderId เน€เธเธทเนเธญเธ”เธถเธ tableId เนเธฅเธฐ status
        .populate('orderId', 'tableId status');

        // 3. (Optional: เธชเธณเธซเธฃเธฑเธ Debug)
        // เธ–เนเธฒเธ•เนเธญเธเธเธฒเธฃเน€เธซเนเธเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเน€เธชเธฃเนเธเนเธฅเนเธง (Done) เธ”เนเธงเธขเธเธฑเนเธงเธเธฃเธฒเธง เนเธซเนเธฅเธ itemStatus: 'Pending' เธญเธญเธ
        // เนเธ•เนเนเธเธเธฒเธฃเธ—เธณเธเธฒเธเธเธฃเธดเธ เธเธงเธฃเนเธเน itemStatus: 'Pending'

        res.status(200).json({
            message: `Active items for ${kitchenType} kitchen.`,
            items: items
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching pending orders.', error: error.message });
    }
};

// POST /api/kitchen/item/:itemId/toggle (Logic เธเธตเนเนเธเนเนเธ”เนเธญเธขเธนเนเนเธฅเนเธง)
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
        // เน€เธเนเธเธงเนเธฒเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเน€เธซเธฅเธทเธญเธ—เธฑเนเธเธซเธกเธ”เนเธเธเธดเธฅเธเธตเนเน€เธชเธฃเนเธเธซเธกเธ”เธซเธฃเธทเธญเธขเธฑเธ
        const pendingItemsCount = await OrderItem.countDocuments({ 
            orderId: orderId, 
            itemStatus: 'Pending' 
        });

        // เธญเธฑเธเน€เธ”เธ•เธชเธ–เธฒเธเธฐเธเธดเธฅเธซเธฅเธฑเธ (Order Header)
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
        // 1. โญ๏ธ เน€เธเนเธเธเนเธญเธเธงเนเธฒเธกเธตเธฃเธฒเธขเธเธฒเธฃเนเธซเธเนเธเธเธดเธฅเธเธตเนเธ—เธตเนเธขเธฑเธเนเธกเนเน€เธชเธฃเนเธ (Pending) เธซเธฅเธเน€เธซเธฅเธทเธญเธญเธขเธนเนเนเธซเธก (เนเธกเนเน€เธเธตเนเธขเธเธเธฃเธฐเน€เธ เธ—เธเธฃเธฑเธง)
        const pendingCount = await OrderItem.countDocuments({
            orderId: orderId,
            itemStatus: 'Pending'
        });

        let updatedOrder;

        if (pendingCount > 0) {
            // 2.1 เธ–เนเธฒเธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃเธเนเธฒเธ (เน€เธเนเธ เธเธญเธเธ—เธญเธ”เธขเธฑเธเนเธกเนเน€เธชเธฃเนเธ)
            // เธซเนเธฒเธกเน€เธเธฅเธตเนเธขเธเน€เธเนเธ Served! เนเธซเนเน€เธเธฅเธตเนเธขเธเน€เธเนเธ 'Ready' เธซเธฃเธทเธญเธเธเน€เธ”เธดเธกเนเธงเน
            // (เน€เธเธทเนเธญเนเธซเนเธเธฃเธฑเธงเธญเธทเนเธเธขเธฑเธเธ”เธถเธเธเนเธญเธกเธนเธฅเธเธดเธฅเธเธตเนเน€เธเธญ)

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
                { status: 'Ready' }, // เธขเธฑเธเนเธกเน Served เน€เธเธฃเธฒเธฐเธเธฃเธฑเธงเธญเธทเนเธเธขเธฑเธเธ—เธณเธญเธขเธนเน
                { new: true }
            );
            
            return res.status(200).json({ 
                message: 'Order partilly served (items pending in other kitchens).', 
                order: updatedOrder,
                isFullyServed: false
            });

        } else {
            // 2.2 เธ–เนเธฒเนเธกเนเน€เธซเธฅเธทเธญเธฃเธฒเธขเธเธฒเธฃเธเนเธฒเธเนเธฅเนเธง (เน€เธชเธฃเนเธเธ—เธธเธเธเธฃเธฑเธง) -> เธเธดเธ”เธเธดเธฅเน€เธเนเธ Served เนเธ”เนเน€เธฅเธข
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

