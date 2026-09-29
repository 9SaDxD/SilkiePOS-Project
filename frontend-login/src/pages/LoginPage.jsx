import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css'; //

// (URL Port ของแอปต่างๆ - เหมือนเดิม)
const APP_URLS = {
    Admin: 'https://silkie-pos-admin.vercel.app',
    Staff: 'https://silkie-pos-staff.vercel.app',
    Kitchen: 'https://silkie-pos-kitchen.vercel.app'
};

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password) {
            setError('กรุณากรอกข้อมูล');
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
                // --- 👇 (แก้ไข) ---
                // เราจะไม่บันทึกลง localStorage ที่นี่
                // แต่จะส่ง Token และ Role ไปใน URL แทน
                
                // (สร้าง URL ใหม่ เช่น: http://localhost:5176/auth-callback?token=...&role=Admin)
                const authUrl = `${targetAppUrl}/auth-callback?token=${token}&role=${user.role}&username=${user.username}`;
                
                // สั่ง Browser ให้ย้ายไปที่ URL ใหม่
                window.location.replace(authUrl);
                
            } else {
                setError('ไม่พบ Role ที่ถูกต้อง หรือไม่ได้รับอนุญาต');
            }

        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
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
                        เข้าสู่ระบบ
                    </button>
                                        <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
                        <p><strong>�ѭ������Ѻ���ͺ:</strong></p>
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


