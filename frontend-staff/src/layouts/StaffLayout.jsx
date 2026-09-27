import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StaffSidebar from './StaffSidebar'; // (เนเธเธฅเนเธเธตเนเน€เธฃเธฒเธ•เนเธญเธเธชเธฃเนเธฒเธเนเธเธเธฑเนเธเธ•เธญเธเธ•เนเธญเนเธ)
import './StaffLayout.css'; // (เนเธเธฅเนเธเธตเนเน€เธฃเธฒเธ•เนเธญเธเธชเธฃเนเธฒเธเนเธเธเธฑเนเธเธ•เธญเธเธ•เนเธญเนเธ)

// URL เธเธญเธเธเธฃเธฐเธ•เธนเธซเธเนเธฒ (Login Hub)
const LOGIN_HUB_URL = 'https://silkie-login.vercel.app';

const StaffLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // (State เธเธงเธเธเธธเธก Sidebar)
  const navigate = useNavigate();

  // 1. เธ•เธฃเธงเธเธชเธญเธ Token เน€เธกเธทเนเธญเนเธญเธเน€เธฃเธดเนเธกเธ—เธณเธเธฒเธ
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    // (เธ•เนเธญเธเน€เธเนเธ Staff เธซเธฃเธทเธญ Admin)
    if (token && (userRole === 'Staff' || userRole === 'Admin')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      localStorage.clear();
    }
    setLoadingAuth(false);
  }, []);

  // 2. เธเธฑเธเธเนเธเธฑเธ Logout
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    window.location.replace(LOGIN_HUB_URL); 
  };

  // 3. เธเธฑเธเธเนเธเธฑเธเน€เธเธดเธ”/เธเธดเธ” Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 4. เธฃเธญเน€เธเนเธ Auth
  if (loadingAuth) {
    return <div>เธเธณเธฅเธฑเธเธ•เธฃเธงเธเธชเธญเธเธชเธดเธ—เธเธดเน...</div>;
  }

  // 5. เธ–เนเธฒเนเธกเนเธกเธตเธชเธดเธ—เธเธดเน -> เน€เธ”เนเธเธเธฅเธฑเธ
  if (!isAuthenticated) {
    window.location.replace(LOGIN_HUB_URL);
    return null;
  }

  // 6. เธ–เนเธฒเธกเธตเธชเธดเธ—เธเธดเน -> เนเธชเธ”เธ Layout
  return (
    <div className="staff-layout">
      {/* (Sidebar เธเธฐเธเนเธญเธเธญเธขเธนเน เนเธฅเธฐเน€เธเธดเธ”/เธเธดเธ”เธ”เนเธงเธข State) */}
      <StaffSidebar 
        isOpen={isSidebarOpen} 
        onLogout={handleLogout}
        onClose={toggleSidebar} // (เธเธ”เธ—เธตเน Link เนเธ Sidebar เน€เธเธทเนเธญเธเธดเธ”)
      />
      
      {/* (เธเธตเนเธเธทเธญเธ—เธตเนเธ—เธตเนเธซเธเนเธฒ TableSelect, Order, Bill เธเธฐเธกเธฒเนเธชเธ”เธ) */}
      <div className="staff-content">
        <Outlet context={{ toggleSidebar }} /> {/* ๐‘ (เธชเนเธเธเธฑเธเธเนเธเธฑเธ toggle เนเธซเนเธฅเธนเธ) */}
      </div>
    </div>
  );
};

export default StaffLayout;

