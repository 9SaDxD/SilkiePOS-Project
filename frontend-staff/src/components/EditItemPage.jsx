import React, { useState } from 'react';
import './EditItemPage.css'; 

const AVAILABLE_NOTES = [
    'ไม่เอาผัก',
    'ไม่เอาเงา',
    'ไม่เอาหมู',
    'ไม่เอาไก่',
    'ไม่เอาไข่'
];

function EditItemPage({ item, cartItem, onClose, onSave, onDelete }) {
    
    const [tempQty, setTempQty] = useState(cartItem.quantity);
    const [tempNotes, setTempNotes] = useState(cartItem.notes || []);
    // --- 👇 (ใหม่) 1. State สำหรับ Comment ---
    const [tempComment, setTempComment] = useState(cartItem.comment || '');

    const handleNoteToggle = (note) => {
        if (tempNotes.includes(note)) {
            setTempNotes(tempNotes.filter(n => n !== note));
        } else {
            setTempNotes([...tempNotes, note]);
        }
    };
    
    // --- 👇 (แก้ไข) 2. ส่ง tempComment กลับไป ---
    const handleSave = () => {
        onSave(item.menuId, tempQty, tempNotes, tempComment);
    };

    const handleDelete = () => {
        if (window.confirm(`คุณต้องการลบ ${item.name} ออกจากออเดอร์ใช่หรือไม่?`)) {
            onDelete(item.menuId);
        }
    };

    return (
        <div className="order-page-container edit-page">
            
            <header className="edit-header">
                <button className="back-btn" onClick={onClose}>
                    <i className="arrow-left"></i>
                </button>
                <h1>{item.name}</h1>
                <button className="save-btn" onClick={handleSave}>
                    บันทึก
                </button>
            </header>

            <main className="edit-body">
                {/* 1. ส่วนจำนวน */}
                <div className="edit-section quantity-section">
                    <label>จำนวน</label>
                    <div className="quantity-control-edit">
                        <button className="quantity-btn-edit" onClick={() => setTempQty(q => q > 1 ? q - 1 : 1)}>-</button>
                        <input 
                            type="number" 
                            className="quantity-input-edit" 
                            value={tempQty}
                            onChange={(e) => setTempQty(Number(e.target.value) || 1)}
                        />
                        <button className="quantity-btn-edit" onClick={() => setTempQty(q => q + 1)}>+</button>
                    </div>
                </div>

                {/* 2. ส่วน Checkbox */}
                <div className="edit-section notes-section">
                    <label>สิ่งที่ไม่ต้องการ</label>
                    <div className="notes-list">
                        {AVAILABLE_NOTES.map(note => (
                            <label key={note} className="note-option">
                                <input 
                                    type="checkbox"
                                    checked={tempNotes.includes(note)}
                                    onChange={() => handleNoteToggle(note)}
                                />
                                <span className="checkbox-custom"></span>
                                {note}
                            </label>
                        ))}
                    </div>
                </div>

                {/* --- 👇 (ใหม่) 3. ส่วน Comment --- */}
                <div className="edit-section comment-section">
                    <label>คอมเมนท์</label>
                    <textarea
                        className="comment-textarea"
                        placeholder="เช่น เพิ่มไข่, ไม่เผ็ด..."
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                    />
                </div>
            </main>

            <footer className="edit-footer">
                <button className="delete-menu-btn" onClick={handleDelete}>
                    ลบเมนู
                </button>
            </footer>
        </div>
    );
}

export default EditItemPage;