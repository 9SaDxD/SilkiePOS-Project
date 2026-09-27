// src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

// 1. เธเธณเธซเธเธ”เธงเนเธฒเธเธฐเน€เธเนเธเนเธเธฅเนเธ—เธตเนเนเธซเธ
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // (เธ•เนเธญเธเธชเธฃเนเธฒเธเนเธเธฅเน€เธ”เธญเธฃเน 'uploads' เนเธงเนเธเนเธญเธ)
  },
  filename: function (req, file, cb) {
    // 2. เธชเธฃเนเธฒเธเธเธทเนเธญเนเธเธฅเนเนเธซเธกเนเธ—เธตเนเนเธกเนเธเนเธณเธเธฑเธ
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 3. เธเธฃเธญเธเนเธเธฅเน (เธญเธเธธเธเธฒเธ•เน€เธเธเธฒเธฐเธฃเธนเธเธ เธฒเธ)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(new Error('เธฃเธญเธเธฃเธฑเธเน€เธเธเธฒเธฐเนเธเธฅเน .jpeg, .jpg, .png เน€เธ—เนเธฒเธเธฑเนเธ'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // เธเธณเธเธฑเธ”เธเธเธฒเธ” 5MB
});

module.exports = upload;

