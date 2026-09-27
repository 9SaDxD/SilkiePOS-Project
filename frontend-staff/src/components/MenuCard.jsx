import React from 'react';
import './MenuCard.css';

// --- (เนเธซเธกเน) 1. เธเธณเธซเธเธ” URL เธเธญเธ Backend ---
const API_BASE_URL = "https://silkiepos-project.onrender.com"; // โ€ผ๏ธ (Port เธเธฒเธ .env เธเธญเธ Backend)

// (เนเธเนเนเธ) เธฃเธฑเธ props onIncrease, onDecrease
function MenuCard({ item, quantity, onIncrease, onDecrease }) {
    const { menuId, name, price, imageUrl } = item;

    const handleIncrease = (e) => {
        e.stopPropagation();
        onIncrease();
    };

    const handleDecrease = (e) => {
        e.stopPropagation();
        onDecrease();
    };

    const handleCardClick = () => {
        onIncrease();
    };

    return (
        <div className="menu-card" onClick={handleCardClick}>
            
            {/* --- (เนเธเนเนเธ) 2. เธ•เธฃเธงเธเธชเธญเธ imageUrl เนเธฅเธฐเธ•เนเธญ URL --- */}
            {imageUrl ? (
                // (เธ–เนเธฒเธกเธต imageUrl)
                <img 
                    src={`${API_BASE_URL}/${imageUrl}`} // ๐‘ (เธ•เนเธญ URL เนเธซเนเธ–เธนเธเธ•เนเธญเธ)
                    alt={name} 
                    className="menu-card-image" 
                />
            ) : (
                // (เธ–เนเธฒเนเธกเนเธกเธต imageUrl)
                <div className="menu-card-image-placeholder">No Image</div>
            )}
            {/* ------------------------------------------- */}
            
            <div className="menu-card-body">
                <h3 className="menu-card-title">{name}</h3>
                
                {quantity === 0 ? (
                    <p className="menu-card-price">{price} เธฟ</p>
                ) : (
                    <div className="quantity-control">
                        <button className="quantity-btn" onClick={handleDecrease}>-</button>
                        <span className="quantity-display">{quantity}</span>
                        <button className="quantity-btn" onClick={handleIncrease}>+</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MenuCard;


