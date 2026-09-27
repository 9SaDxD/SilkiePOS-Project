import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; //

// (URL Port เธเธญเธเนเธญเธเธ•เนเธฒเธเน - เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
const APP_URLS = {
    Admin: 'https://silkie-admin.vercel.app',
    Staff: 'https://silkie-staff.vercel.app',
    Kitchen: 'https://silkie-kitchen.vercel.app'
};

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅ');
            return;
        }

        try {
            const response = await axios.post('https://silkiepos-project.onrender.com/api/auth/login', {
                username,
                password,
            });
            
            const { token, user } = response.data;
            const targetAppUrl = APP_URLS[user.role];

            if (targetAppUrl) {
                // --- ๐‘ (เนเธเนเนเธ) ---
                // เน€เธฃเธฒเธเธฐเนเธกเนเธเธฑเธเธ—เธถเธเธฅเธ localStorage เธ—เธตเนเธเธตเน
                // เนเธ•เนเธเธฐเธชเนเธ Token เนเธฅเธฐ Role เนเธเนเธ URL เนเธ—เธ
                
                // (เธชเธฃเนเธฒเธ URL เนเธซเธกเน เน€เธเนเธ: http://localhost:5176/auth-callback?token=...&role=Admin)
                const authUrl = `${targetAppUrl}/auth-callback?token=${token}&role=${user.role}&username=${user.username}`;
                
                // เธชเธฑเนเธ Browser เนเธซเนเธขเนเธฒเธขเนเธเธ—เธตเน URL เนเธซเธกเน
                window.location.replace(authUrl);
                
            } else {
                setError('เนเธกเนเธเธ Role เธ—เธตเนเธ–เธนเธเธ•เนเธญเธ เธซเธฃเธทเธญเนเธกเนเนเธ”เนเธฃเธฑเธเธญเธเธธเธเธฒเธ•');
            }

        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'เธเธทเนเธญเธเธนเนเนเธเนเธซเธฃเธทเธญเธฃเธซเธฑเธชเธเนเธฒเธเนเธกเนเธ–เธนเธเธ•เนเธญเธ');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">
                    <img src="/images/logo.png" alt="Silkie Chick Ramen Logo" />
                </div>
                <h2>Sign in</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" className="login-button">
                        เน€เธเนเธฒเธชเธนเนเธฃเธฐเธเธ
                    </button>
                    <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
                        <p><strong>เธเธฑเธเธเธตเธชเธณเธซเธฃเธฑเธเธ—เธ”เธชเธญเธ:</strong></p>
                        <p>Admin: admin / 1234</p>
                        <p>Staff: staff / 1234</p>
                        <p>Kitchen: chef / 1234</p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;


