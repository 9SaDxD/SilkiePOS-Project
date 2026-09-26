import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../styles/Sidebar.css"; //

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
        onLogout();
    }
    // (App.jsx จะจัดการส่งผู้ใช้กลับไปหน้า Login Hub เอง)
  };

  return (
    <div className="sidebar">
      <img src="/images/logo.png" alt="หัวข้อ" className="sidebar-logo" />

      <ul className="menu">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            หน้าหลัก
          </NavLink>
        </li>
        <li>
          <NavLink to="/sales-menu" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เมนูขายดี
          </NavLink>
        </li>
        <li>
          <NavLink to="/edit-menu" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            แก้ไขเมนู
          </NavLink>
        </li>
        
        {/* --- (ลบ "แก้ไขท็อปปิ้ง" และ "แก้ไขน้ำ" ออก) --- */}
        
        <li>
          <NavLink to="/tables" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            โต๊ะ
          </NavLink>
        </li>
        <li>
          <NavLink to="/staff" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            พนักงาน
          </NavLink>
        </li>
      </ul>
      
      <button onClick={handleLogoutClick} className="menu-item logout-btn">
        Sign out
      </button>
    </div>
  );
}

export default Sidebar;