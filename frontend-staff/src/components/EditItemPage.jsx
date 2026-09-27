import React, { useState } from 'react';
import './EditItemPage.css'; 

const AVAILABLE_NOTES = [
    'เนเธกเนเน€เธญเธฒเธเธฑเธ',
    'เนเธกเนเน€เธญเธฒเน€เธเธฒ',
    'เนเธกเนเน€เธญเธฒเธซเธกเธน',
    'เนเธกเนเน€เธญเธฒเนเธเน',
    'เนเธกเนเน€เธญเธฒเนเธเน'
];

function EditItemPage({ item, cartItem, onClose, onSave, onDelete }) {
    
    const [tempQty, setTempQty] = useState(cartItem.quantity);
    const [tempNotes, setTempNotes] = useState(cartItem.notes || []);
    // --- ๐‘ (เนเธซเธกเน) 1. State เธชเธณเธซเธฃเธฑเธ Comment ---
    const [tempComment, setTempComment] = useState(cartItem.comment || '');

    const handleNoteToggle = (note) => {
        if (tempNotes.includes(note)) {
            setTempNotes(tempNotes.filter(n => n !== note));
        } else {
            setTempNotes([...tempNotes, note]);
        }
    };
    
    // --- ๐‘ (เนเธเนเนเธ) 2. เธชเนเธ tempComment เธเธฅเธฑเธเนเธ ---
    const handleSave = () => {
        onSave(item.menuId, tempQty, tempNotes, tempComment);
    };

    const handleDelete = () => {
        if (window.confirm(`เธเธธเธ“เธ•เนเธญเธเธเธฒเธฃเธฅเธ ${item.name} เธญเธญเธเธเธฒเธเธญเธญเน€เธ”เธญเธฃเนเนเธเนเธซเธฃเธทเธญเนเธกเน?`)) {
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
                    เธเธฑเธเธ—เธถเธ
                </button>
            </header>

            <main className="edit-body">
                {/* 1. เธชเนเธงเธเธเธณเธเธงเธ */}
                <div className="edit-section quantity-section">
                    <label>เธเธณเธเธงเธ</label>
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

                {/* 2. เธชเนเธงเธ Checkbox */}
                <div className="edit-section notes-section">
                    <label>เธชเธดเนเธเธ—เธตเนเนเธกเนเธ•เนเธญเธเธเธฒเธฃ</label>
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

                {/* --- ๐‘ (เนเธซเธกเน) 3. เธชเนเธงเธ Comment --- */}
                <div className="edit-section comment-section">
                    <label>เธเธญเธกเน€เธกเธเธ—เน</label>
                    <textarea
                        className="comment-textarea"
                        placeholder="เน€เธเนเธ เน€เธเธดเนเธกเนเธเน, เนเธกเนเน€เธเนเธ”..."
                        value={tempComment}
                        onChange={(e) => setTempComment(e.target.value)}
                    />
                </div>
            </main>

            <footer className="edit-footer">
                <button className="delete-menu-btn" onClick={handleDelete}>
                    เธฅเธเน€เธกเธเธน
                </button>
            </footer>
        </div>
    );
}

export default EditItemPage;

