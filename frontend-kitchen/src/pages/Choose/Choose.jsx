import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Choose.css'; //

// (เนเธซเธกเน) 1. URL เธเธญเธเธเธฃเธฐเธ•เธนเธซเธเนเธฒ (Login Hub)
const LOGIN_HUB_URL = 'https://silkie-login.vercel.app'; 

const Choose = () => {
  const navigate = useNavigate();

  // (เน€เธ”เธดเธก) เธเธฑเธเธเนเธเธฑเธเธชเธณเธซเธฃเธฑเธเน€เธฅเธทเธญเธเธเธฃเธฑเธง
  const handleChoose = (kitchenType) => {
    navigate(`/${kitchenType}`); // (เนเธเนเนเธ) เนเธเธ—เธตเน /ramen เธซเธฃเธทเธญ /fry
  };

  // (เนเธซเธกเน) 2. เธเธฑเธเธเนเธเธฑเธ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.replace(LOGIN_HUB_URL);
  };

  return (
    <div className="choose-container">
      <h1 className="choose-title">Choose Kitchen</h1>
      <div className="button-row">
        <button className="btn ramen" onClick={() => handleChoose("ramen")}>
          เธเธฃเธฑเธงเธฃเธฒเน€เธกเธ
          <img src="/img/noodle_8316459.png" alt="ramen image" />
        </button>
        <button className="btn fry" onClick={() => handleChoose("fry")}>
          เธเธฃเธฑเธงเธ—เธญเธ”
          <img src="/img/frying-pan.png" alt="fry image" />
        </button>
      </div>

      {/* (เนเธซเธกเน) 3. เธชเนเธงเธเธเธญเธเธเธธเนเธก Logout */}
      <div className="logout-section">
        <button className="btn logout" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Choose;

