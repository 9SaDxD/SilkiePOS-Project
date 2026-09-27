// src/controllers/order.controller.js (เธเธเธฑเธเธชเธกเธเธนเธฃเธ“เน)

const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Menu = require('../models/Menu.model');
const Table = require('../models/Table.model'); 
const mongoose = require('mongoose');

/**
 * ๐“ POST /api/staff/orders
 * (เนเธเนเนเธ) "เธชเธฃเนเธฒเธเธเธดเธฅเนเธซเธกเนเน€เธชเธกเธญ" เน€เธเธทเนเธญเนเธกเนเนเธซเนเนเธ—เธฃเธเธเธดเธง
 */
exports.createOrder = async (req, res) => {
    const { tableId, items } = req.body; 

    if (!tableId || !items || items.length === 0) {
        return res.status(400).json({ message: 'Table ID and order items are required.' });
    }

    try {
        // 1. เธเนเธเธซเธฒเนเธ•เนเธฐ
        const table = await Table.findOne({ tableId: tableId });
        if (!table) {
            return res.status(400).json({ message: 'Table not found.' });
        }

        // --- (Logic เนเธซเธกเน) ---
        // 2. โญ๏ธ เธชเธฃเนเธฒเธเธเธดเธฅ (Order Header) เนเธซเธกเน "เน€เธชเธกเธญ"
        const newOrder = new Order({ 
            tableId: tableId, 
            status: 'Preparing', 
            totalAmount: 0 // (เน€เธฃเธฒเธเธฐเธเธณเธเธงเธ“เธ”เนเธฒเธเธฅเนเธฒเธ)
        });

        // 3. เธเธฃเธฐเธกเธงเธฅเธเธฅเธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃ
        let newItemsTotal = 0;
        const itemsToCreate = []; 

        for (const item of items) {
            const menuDoc = await Menu.findOne({ menuId: item.menuId });
            if (!menuDoc || !menuDoc.isAvailable) continue; 

            let itemPrice = menuDoc.price * item.quantity;

            itemsToCreate.push({
                orderId: newOrder._id, // ๐‘ เธเธนเธเธเธฑเธเธเธดเธฅเนเธซเธกเน
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

        // 4. เธชเธฃเนเธฒเธ OrderItem (เธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃ)
        await OrderItem.insertMany(itemsToCreate);

        // 5. โญ๏ธ เธญเธฑเธเน€เธ”เธ• TotalAmount เธเธญเธ "เธเธดเธฅเนเธซเธกเน"
        newOrder.totalAmount = newItemsTotal;
        await newOrder.save();

        // 6. โญ๏ธ (เธชเธณเธเธฑเธ) "เธขเธฑเธ”" ID เธเธดเธฅเนเธซเธกเนเธเธตเนเน€เธเนเธฒเนเธเนเธ Array เธเธญเธเนเธ•เนเธฐ
        table.currentOrderIds.push(newOrder._id);
        table.status = 'Occupied';
        await table.save();
        // --- (เธเธ Logic เนเธซเธกเน) ---

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
 * ๐” GET /api/staff/orders
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก)
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
 * ๐” GET /api/staff/orders/:orderId
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก)
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
 * ๐—‘๏ธ DELETE /api/staff/orders/item/:itemId
 * (เธเธฑเธเธเนเธเธฑเธเธขเธเน€เธฅเธดเธเนเธญเน€เธ—เธก เธ—เธตเนเน€เธฃเธฒเน€เธเธดเนเธกเนเธงเน)
 */
exports.cancelOrderItem = async (req, res) => {
    const { itemId } = req.params; // เธเธตเนเธเธทเธญ _id เธเธญเธ OrderItem

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
         return res.status(400).json({ message: 'Invalid Item ID format.' });
    }

    try {
        // 1. เธเนเธเธซเธฒเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเธเธฐเธฅเธ
        const itemToDelete = await OrderItem.findById(itemId);
        if (!itemToDelete) {
            return res.status(400).json({ message: 'Order item not found.' });
        }
        if (itemToDelete.itemStatus === 'Done') {
            return res.status(400).json({ message: 'Cannot cancel item that is already completed.' });
        }
        
        const orderId = itemToDelete.orderId;
        const itemPrice = itemToDelete.price;

        // 2. (เธเนเธญเธเธเธฑเธ) เธ•เธฃเธงเธเธชเธญเธเธชเธ–เธฒเธเธฐเธเธดเธฅเธซเธฅเธฑเธ
        const parentOrder = await Order.findById(orderId);
        if (!parentOrder) {
            return res.status(400).json({ message: 'Parent order not found.' });
        }
        if (parentOrder.status === 'Paid' || parentOrder.status === 'Cancelled') {
            return res.status(400).json({ message: `Cannot cancel item. Order is already ${parentOrder.status}.` });
        }

        // 3. เธฅเธ OrderItem
        await OrderItem.findByIdAndDelete(itemId);

        // 4. เธญเธฑเธเน€เธ”เธ•เธเธดเธฅเธซเธฅเธฑเธ (Order) เนเธ”เธข "เธฅเธ" เธขเธญเธ”เน€เธเธดเธเธเธญเธเธฃเธฒเธขเธเธฒเธฃเธเธตเนเธญเธญเธ
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $inc: { totalAmount: -itemPrice } }, // $inc เธเธทเธญเธเธฒเธฃเธเธงเธ (เธเธงเธเธ”เนเธงเธขเธเนเธฒเธ•เธดเธ”เธฅเธ)
            { new: true }
        );

        // เธซเธฒเธเธเธดเธฅเน€เธซเธฅเธทเธญ 0 เธเธฒเธ— เนเธซเนเธฅเธเธเธดเธฅเธเธฑเนเธเน€เธฅเธข
        if (updatedOrder.totalAmount <= 0) {
            await Order.findByIdAndDelete(orderId);
            // เนเธฅเธฐเธฅเธ ID เธเธดเธฅเธเธตเนเธญเธญเธเธเธฒเธเนเธ•เนเธฐเธ”เนเธงเธข
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

