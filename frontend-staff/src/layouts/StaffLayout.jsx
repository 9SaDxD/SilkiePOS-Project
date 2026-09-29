import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar'; // (ไฟล์นี้เราต้องสร้างในขั้นตอนต่อไป)
import './StaffLayout.css'; // (ไฟล์นี้เราต้องสร้างในขั้นตอนต่อไป)

// URL ของประตูหน้า (Login Hub)
const LOGIN_HUB_URL = 'https://silkie-pos-login.vercel.app';

const StaffLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // (State ควบคุม Sidebar)
  const navigate = useNavigate();

  // 1. ตรวจสอบ Token เมื่อแอปเริ่มทำงาน
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // (ต้องเป็น Staff หรือ Admin)
    if (token && (userRole === 'Staff' || userRole === 'Admin')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.clear();
    }
    setLoadingAuth(false);
  }, []);

  // 2. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.replace(LOGIN_HUB_URL); 
  };

  // 3. ฟังก์ชันเปิด/ปิด Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 4. รอเช็ค Auth
  if (loadingAuth) {
    return <div>กำลังตรวจสอบสิทธิ์...</div>;
  }

  // 5. ถ้าไม่มีสิทธิ์ -> เด้งกลับ
  if (!isAuthenticated) {
    window.location.replace(LOGIN_HUB_URL);
    return null;
  }

  // 6. ถ้ามีสิทธิ์ -> แสดง Layout
  return (
    <div className="staff-layout">
      {/* (Sidebar จะซ่อนอยู่ และเปิด/ปิดด้วย State) */}
      <StaffSidebar 
        isOpen={isSidebarOpen} 
        onLogout={handleLogout}
        onClose={toggleSidebar} // (กดที่ Link ใน Sidebar เพื่อปิด)
      />
      
      {/* (นี่คือที่ที่หน้า TableSelect, Order, Bill จะมาแสดง) */}
      <div className="staff-content">
        <Outlet context={{ toggleSidebar }} /> {/* 👈 (ส่งฟังก์ชัน toggle ให้ลูก) */}
      </div>
    </div>
  );
};

export default StaffLayout;

