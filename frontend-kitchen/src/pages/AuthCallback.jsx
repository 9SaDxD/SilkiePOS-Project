import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const LOGIN_HUB_URL = 'https://silkie-login.vercel.app';

function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const username = searchParams.get('username');

    // --- ๐‘ (เนเธเนเนเธ) ---
    // (เน€เธเนเธเธงเนเธฒ Role เธเธทเธญ 'Kitchen' เธซเธฃเธทเธญ 'Admin')
    if (token && role && (role === 'Kitchen' || role === 'Admin')) {
      // ------------------
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('username', username);
      
      // (เธชเธณเธเธฑเธ) เธชเนเธเนเธเธซเธเนเธฒ "Choose" เน€เธชเธกเธญ
      navigate('/', { replace: true });

    } else {
      localStorage.clear();
      window.location.replace(LOGIN_HUB_URL);
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      เธเธณเธฅเธฑเธเธ•เธฃเธงเธเธชเธญเธเธชเธดเธ—เธเธดเนเธชเธณเธซเธฃเธฑเธเธเธฃเธฑเธง...
    </div>
  );
}

export default AuthCallback;

