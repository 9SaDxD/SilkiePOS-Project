// src/server.js

require('dotenv').config(); 
const express = require('express');
const connectDB = require('./src/config/db.config');
const cors = require('cors');

// --- เพิ่ม Swagger ---
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger.config');
// -------------------

const app = express();
const PORT = process.env.PORT || 3000;

// เชื่อมต่อฐานข้อมูล
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); 
app.use('/uploads', express.static('uploads'));

// --- Swagger Route ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// ---------------------

// Routes
const authRoutes = require('./src/routes/auth.routes');
app.use('/api/auth', authRoutes);

const adminRoutes = require('./src/routes/admin.routes');
app.use('/api/admin', adminRoutes);

const staffRoutes = require('./src/routes/staff.routes');
app.use('/api/staff', staffRoutes);

const kitchenRoutes = require('./src/routes/kitchen.routes'); 
app.use('/api/kitchen', kitchenRoutes); 

app.get('/', (req, res) => {
  res.send('Restaurant Backend API is Running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});