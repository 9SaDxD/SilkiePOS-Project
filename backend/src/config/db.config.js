const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
        // เธเธฒเธฃเธ•เธฑเนเธเธเนเธฒเน€เธซเธฅเนเธฒเธเธตเนเธกเธฑเธเธเธฐเนเธเนเธเธฑเธเธซเธฒ Caching/Stale Data เนเธ Array Update เนเธ”เน
        
        // ๐จ เธชเธณเธเธฑเธ: เธเธฑเธเธเธฑเธเนเธซเน MongoDB เธญเนเธฒเธเธเนเธญเธกเธนเธฅเธ—เธตเนเธ–เธนเธ Commit เนเธฅเนเธง (เธฅเธ” Stale Data)
        readConcern: { level: 'majority' }, 
        writeConcern: { w: 'majority', wtimeout: 5000 }
    });
    console.log('โ… MongoDB connected successfully (High Consistency)');
  } catch (error) {
    console.error('โ MongoDB connection failed:', error.message);
    // Exit process with failure
    process.exit(1); 
  }
};

module.exports = connectDB;

