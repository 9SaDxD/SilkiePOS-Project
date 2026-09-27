import React from 'react';
import './MenuCard.css';

// --- (ใหม่) 1. กำหนด URL ของ Backend ---
const API_BASE_URL = "https://silkiepos-project.onrender.com"; // ‼️ (Port จาก .env ของ Backend)

// (แก้ไข) รับ props onIncrease, onDecrease
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
            
            {/* --- (แก้ไข) 2. ตรวจสอบ imageUrl และต่อ URL --- */}
            {imageUrl ? (
                // (ถ้ามี imageUrl)
                <img 
                    src={`${API_BASE_URL}/${imageUrl}`} // 👈 (ต่อ URL ให้ถูกต้อง)
                    alt={name} 
                    className="menu-card-image" 
                />
            ) : (
                // (ถ้าไม่มี imageUrl)
                <div className="menu-card-image-placeholder">No Image</div>
            )}
            {/* ------------------------------------------- */}
            
            <div className="menu-card-body">
                <h3 className="menu-card-title">{name}</h3>
                
                {quantity === 0 ? (
                    <p className="menu-card-price">{price} ฿</p>
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


