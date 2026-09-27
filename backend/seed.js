// seed.js (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db.config'); 
const Menu = require('./src/models/Menu.model');
const Table = require('./src/models/Table.model');
const Order = require('./src/models/Order.model');
const OrderItem = require('./src/models/OrderItem.model');
const Employee = require('./src/models/Employee.model');
const bcrypt = require('bcryptjs');

// (menuData เนเธฅเธฐ toppingData เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
const menuData = [
  { "menuId": "R001", "name": "เนเธเธขเธธเธฃเธฒเน€เธกเธ", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R002", "name": "เธเธธเธเธเธฃเธฐเธ”เธนเธเธซเธกเธน", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R003", "name": "เธ•เนเธกเธขเธณเธฃเธฒเน€เธกเธ", "price": 69, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R004", "name": "เธเธฒเธฃเธธเธฃเธฒเน€เธกเธ", "price": 60, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R005", "name": "เธกเธดเนเธเธฐเธฃเธฒเน€เธกเธ", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R006", "name": "เธขเธฒเธเธดเนเธเธเธฐ", "price": 69, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "F001", "name": "เน€เธเธตเนเธขเธงเธเนเธฒ", "price": 55, "kitchenType": "Fry", "isAvailable": true },
  { "menuId": "F002", "name": "เนเธ”เธเธฑเธ—เธเธฅเธฒ", "price": 45, "kitchenType": "Fry", "isAvailable": true },
  { "menuId": "D001", "name": "เธเธฒเน€เธเธตเธขเธงเธกเธฐเธฅเธด", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D002", "name": "เธเธฒเธเธตเธ", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D003", "name": "เน€เธญเธชเนเธเธฅเนเธฒ", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D004", "name": "เธเนเธณเน€เธเธฅเนเธฒ", "price": 15, "kitchenType": "Drink", "isAvailable": true }
];
const tableData = [
    { "tableId": "T01", "status": "Open", "currentOrderIds": [] }, // (เนเธเนเนเธ) เนเธเน currentOrderIds
    { "tableId": "T02", "status": "Open", "currentOrderIds": [] },
    { "tableId": "T03", "status": "Open", "currentOrderIds": [] }
];

const employeeData = async () => {
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('1234', salt);
    const staffPass = await bcrypt.hash('1234', salt);
    const kitchenPass = await bcrypt.hash('1234', salt);

    return [
      { "employeeId": "E001", "name": "Admin User", "username": "admin", "passwordHash": adminPass, "role": "Admin" },
      { "employeeId": "E002", "name": "Staff User", "username": "staff", "passwordHash": staffPass, "role": "Staff" },
      // --- ๐‘ (เนเธเนเนเธ) ---
      { 
        "employeeId": "E003", 
        "name": "Kitchen User", 
        "username": "chef", 
        "passwordHash": kitchenPass, 
        "role": "Kitchen" // (เน€เธเธฅเธตเนเธขเธเน€เธเนเธ Role เนเธซเธกเน)
      }
    ];
};

const importData = async () => {
  try {
    await connectDB();
    console.log('๐—‘๏ธ Clearing existing data...');
    await Menu.deleteMany();
    await Table.deleteMany();
    await Order.deleteMany();           
    await OrderItem.deleteMany();     
    await Employee.deleteMany();
    console.log('   Data Cleared.');
    
    console.log('๐“ Importing new data...');
    await Menu.insertMany(menuData);
    await Table.insertMany(tableData);
    const employees = await employeeData();
    await Employee.insertMany(employees);
    
    console.log('โ… Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('โ Error with data import:', error);
    process.exit(1);
  }
};

importData();

