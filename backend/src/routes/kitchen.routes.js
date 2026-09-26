// src/routes/kitchen.routes.js (ฉบับอัปเดต)
const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchen.controller');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

router.use(verifyToken);
router.use(checkRole(['Kitchen', 'Admin'])); 

// 1. ดึงออเดอร์
router.get('/orders/:kitchenType', kitchenController.getPendingOrders);

// 2. สลับสถานะ (Done <-> Pending)
router.post('/item/:itemId/toggle', kitchenController.toggleItemStatus);

// 3. อัปเดตสถานะบิลรวมเป็น 'Served'
router.post('/order/:orderId/served', kitchenController.markOrderServed);

// --- 👇 (นี่คือบรรทัดใหม่) ---
// 4. ย้อนกลับ (Undo) จาก 'Served' เป็น 'Ready'
router.post('/order/:orderId/undo', kitchenController.undoServeOrder);

module.exports = router;