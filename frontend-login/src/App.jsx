import React from 'react';
import LoginPage from './pages/LoginPage'; // (ต้องมั่นใจว่ามีไฟล์นี้ใน src/pages/LoginPage.jsx)
import './index.css'; // (ไฟล์ CSS ที่เราสร้างสำหรับพื้นหลัง)

function App() {
  
  // App.jsx ของ "ประตูหน้า" (frontend-login)
  // จะมีแค่หน้า Login เท่านั้นครับ
  
  return (
      <LoginPage />
  );
}

export default App;

