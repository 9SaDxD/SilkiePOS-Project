import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "../styles/Sidebar.css"; //

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
        onLogout();
    }
    // (App.jsx เธเธฐเธเธฑเธ”เธเธฒเธฃเธชเนเธเธเธนเนเนเธเนเธเธฅเธฑเธเนเธเธซเธเนเธฒ Login Hub เน€เธญเธ)
  };

  return (
    <div className="sidebar">
      <img src="/images/logo.png" alt="เธซเธฑเธงเธเนเธญ" className="sidebar-logo" />

      <ul className="menu">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เธซเธเนเธฒเธซเธฅเธฑเธ
          </NavLink>
        </li>
        <li>
          <NavLink to="/sales-menu" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เน€เธกเธเธนเธเธฒเธขเธ”เธต
          </NavLink>
        </li>
        <li>
          <NavLink to="/edit-menu" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เนเธเนเนเธเน€เธกเธเธน
          </NavLink>
        </li>
        
        {/* --- (เธฅเธ "เนเธเนเนเธเธ—เนเธญเธเธเธดเนเธ" เนเธฅเธฐ "เนเธเนเนเธเธเนเธณ" เธญเธญเธ) --- */}
        
        <li>
          <NavLink to="/tables" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เนเธ•เนเธฐ
          </NavLink>
        </li>
        <li>
          <NavLink to="/staff" className={({ isActive }) => isActive ? "menu-item active" : "menu-item"}>
            เธเธเธฑเธเธเธฒเธ
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

