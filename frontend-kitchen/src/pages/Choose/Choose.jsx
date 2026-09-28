import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Choose.css'; //

// (ใหม่) 1. URL ของประตูหน้า (Login Hub)
const LOGIN_HUB_URL = 'https://csi400-login.vercel.app'; 

const Choose = () => {
  const navigate = useNavigate();

  // (เดิม) ฟังก์ชันสำหรับเลือกครัว
  const handleChoose = (kitchenType) => {
    navigate(`/${kitchenType}`); // (แก้ไข) ไปที่ /ramen หรือ /fry
  };

  // (ใหม่) 2. ฟังก์ชัน Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(LOGIN_HUB_URL);
  };

  return (
    <div className="choose-container">
      <h1 className="choose-title">Choose Kitchen</h1>
      <div className="button-row">
        <button className="btn ramen" onClick={() => handleChoose("ramen")}>
          ครัวราเมง
          <img src="/img/noodle_8316459.png" alt="ramen image" />
        </button>
        <button className="btn fry" onClick={() => handleChoose("fry")}>
          ครัวทอด
          <img src="/img/frying-pan.png" alt="fry image" />
        </button>
      </div>

      {/* (ใหม่) 3. ส่วนของปุ่ม Logout */}
      <div className="logout-section">
        <button className="btn logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Choose;

