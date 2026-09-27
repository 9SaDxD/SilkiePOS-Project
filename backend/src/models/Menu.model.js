// src/models/Menu.model.js

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    menuId: {
        type: String, // ID เธ เธฒเธขเนเธเธฃเนเธฒเธ เน€เธเนเธ M001
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
    kitchenType: { // เธชเธณเธซเธฃเธฑเธเนเธขเธเธเธฒเธเนเธซเนเธเธฃเธฑเธง (Ramen, Fry, Drink)
        type: String,
        enum: ['Ramen', 'Fry', 'Drink', 'Other'], // **เธชเธณเธเธฑเธ:** เธ•เนเธญเธเธกเธต Ramen เนเธฅเธฐ Fry
        required: true
    },
    imageUrl: { // URL เธฃเธนเธเธ เธฒเธเธชเธณเธซเธฃเธฑเธเนเธชเธ”เธเนเธ App
        type: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const Menu = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

module.exports = Menu;

