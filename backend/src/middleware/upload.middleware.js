// src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

// 1. กำหนดว่าจะเก็บไฟล์ที่ไหน
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // (ต้องสร้างโฟลเดอร์ 'uploads' ไว้ก่อน)
  },
  filename: function (req, file, cb) {
    // 2. สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 3. กรองไฟล์ (อนุญาตเฉพาะรูปภาพ)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์ .jpeg, .jpg, .png เท่านั้น'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // จำกัดขนาด 5MB
});

module.exports = upload;