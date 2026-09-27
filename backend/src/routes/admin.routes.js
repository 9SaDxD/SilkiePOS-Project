const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menu.controller');
const staffController = require('../controllers/staff.controller');
const authController = require('../controllers/auth.controller');

const { verifyToken, checkRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(verifyToken);
router.use(checkRole(['Admin']));

// --- ๐ก๏ธ API เธชเธณเธซเธฃเธฑเธ Admin เน€เธ—เนเธฒเธเธฑเนเธ ๐ก๏ธ ---

// 1. Dashboard
router.get('/stats', staffController.getDashboardStats); 

// 2. เธเธฒเธฃเธเธฑเธ”เธเธฒเธฃเน€เธกเธเธน
router.get('/menus', menuController.getAllMenus);
router.post('/menus', upload.single('image'), menuController.createMenu);
router.put('/menus/:menuId', upload.single('image'), menuController.updateMenu);
router.delete('/menus/:menuId', menuController.deleteMenu);

// 4. เธเธฒเธฃเธเธฑเธ”เธเธฒเธฃเนเธ•เนเธฐ
router.get('/tables', staffController.getAllTables);
router.post('/tables', staffController.createTable);
router.delete('/tables/:id', staffController.adminDeleteTable);

// 5. เธเธฒเธฃเธเธฑเธ”เธเธฒเธฃเธเธเธฑเธเธเธฒเธ
router.post('/employees', authController.registerEmployee);
router.get('/employees', authController.getAllEmployees);
router.put('/employees/:id', authController.updateEmployee);
router.delete('/employees/:id', authController.deleteEmployee);

// --- ๐‘ (เธเธตเนเธเธทเธญเธเธฃเธฃเธ—เธฑเธ”เนเธซเธกเน) ---
// 6. เธฃเธฒเธขเธเธฒเธเธขเธญเธ”เธเธฒเธข
router.get('/sales/top-menu', staffController.getTopSellingMenus);

module.exports = router;

