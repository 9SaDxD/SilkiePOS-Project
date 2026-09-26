// src/controllers/menu.controller.js (ฉบับอัปเดต)
const Menu = require('../models/Menu.model');

/**
 * 📝 POST /api/admin/menus
 * (แก้ไข) สร้างรายการอาหารใหม่ (พร้อมรับไฟล์)
 */
exports.createMenu = async (req, res) => {
    try {
        // 1. ข้อมูล (name, price ฯลฯ) จะอยู่ใน req.body
        const newMenuData = req.body;

        // 2. (ใหม่) ถ้ามีไฟล์อัปโหลดมา (จาก multer)
        if (req.file) {
            // 3. เราจะเก็บ "path" ของไฟล์ที่เซฟแล้ว (เช่น 'uploads/image-12345.png')
            newMenuData.imageUrl = req.file.path.replace(/\\/g, "/"); // (แก้ \ เป็น / สำหรับ Windows)
        }

        const newMenu = new Menu(newMenuData);
        await newMenu.save();
        res.status(201).json({ 
            message: 'Menu item created successfully.', 
            menu: newMenu 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Failed to create menu.', 
                error: 'Menu ID already exists.' 
            });
        }
        res.status(500).json({ 
            message: 'Failed to create menu.', 
            error: error.message 
        });
    }
};

/**
 * 🔍 GET /api/admin/menus
 * (ฟังก์ชันเดิม - ไม่ต้องแก้)
 */
exports.getAllMenus = async (req, res) => {
    // ... (โค้ดเดิม) ...
    try {
        const menus = await Menu.find({}).sort({ menuId: 1 });
        res.status(200).json(menus);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching menus.', 
            error: error.message 
        });
    }
};

/**
 * 🔎 GET /api/admin/menus/:menuId
 * (ฟังก์ชันเดิม - ไม่ต้องแก้)
 */
exports.getMenuById = async (req, res) => {
    // ... (โค้ดเดิม) ...
    const { menuId } = req.params;
    try {
        const menu = await Menu.findOne({ menuId }); 
        if (!menu) {
            return res.status(400).json({ message: 'Menu item not found.' });
        }
        res.status(200).json(menu);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching menu item.', 
            error: error.message 
        });
    }
};

/**
 * ✍️ PUT /api/admin/menus/:menuId
 * (แก้ไข) อัปเดตรายการอาหาร (พร้อมรับไฟล์ใหม่ ถ้ามี)
 */
exports.updateMenu = async (req, res) => {
    const { menuId } = req.params;
    const updateData = req.body;

    // (ใหม่) ถ้ามีการอัปโหลดไฟล์ใหม่มาทับ
    if (req.file) {
        updateData.imageUrl = req.file.path.replace(/\\/g, "/");
        // (หมายเหตุ: เราควรลบรูปเก่าออกจาก /uploads ด้วย แต่ตอนนี้จะข้ามไปก่อน)
    }
    
    try {
        const updatedMenu = await Menu.findOneAndUpdate(
            { menuId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMenu) {
            return res.status(400).json({ message: 'Menu item not found.' });
        }
        res.status(200).json({
            message: 'Menu item updated successfully.',
            menu: updatedMenu
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating menu item.', 
            error: error.message 
        });
    }
};

/**
 * 🗑️ DELETE /api/admin/menus/:menuId
 * (ฟังก์ชันเดิม - ไม่ต้องแก้)
 */
exports.deleteMenu = async (req, res) => {
    // ... (โค้ดเดิม) ...
    // (หมายเหตุ: เราควรลบรูปออกจาก /uploads ด้วย)
    const { menuId } = req.params;
    try {
        const deletedMenu = await Menu.findOneAndDelete({ menuId });
        if (!deletedMenu) {
            return res.status(400).json({ message: 'Menu item not found.' });
        }
        res.status(200).json({
            message: 'Menu item deleted successfully.',
            menuId: deletedMenu.menuId
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting menu item.', 
            error: error.message 
        });
    }
};