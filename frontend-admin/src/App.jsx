import React from 'react'; // (เธฅเธ useState, useEffect เธญเธญเธ)
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';

// 1. Import Components เนเธฅเธฐ Pages
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SalesMenu from "./pages/SalesMenu";
import EditMenu from "./pages/EditMenu";
import Staff from "./pages/Staff";
import Tables from "./pages/Tables";
// (เน€เธฃเธฒเธฅเธ Topping เธเธฑเธ AddDrink เธญเธญเธเนเธเนเธฅเนเธง)
import AuthCallback from "./pages/AuthCallback"; // ๐‘ (เนเธซเธกเน) Import เธซเธเนเธฒ AuthCallback
import "./App.css"; //

// 2. URL เธเธญเธเธเธฃเธฐเธ•เธนเธซเธเนเธฒ (Login Hub)
const LOGIN_HUB_URL = 'https://silkie-login.vercel.app';

// 3. Axios Interceptor (เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
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

// 4. (เนเธซเธกเน) เธชเธฃเนเธฒเธ ProtectedRoute
// เธกเธฑเธเธเธฐเธ—เธณเธซเธเนเธฒเธ—เธตเน "เธเนเธญเธเธเธฑเธ" เธ—เธธเธเธซเธเนเธฒ
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (token && userRole === 'Admin') {
    // 5. เธ–เนเธฒเธกเธตเธชเธดเธ—เธเธดเน -> เนเธชเธ”เธ Sidebar + เธซเธเนเธฒเธ—เธตเนเธเธญ
    return (
      <div className="main-layout">
        <Sidebar onLogout={handleLogout} /> 
        <div className="main-content">
          {children}
        </div>
      </div>
    );
  }

  // 6. เธ–เนเธฒเนเธกเนเธกเธตเธชเธดเธ—เธเธดเน -> เน€เธ”เนเธเธเธฅเธฑเธเนเธ Login Hub
  window.location.replace(LOGIN_HUB_URL);
  return null;
};

// 7. (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธ Logout
const handleLogout = () => {
  localStorage.clear();
  window.location.replace(LOGIN_HUB_URL); 
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 8. (เนเธซเธกเน) เธซเธเนเธฒเธชเธณเธซเธฃเธฑเธเธฃเธฑเธ Token */}
        <Route path="/auth-callback" element={<AuthCallback />} />

        {/* 9. (เนเธซเธกเน) เธซเธเนเธฒเธชเธณเธซเธฃเธฑเธ Login (เธชเธณเธฃเธญเธ) */}
        <Route path="/login" element={<Navigate to={LOGIN_HUB_URL} replace />} />

        {/* 10. (เนเธซเธกเน) เนเธเน ProtectedRoute เธซเธธเนเธกเธ—เธธเธเธซเธเนเธฒ */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sales-menu" element={<ProtectedRoute><SalesMenu /></ProtectedRoute>} />
        <Route path="/edit-menu" element={<ProtectedRoute><EditMenu /></ProtectedRoute>} />
        <Route path="/tables" element={<ProtectedRoute><Tables /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute><Staff /></ProtectedRoute>} />
        
        {/* 11. (เนเธซเธกเน) เธ–เนเธฒเน€เธเนเธฒเธกเธฑเนเธง เนเธซเนเน€เธ”เนเธเนเธเธซเธเนเธฒเธซเธฅเธฑเธ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


