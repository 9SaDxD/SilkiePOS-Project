import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// (เนเธซเธกเน) เธซเธเนเธฒเธเธตเนเธกเธตเธซเธเนเธฒเธ—เธตเนเน€เธ”เธตเธขเธง:
// 1. เธญเนเธฒเธ Token/Role เธเธฒเธ URL
// 2. เธเธฑเธเธ—เธถเธเธฅเธ localStorage
// 3. เธเธฒเนเธเธซเธเนเธฒ Dashboard (/)

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. เธญเนเธฒเธเธเนเธฒเธเธฒเธ URL
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // 2. เธ•เธฃเธงเธเธชเธญเธเธงเนเธฒเนเธเน Admin เธซเธฃเธทเธญเนเธกเน
    if (token && role === 'Admin') {
      // 3. เธเธฑเธเธ—เธถเธเธฅเธ localStorage (เธ•เธญเธเธเธตเนเธเธฅเธญเธ”เธ เธฑเธขเนเธฅเนเธง เน€เธเธฃเธฒเธฐเน€เธฃเธฒเธญเธขเธนเนเนเธ Port 5176)
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // 4. เธเธฒเนเธเธซเธเนเธฒ Dashboard
      navigate('/', { replace: true });
    } else {
      // เธ–เนเธฒเนเธกเนเนเธเน Admin เนเธซเนเธฅเนเธฒเธเธเนเธฒเนเธฅเธฐเน€เธ”เนเธเธเธฅเธฑเธ
      localStorage.clear();
      window.location.replace('https://silkie-login.vercel.app'); // เธเธฅเธฑเธเนเธ Login Hub
    }
  }, [searchParams, navigate]);

  return (
    <div>เธเธณเธฅเธฑเธเธ•เธฃเธงเธเธชเธญเธเธชเธดเธ—เธเธดเน...</div>
  );
}

export default AuthCallback;

