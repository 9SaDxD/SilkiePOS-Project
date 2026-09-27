import React from 'react';
import { NavLink } from 'react-router-dom';
import './StaffSidebar.css'; 

const username = localStorage.getItem('username') || 'Employee';
const userRole = localStorage.getItem('userRole') || 'Staff';

const StaffSidebar = ({ isOpen, onLogout, onClose }) => {
  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose} 
      ></div>
      
      <div className={`staff-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>{username}</h3>
          <p>{userRole}</p>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className="nav-item" onClick={onClose}>
            <i className="fas fa-th-large"></i> Table (เลือกโต๊ะ)
          </NavLink>
          {/* (ปุ่ม Order จะทำหน้าที่เหมือนปุ่ม Table) */}
          <NavLink to="/" className="nav-item" onClick={onClose}>
            <i className="fas fa-clipboard-list"></i> Order (สั่งอาหาร)
          </NavLink>

          {/* --- 👇 (นี่คือปุ่มใหม่) --- */}
          <NavLink to="/history" className="nav-item" onClick={onClose}>
            <i className="fas fa-history"></i> History (ประวัติบิล)
          </NavLink>
        </nav>
        
        <div className="sidebar-footer">
          <button className="sign-out-btn" onClick={onLogout}>
            <i className="fas fa-sign-out-alt"></i> Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default StaffSidebar;

