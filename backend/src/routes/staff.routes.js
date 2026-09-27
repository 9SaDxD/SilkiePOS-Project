// src/routes/staff.routes.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const orderController = require('../controllers/order.controller');
const menuController = require('../controllers/menu.controller');

//Middleware
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// ๐’ก เธชเธฑเนเธเนเธซเนเธ—เธธเธ Route เนเธเนเธเธฅเนเธเธตเน เธ•เนเธญเธเน€เธเนเธ Staff เธซเธฃเธทเธญ Admin
router.use(verifyToken);
router.use(checkRole(['Staff', 'Admin']));

// --- ๐ง‘โ€๐ณ API เธชเธณเธซเธฃเธฑเธ Staff เธซเธเนเธฒเธฃเนเธฒเธ ๐ง‘โ€๐ณ ---

// --- API เธชเธณเธซเธฃเธฑเธเธเธฑเธ”เธเธฒเธฃเนเธ•เนเธฐ/เธเธดเธฅ ---
router.get('/tables', staffController.getAllTables);
router.get('/tables/:tableId/bill', staffController.getTableBill);
router.post('/tables/:tableId/open', staffController.openTable);
router.post('/tables/:tableId/close', staffController.closeTable); 

// --- API เธชเธณเธซเธฃเธฑเธเธเธฑเธ”เธเธฒเธฃเธญเธญเน€เธ”เธญเธฃเน (Order/OrderItem) ---
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:orderId', orderController.getOrderById);

// --- ๐‘ (เธเธตเนเธเธทเธญเนเธเนเธ”เนเธซเธกเนเธ—เธตเนเน€เธฃเธฒเน€เธเธดเนเธก) ---
// API เธชเธณเธซเธฃเธฑเธ "เธขเธเน€เธฅเธดเธ" เธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃเธญเธญเธเธเธฒเธเธเธดเธฅ (เธฅเธ OrderItem)
router.delete('/orders/item/:itemId', orderController.cancelOrderItem);
// ------------------------------------

// --- API เธชเธณเธซเธฃเธฑเธ "เธ”เธน" เน€เธกเธเธน (เธชเธณเธซเธฃเธฑเธเธฃเธฑเธเธญเธญเน€เธ”เธญเธฃเน) ---
router.get('/menus', menuController.getAllMenus);
router.get('/menus/:menuId', menuController.getMenuById);

// --- API เธชเธณเธซเธฃเธฑเธเธเธณเธฃเธฐเน€เธเธดเธ ---
router.post('/payments', staffController.processPayment);

// --- API เธชเธณเธซเธฃเธฑเธเธ”เธนเธเธฃเธฐเธงเธฑเธ•เธด ---
router.get('/history/paid-orders', staffController.getPaidOrders);

module.exports = router;

