import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_HUB_URL = 'http://localhost:5173'; // Port ประตูหน้า

// หน้านี้มีหน้าที่เดียว:
// 1. อ่าน Token/Role จาก URL
// 2. บันทึกลง localStorage
// 3. พาไปหน้า Dashboard (/)

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. อ่านค่าจาก URL
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // 2. ตรวจสอบว่าใช่ Admin หรือไม่
    if (token && role === 'Admin') {
      // 3. บันทึกลง localStorage (ตอนนี้ปลอดภัยแล้ว)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // 4. พาไปหน้า Dashboard
      navigate('/', { replace: true });
    } else {
      // ถ้าไม่ใช่ Admin ให้ล้างค่าและเด้งกลับ
      localStorage.clear();
      window.location.replace(LOGIN_HUB_URL);
    }
  }, [searchParams, navigate]);

  return (
    <div>กำลังตรวจสอบสิทธิ์...</div>
  );
}

export default AuthCallback;