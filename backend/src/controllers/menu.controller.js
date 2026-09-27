// src/controllers/menu.controller.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
const Menu = require('../models/Menu.model');

/**
 * ๐“ POST /api/admin/menus
 * (เนเธเนเนเธ) เธชเธฃเนเธฒเธเธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃเนเธซเธกเน (เธเธฃเนเธญเธกเธฃเธฑเธเนเธเธฅเน)
 */
exports.createMenu = async (req, res) => {
    try {
        // 1. เธเนเธญเธกเธนเธฅ (name, price เธฏเธฅเธฏ) เธเธฐเธญเธขเธนเนเนเธ req.body
        const newMenuData = req.body;

        // 2. (เนเธซเธกเน) เธ–เนเธฒเธกเธตเนเธเธฅเนเธญเธฑเธเนเธซเธฅเธ”เธกเธฒ (เธเธฒเธ multer)
        if (req.file) {
            // 3. เน€เธฃเธฒเธเธฐเน€เธเนเธ "path" เธเธญเธเนเธเธฅเนเธ—เธตเนเน€เธเธเนเธฅเนเธง (เน€เธเนเธ 'uploads/image-12345.png')
            newMenuData.imageUrl = req.file.path.replace(/\\/g, "/"); // (เนเธเน \ เน€เธเนเธ / เธชเธณเธซเธฃเธฑเธ Windows)
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
 * ๐” GET /api/admin/menus
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก - เนเธกเนเธ•เนเธญเธเนเธเน)
 */
exports.getAllMenus = async (req, res) => {
    // ... (เนเธเนเธ”เน€เธ”เธดเธก) ...
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
 * ๐” GET /api/admin/menus/:menuId
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก - เนเธกเนเธ•เนเธญเธเนเธเน)
 */
exports.getMenuById = async (req, res) => {
    // ... (เนเธเนเธ”เน€เธ”เธดเธก) ...
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
 * โ๏ธ PUT /api/admin/menus/:menuId
 * (เนเธเนเนเธ) เธญเธฑเธเน€เธ”เธ•เธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃ (เธเธฃเนเธญเธกเธฃเธฑเธเนเธเธฅเนเนเธซเธกเน เธ–เนเธฒเธกเธต)
 */
exports.updateMenu = async (req, res) => {
    const { menuId } = req.params;
    const updateData = req.body;

    // (เนเธซเธกเน) เธ–เนเธฒเธกเธตเธเธฒเธฃเธญเธฑเธเนเธซเธฅเธ”เนเธเธฅเนเนเธซเธกเนเธกเธฒเธ—เธฑเธ
    if (req.file) {
        updateData.imageUrl = req.file.path.replace(/\\/g, "/");
        // (เธซเธกเธฒเธขเน€เธซเธ•เธธ: เน€เธฃเธฒเธเธงเธฃเธฅเธเธฃเธนเธเน€เธเนเธฒเธญเธญเธเธเธฒเธ /uploads เธ”เนเธงเธข เนเธ•เนเธ•เธญเธเธเธตเนเธเธฐเธเนเธฒเธกเนเธเธเนเธญเธ)
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
 * ๐—‘๏ธ DELETE /api/admin/menus/:menuId
 * (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก - เนเธกเนเธ•เนเธญเธเนเธเน)
 */
exports.deleteMenu = async (req, res) => {
    // ... (เนเธเนเธ”เน€เธ”เธดเธก) ...
    // (เธซเธกเธฒเธขเน€เธซเธ•เธธ: เน€เธฃเธฒเธเธงเธฃเธฅเธเธฃเธนเธเธญเธญเธเธเธฒเธ /uploads เธ”เนเธงเธข)
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

