import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Choose from './pages/Choose/Choose.jsx';
import Ramen from './pages/Ramen/Ramen.jsx';
import Fry from './pages/Fry/Fry.jsx';
import AuthCallback from './pages/AuthCallback.jsx';

const LOGIN_HUB_URL = 'https://silkie-login.vercel.app';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // --- 👇 (แก้ไข) ---
  if (token && userRole && (userRole === 'Kitchen' || userRole === 'Admin')) {
  // ------------------
    return children;
  }
  
  window.location.replace(LOGIN_HUB_URL);
  return null;
};

function App() {
  return (
    <Routes>
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/login" element={<Navigate to={LOGIN_HUB_URL} replace />} />
      
      <Route path="/" element={<ProtectedRoute><Choose /></ProtectedRoute>} />
      <Route path="/ramen" element={<ProtectedRoute><Ramen /></ProtectedRoute>} />
      <Route path="/fry" element={<ProtectedRoute><Fry /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


