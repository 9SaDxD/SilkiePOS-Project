import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_HUB_URL = 'https://silkie-login.vercel.app'; // โ€ผ๏ธ Port เธเธญเธ frontend-login

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. เธญเนเธฒเธ Token/Role เธเธฒเธ URL
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // 2. เธ•เธฃเธงเธเธชเธญเธเธงเนเธฒเนเธเน Staff เธซเธฃเธทเธญ Admin เธซเธฃเธทเธญเนเธกเน
    if (token && (role === 'Staff' || role === 'Admin')) {
      // 3. เธเธฑเธเธ—เธถเธเธฅเธ localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // 4. เธเธฒเนเธเธซเธเนเธฒเธซเธฅเธฑเธ (/) (เธเธถเนเธเธเนเธเธทเธญเธซเธเนเธฒเน€เธฅเธทเธญเธเนเธ•เนเธฐ)
      navigate('/', { replace: true });
    } else {
      // 5. เธ–เนเธฒเนเธกเนเนเธเน เน€เธ”เนเธเธเธฅเธฑเธ
      localStorage.clear();
      window.location.replace(LOGIN_HUB_URL);
    }
  }, [searchParams, navigate]);

  return (
    <div>เธเธณเธฅเธฑเธเธ•เธฃเธงเธเธชเธญเธเธชเธดเธ—เธเธดเน...</div>
  );
}

export default AuthCallback;

