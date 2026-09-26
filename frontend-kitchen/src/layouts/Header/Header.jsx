import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import './Header.css'; //

// (แก้ไข) ลบ onLogout ออกจาก props
const Header = ({ title, onBack, onRefresh }) => {
  return (
    <div className="kitchen-header" style={{ backgroundColor: "#813a3a" }}>
      
      {onBack ? (
        <span onClick={onBack} className='bi bi-chevron-left'></span>
      ) : (
        <span></span> // เว้นที่ว่าง
      )}
      
      <div className="kitchen-title">{title}</div>
      
      <div>
        {onRefresh && (
          <span onClick={onRefresh} className="bi bi-arrow-clockwise"></span>
        )}
      </div>
    </div>
  );
};

export default Header;