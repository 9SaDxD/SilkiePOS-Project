import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_HUB_URL = `https://silkie-pos-login.vercel.app/`; // ‼️ Port ของ frontend-login

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. อ่าน Token/Role จาก URL
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // 2. ตรวจสอบว่าใช่ Staff หรือ Admin หรือไม่
    if (token && (role === 'Staff' || role === 'Admin')) {
      // 3. บันทึกลง localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // 4. พาไปหน้าหลัก (/) (ซึ่งก็คือหน้าเลือกโต๊ะ)
      navigate('/', { replace: true });
    } else {
      // 5. ถ้าไม่ใช่ เด้งกลับ
      localStorage.clear();
      window.location.replace(LOGIN_HUB_URL);
    }
  }, [searchParams, navigate]);

  return (
    <div>กำลังตรวจสอบสิทธิ์...</div>
  );
}

export default AuthCallback;

