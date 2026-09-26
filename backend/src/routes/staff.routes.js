// src/routes/staff.routes.js (ฉบับอัปเดต)

const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staff.controller');
const orderController = require('../controllers/order.controller');
const menuController = require('../controllers/menu.controller');

//Middleware
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// 💡 สั่งให้ทุก Route ในไฟล์นี้ ต้องเป็น Staff หรือ Admin
router.use(verifyToken);
router.use(checkRole(['Staff', 'Admin']));

// --- 🧑‍🍳 API สำหรับ Staff หน้าร้าน 🧑‍🍳 ---

// --- API สำหรับจัดการโต๊ะ/บิล ---
router.get('/tables', staffController.getAllTables);
router.get('/tables/:tableId/bill', staffController.getTableBill);
router.post('/tables/:tableId/open', staffController.openTable);
router.post('/tables/:tableId/close', staffController.closeTable); 

// --- API สำหรับจัดการออเดอร์ (Order/OrderItem) ---
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:orderId', orderController.getOrderById);

// --- 👇 (นี่คือโค้ดใหม่ที่เราเพิ่ม) ---
// API สำหรับ "ยกเลิก" รายการอาหารออกจากบิล (ลบ OrderItem)
router.delete('/orders/item/:itemId', orderController.cancelOrderItem);
// ------------------------------------

// --- API สำหรับ "ดู" เมนู (สำหรับรับออเดอร์) ---
router.get('/menus', menuController.getAllMenus);
router.get('/menus/:menuId', menuController.getMenuById);

// --- API สำหรับชำระเงิน ---
router.post('/payments', staffController.processPayment);

// --- API สำหรับดูประวัติ ---
router.get('/history/paid-orders', staffController.getPaidOrders);

module.exports = router;