const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        // การตั้งค่าเหล่านี้มักจะแก้ปัญหา Caching/Stale Data ใน Array Update ได้
        
        // 🚨 สำคัญ: บังคับให้ MongoDB อ่านข้อมูลที่ถูก Commit แล้ว (ลด Stale Data)
        readConcern: { level: 'majority' }, 
        writeConcern: { w: 'majority', wtimeout: 5000 }
    });
    console.log('✅ MongoDB connected successfully (High Consistency)');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;