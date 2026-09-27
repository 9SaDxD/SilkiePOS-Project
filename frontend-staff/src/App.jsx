import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// 1. Import หน้าทั้งหมด
import TableSelectPage from './pages/TableSelectPage';
import OrderPage from './pages/OrderPage';
import BillPage from './pages/BillPage';
import AuthCallback from './pages/AuthCallback';
import StaffLayout from './layouts/StaffLayout';
import PaymentPage from './pages/PaymentPage';
import BillHistoryPage from './pages/BillHistoryPage';
import BillDetailPage from './pages/BillDetailPage'; // 👈 (ใหม่)

const LOGIN_HUB_URL = 'https://csi400-login.vercel.app';

// (Axios Interceptor - เหมือนเดิม)
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

// (ProtectedRoute - เหมือนเดิม)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  if (token && (userRole === 'Staff' || userRole === 'Admin')) {
    return children;
  }
  window.location.replace(LOGIN_HUB_URL);
  return null;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth-callback" element={<AuthCallback />} />
        <Route path="/login" element={<Navigate to={LOGIN_HUB_URL} replace />} />

        {/* Layout หลักที่ป้องกันไว้ */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          {/* หน้าลูก (Children) */}
          <Route index element={<TableSelectPage />} /> 
          <Route path="order/:tableId" element={<OrderPage />} />
          <Route path="bill/:tableId" element={<BillPage />} />
          <Route path="payment/:tableId" element={<PaymentPage />} />
          <Route path="history" element={<BillHistoryPage />} />
          <Route path="history/:orderId" element={<BillDetailPage />} /> {/* 👈 (ใหม่) */}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


