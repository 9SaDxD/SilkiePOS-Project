import React from 'react'; // (ลบ useState, useEffect ออก)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

// 1. Import Components และ Pages
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SalesMenu from "./pages/SalesMenu";
import EditMenu from "./pages/EditMenu";
import Staff from "./pages/Staff";
import Tables from "./pages/Tables";
// (เราลบ Topping กับ AddDrink ออกไปแล้ว)
import AuthCallback from "./pages/AuthCallback"; // 👈 (ใหม่) Import หน้า AuthCallback
import "./App.css"; //

// 2. URL ของประตูหน้า (Login Hub)
const LOGIN_HUB_URL = 'https://silkie-pos-login.vercel.app';

// 3. Axios Interceptor (เหมือนเดิม)
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 4. (ใหม่) สร้าง ProtectedRoute
// มันจะทำหน้าที่ "ป้องกัน" ทุกหน้า
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (token && userRole === 'Admin') {
    // 5. ถ้ามีสิทธิ์ -> แสดง Sidebar + หน้าที่ขอ
    return (
      <div className="main-layout">
        <Sidebar onLogout={handleLogout} /> 
        <div className="main-content">
          {children}
        </div>
      </div>
    );
  }

  // 6. ถ้าไม่มีสิทธิ์ -> เด้งกลับไป Login Hub
  window.location.replace(LOGIN_HUB_URL);
  return null;
};

// 7. (ใหม่) ฟังก์ชัน Logout
const handleLogout = () => {
  localStorage.clear();
  window.location.replace(LOGIN_HUB_URL); 
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 8. (ใหม่) หน้าสำหรับรับ Token */}
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* 9. (ใหม่) หน้าสำหรับ Login (สำรอง) */}
        <Route path="/login" element={<Navigate to={LOGIN_HUB_URL} replace />} />

        {/* 10. (ใหม่) ใช้ ProtectedRoute หุ้มทุกหน้า */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sales-menu" element={<ProtectedRoute><SalesMenu /></ProtectedRoute>} />
        <Route path="/edit-menu" element={<ProtectedRoute><EditMenu /></ProtectedRoute>} />
        <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        
        {/* 11. (ใหม่) ถ้าเข้ามั่ว ให้เด้งไปหน้าหลัก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


