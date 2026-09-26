// src/models/Menu.model.js

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    menuId: {
        type: String, // ID ภายในร้าน เช่น M001
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    kitchenType: { // สำหรับแยกงานให้ครัว (Ramen, Fry, Drink)
        type: String,
        enum: ['Ramen', 'Fry', 'Drink', 'Other'], // **สำคัญ:** ต้องมี Ramen และ Fry
        required: true
    },
    imageUrl: { // URL รูปภาพสำหรับแสดงใน App
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const Menu = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

module.exports = Menu;