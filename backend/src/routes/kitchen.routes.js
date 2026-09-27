// src/routes/kitchen.routes.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchen.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(checkRole(['Kitchen', 'Admin'])); 

// 1. เธ”เธถเธเธญเธญเน€เธ”เธญเธฃเน
router.get('/orders/:kitchenType', kitchenController.getPendingOrders);

// 2. เธชเธฅเธฑเธเธชเธ–เธฒเธเธฐ (Done <-> Pending)
router.post('/item/:itemId/toggle', kitchenController.toggleItemStatus);

// 3. เธญเธฑเธเน€เธ”เธ•เธชเธ–เธฒเธเธฐเธเธดเธฅเธฃเธงเธกเน€เธเนเธ 'Served'
router.post('/order/:orderId/served', kitchenController.markOrderServed);

// --- ๐‘ (เธเธตเนเธเธทเธญเธเธฃเธฃเธ—เธฑเธ”เนเธซเธกเน) ---
// 4. เธขเนเธญเธเธเธฅเธฑเธ (Undo) เธเธฒเธ 'Served' เน€เธเนเธ 'Ready'
router.post('/order/:orderId/undo', kitchenController.undoServeOrder);

module.exports = router;

