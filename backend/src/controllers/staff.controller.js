// src/controllers/staff.controller.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
const Table = require('../models/Table.model');
const Order = require('../models/Order.model');
const OrderItem = require('../models/OrderItem.model');
const Payment = require('../models/Payment.model');
const mongoose = require('mongoose');

// --- 1. เธเธฑเธ”เธเธฒเธฃเนเธ•เนเธฐ ---
exports.createTable = async (req, res) => {
    try {
        const newTable = new Table(req.body); 
        await newTable.save();
        res.status(201).json({ message: 'Table created successfully.', table: newTable });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Failed to create table.', error: 'Table ID already exists.' });
        }
        res.status(500).json({ message: 'Error creating table.', error: error.message });
    }
};
exports.getAllTables = async (req, res) => {
    try {
        const tables = await Table.find({});
        res.status(200).json(tables);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tables', error: error.message });
    }
};
exports.adminDeleteTable = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Table ID format.' });
    }
    try {
        const deletedTable = await Table.findByIdAndDelete(id);
        if (!deletedTable) {
            return res.status(400).json({ message: 'Table not found.' });
        }
        res.status(200).json({ message: `Table ${deletedTable.tableId} deleted successfully.` });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting table.', error: err.message });
    }
};
exports.openTable = async (req, res) => { res.status(400).json({ message: 'Table is opened automatically on first order.' }); };
exports.closeTable = async (req, res) => { res.status(400).json({ message: 'Table must be closed via payment.' }); };

// --- 2. เธเธฑเธ”เธเธฒเธฃเธเธดเธฅเนเธฅเธฐเธเธฒเธฃเน€เธเธดเธ ---
exports.getTableBill = async (req, res) => {
    const { tableId } = req.params;
    try {
        const table = await Table.findOne({ tableId });
        if (!table || !table.currentOrderIds || table.currentOrderIds.length === 0) {
            return res.status(400).json({ message: 'No active orders found for this table.' });
        }
        const orderIds = table.currentOrderIds;
        const orders = await Order.find({ _id: { $in: orderIds } });
        if (!orders || orders.length === 0) {
            return res.status(400).json({ message: 'Order data not found.' });
        }
        const items = await OrderItem.find({ orderId: { $in: orderIds } });
        const grandTotal = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const combinedOrder = {
            _id: orderIds.join(','), tableId: tableId,
            totalAmount: grandTotal, status: 'Preparing'
        };
        res.status(200).json({
            message: 'Current bill retrieved (Combined).',
            tableId: tableId, order: combinedOrder, items: items,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching table bill.', error: error.message });
    }
};
exports.processPayment = async (req, res) => {
    const { tableId, method, amountPaid } = req.body;
    try {
        const table = await Table.findOne({ tableId: tableId });
        if (!table || !table.currentOrderIds || table.currentOrderIds.length === 0) {
            return res.status(400).json({ message: 'No orders to pay for this table.' });
        }
        const orderIdsToPay = table.currentOrderIds;

        const checkOrderItems = await OrderItem.find({ orderId: { $in: orderIdsToPay } });
        // เธซเธเนเธฒเธ•เธฃเธงเธเธชเธญเธเธงเนเธฒเธกเธตเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเธขเธฑเธเนเธกเนเน€เธชเธฃเนเธเธชเธกเธเธนเธฃเธ“เนเธซเธฃเธทเธญเนเธกเน
        // เธ–เนเธฒ kitchenType เน€เธเนเธ 'Drink' เนเธซเนเธเนเธฒเธกเธเธฒเธฃเธ•เธฃเธงเธเธชเธญเธเธเธตเน
        if (checkOrderItems.some(item => item.itemStatus !== 'Done' && item.kitchenType !== 'Drink')) {
            return res.status(400).json({ message: 'Cannot process payment. Some items are not yet completed.' });
        }

        const newPayment = new Payment({ 
            orderIds: orderIdsToPay, 
            method, 
            amountPaid 
        });
        await newPayment.save();
        await Order.updateMany(
            { _id: { $in: orderIdsToPay } },
            { status: 'Paid', paymentId: newPayment._id }
        );
        table.status = 'Open';
        table.currentOrderIds = [];
        await table.save();
        res.status(201).json({ 
            message: 'Payment processed successfully for all orders on table.', 
            payment: newPayment, table: table
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing payment', error: error.message });
    }
};
exports.getPaidOrders = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const paidOrders = await Order.find({
            status: 'Paid',
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        })
        .sort({ createdAt: -1 })
        .populate('paymentId', 'method');
        res.status(200).json(paidOrders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching paid orders.', error: error.message });
    }
};

// --- 3. (Admin Stats) ---
exports.getDashboardStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const salesResult = await Order.aggregate([
            { $match: { 
                status: 'Paid',
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }},
            { $group: {
                _id: null,
                totalSales: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 }
            }}
        ]);
        const pendingOrders = await Order.countDocuments({
            status: { $in: ['Preparing', 'Ready', 'Served'] }
        });
        const occupiedTables = await Table.countDocuments({
            status: 'Occupied'
        });
        const stats = {
            todaysSales: salesResult[0]?.totalSales || 0,
            paidOrdersToday: salesResult[0]?.totalOrders || 0,
            pendingOrders: pendingOrders,
            occupiedTables: occupiedTables
        };
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats.', error: error.message });
    }
};

