// seed.js (ฉบับอัปเดต)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db.config'); 
const Menu = require('./src/models/Menu.model');
const Table = require('./src/models/Table.model');
const Order = require('./src/models/Order.model');
const OrderItem = require('./src/models/OrderItem.model');
const Employee = require('./src/models/Employee.model');
const bcrypt = require('bcryptjs');

// (menuData และ toppingData เหมือนเดิม)
const menuData = [
  { "menuId": "R001", "name": "โชยุราเมง", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R002", "name": "ซุปกระดูกหมู", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R003", "name": "ต้มยำราเมง", "price": 69, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R004", "name": "ซารุราเมง", "price": 60, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R005", "name": "มิโซะราเมง", "price": 65, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "R006", "name": "ยากิโซบะ", "price": 69, "kitchenType": "Ramen", "isAvailable": true },
  { "menuId": "F001", "name": "เกี๊ยวซ่า", "price": 55, "kitchenType": "Fry", "isAvailable": true },
  { "menuId": "F002", "name": "โดนัทปลา", "price": 45, "kitchenType": "Fry", "isAvailable": true },
  { "menuId": "D001", "name": "ชาเขียวมะลิ", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D002", "name": "ชาพีช", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D003", "name": "เอสโคล่า", "price": 15, "kitchenType": "Drink", "isAvailable": true },
  { "menuId": "D004", "name": "น้ำเปล่า", "price": 15, "kitchenType": "Drink", "isAvailable": true }
];
const tableData = [
    { "tableId": "T01", "status": "Open", "currentOrderIds": [] }, // (แก้ไข) ใช้ currentOrderIds
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
      // --- 👇 (แก้ไข) ---
      { 
        "employeeId": "E003", 
        "name": "Kitchen User", 
        "username": "chef", 
        "passwordHash": kitchenPass, 
        "role": "Kitchen" // (เปลี่ยนเป็น Role ใหม่)
      }
    ];
};

const importData = async () => {
  try {
    await connectDB();
    console.log('🗑️ Clearing existing data...');
    await Menu.deleteMany();
    await Table.deleteMany();
    await Order.deleteMany();           
    await OrderItem.deleteMany();     
    await Employee.deleteMany();
    console.log('   Data Cleared.');
    
    console.log('📝 Importing new data...');
    await Menu.insertMany(menuData);
    await Table.insertMany(tableData);
    const employees = await employeeData();
    await Employee.insertMany(employees);
    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

importData();