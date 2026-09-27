import React from 'react';
import { SwipeableList, SwipeableListItem, SwipeAction } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css'; 
import './OrderSummary.css';

// (เนเธเนเนเธ) 1. เธฃเธฑเธ onEditItem
function OrderSummary({ items, totalPrice, onClose, onConfirm, onDeleteItem, onEditItem }) {
    
    const createTrailingActions = (itemId) => (
        [
            <SwipeAction
                key={itemId}
                onClick={() => onDeleteItem(itemId)}
                destructive={true}
            >
                <div className="swipe-action-delete">๐—‘๏ธ</div>
            </SwipeAction>
        ]
    );

    return (
        <div className="order-page-container summary-page">
            
            <header className="summary-header">
                <button className="back-btn" onClick={onClose}> <i className="arrow-left"></i> </button>
                <h1>เธญเธญเน€เธ”เธญเธฃเน</h1>
            </header>

            <main className="summary-list">
                <SwipeableList>
                    {items.map(item => (
                        <SwipeableListItem
                            key={item.id}
                            trailingActions={createTrailingActions(item.id)}
                            fullSwipe={false}
                        >
                            {/* (เนเธเนเนเธ) 2. เน€เธเธดเนเธก onClick เธ—เธตเนเธเธตเน */}
                            <div className="summary-item clickable" onClick={() => onEditItem(item.id)}>
                                <span className="item-icon">&#9998;</span>
                                <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">x{item.quantity}</span>
                                    {/* (เนเธซเธกเน) 3. เนเธชเธ”เธ notes (เธ–เนเธฒเธกเธต) */}
                                    {item.notes && item.notes.length > 0 && (
                                        <span className="item-notes">
                                            {item.notes.map(note => `-${note}`).join(' ')}
                                        </span>
                                    )}
                                </div>
                                <span className="item-price">{item.price.toFixed(2)} B</span>
                            </div>
                        </SwipeableListItem>
                    ))}
                </SwipeableList>
            </main>

            <footer className="summary-total-section">
                <div className="total-row">
                    <span>เธฃเธฒเธเธฒเธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span>
                    <span>{totalPrice.toFixed(2)} B</span>
                </div>
            </footer>

            <footer className="order-footer">
                <button className="submit-order-btn confirm-btn" onClick={onConfirm}>
                    เธขเธทเธเธขเธฑเธเธญเธญเน€เธ”เธญเธฃเน
                </button>
            </footer>
        </div>
    );
}

export default OrderSummary;