/**
 * ๐“ GET /api/admin/sales/top-menu
 * (เนเธซเธกเน) เธเธณเธเธงเธ“เน€เธกเธเธนเธเธฒเธขเธ”เธตเธเธฒเธเธเธดเธฅเธ—เธตเนเธเนเธฒเธขเน€เธเธดเธเนเธฅเนเธง
 */
exports.getTopSellingMenus = async (req, res) => {
    try {
        const { period, sort = 'qty' } = req.query; 

        // 1. โญ๏ธ (Match Stage) เธชเธฃเนเธฒเธเธ•เธฑเธงเธเธฃเธญเธเธงเธฑเธเธ—เธตเน
        const dateMatch = {};
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        if (period === 'เธงเธฑเธเธเธตเน') {
            dateMatch.createdAt = { $gte: startOfDay, $lte: endOfDay };
        } else if (period === 'เธชเธฑเธเธ”เธฒเธซเนเธเธตเน') {
            const startOfWeek = new Date(startOfDay);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            dateMatch.createdAt = { $gte: startOfWeek, $lte: endOfDay };
        } else if (period === 'เน€เธ”เธทเธญเธเธเธตเน') {
            const startOfMonth = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
            dateMatch.createdAt = { $gte: startOfMonth, $lte: endOfDay };
        }
        // (เธ–เนเธฒ 'เธ—เธฑเนเธเธซเธกเธ”' เธเนเนเธกเนเธ•เนเธญเธเนเธชเน dateMatch)

        // 2. โญ๏ธ (Pipeline) เธเนเธเธซเธฒ Order เธ—เธตเน 'Paid'
        const paidOrders = await Order.find({
            status: 'Paid',
            ...dateMatch // (เน€เธเธดเนเธกเธ•เธฑเธงเธเธฃเธญเธเธงเธฑเธเธ—เธตเน)
        }).select('_id');

        if (paidOrders.length === 0) {
            return res.status(200).json([]); // (เธ–เนเธฒเนเธกเนเธกเธตเธเธดเธฅ เธเนเธชเนเธ Array เธงเนเธฒเธ)
        }
        
        const paidOrderIds = paidOrders.map(o => o._id);

        // 3. โญ๏ธ (Aggregation) เธชเธฃเธธเธเธขเธญเธ”เธเธฒเธ OrderItems
        const salesSummary = await OrderItem.aggregate([
            {
                $match: { orderId: { $in: paidOrderIds } }
            },
            {
                $group: {
                    _id: "$menuName",
                    qty: { $sum: "$quantity" },
                    revenue: { $sum: "$price" }
                }
            },
            {
                $sort: { [sort]: -1 } // (เน€เธฃเธตเธขเธเธ•เธฒเธก 'qty' เธซเธฃเธทเธญ 'revenue')
            }
        ]);
        
        res.status(200).json(salesSummary);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching top selling menus.', error: error.message });
    }
};

