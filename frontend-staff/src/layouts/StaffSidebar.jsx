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
            <i className="fas fa-th-large"></i> Table (เน€เธฅเธทเธญเธเนเธ•เนเธฐ)
          </NavLink>
          {/* (เธเธธเนเธก Order เธเธฐเธ—เธณเธซเธเนเธฒเธ—เธตเนเน€เธซเธกเธทเธญเธเธเธธเนเธก Table) */}
          <NavLink to="/" className="nav-item" onClick={onClose}>
            <i className="fas fa-clipboard-list"></i> Order (เธชเธฑเนเธเธญเธฒเธซเธฒเธฃ)
          </NavLink>

          {/* --- ๐‘ (เธเธตเนเธเธทเธญเธเธธเนเธกเนเธซเธกเน) --- */}
          <NavLink to="/history" className="nav-item" onClick={onClose}>
            <i className="fas fa-history"></i> History (เธเธฃเธฐเธงเธฑเธ•เธดเธเธดเธฅ)
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

