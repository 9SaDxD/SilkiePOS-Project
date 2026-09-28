import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_HUB_URL = 'https://silkie-pos-login.vercel.app/';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // --- 👇 (แก้ไข) ---
    // (เช็คว่า Role คือ 'Kitchen' หรือ 'Admin')
    if (token && role && (role === 'Kitchen' || role === 'Admin')) {
      // ------------------
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // (สำคัญ) ส่งไปหน้า "Choose" เสมอ
      navigate('/', { replace: true });

    } else {
      localStorage.clear();
      window.location.replace(LOGIN_HUB_URL);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      กำลังตรวจสอบสิทธิ์สำหรับครัว...
    </div>
  );
}

export default AuthCallback;

