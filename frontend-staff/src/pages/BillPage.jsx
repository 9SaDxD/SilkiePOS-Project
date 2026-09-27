import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'; // (เนเธเนเนเธ) เน€เธเธดเนเธก useOutletContext
import { SwipeableList, SwipeableListItem, SwipeAction } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css'; 
import './BillPage.css';

function BillPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    // (เนเธเนเนเธ) เน€เธฃเธฒเธ•เนเธญเธเธ”เธถเธ toggleSidebar เธกเธฒ เนเธกเนเธเธฐเนเธกเนเนเธ”เนเนเธเน (เน€เธเธฃเธฒเธฐเธซเธเนเธฒเธเธตเนเนเธกเนเธกเธต Hamburger)
    // เน€เธเธทเนเธญเธเนเธญเธเธเธฑเธ Error "useOutletContext is not defined" เนเธเธซเธเนเธฒเธญเธทเนเธ
    // **เธญเธฑเธเน€เธ”เธ•:** เน€เธฃเธฒเธเธฐเธฅเธ useOutletContext เธญเธญเธเธเธฒเธเธซเธเนเธฒเธเธตเน
    
    const [loading, setLoading] = useState(true);
    const [billData, setBillData] = useState(null);

    const fetchBill = useCallback(async () => {
        if (!tableId) return;
        setLoading(true);
        try {
            const res = await axios.get("https://silkiepos-project.onrender.com/api/staff/tables/${tableId}/bill`);
            setBillData(res.data);
        } catch (err) {
            console.error("Error fetching bill", err);
            if (err.response && err.response.status === 404) {
                 navigate(`/order/${tableId}`);
            } else {
                alert("เนเธกเนเธเธเธเธดเธฅเธ—เธตเนเนเธเนเธเธฒเธเธญเธขเธนเน");
                navigate('/'); 
            }
        } finally {
            setLoading(false);
        }
    }, [tableId, navigate]);

    useEffect(() => {
        fetchBill();
    }, [fetchBill]);

    const handleDeleteItem = async (itemId, itemName) => {
        if (!window.confirm(`เธเธธเธ“เธ•เนเธญเธเธเธฒเธฃเธขเธเน€เธฅเธดเธ "${itemName}" เนเธเนเธซเธฃเธทเธญเนเธกเน?`)) {
            return;
        }
        try {
            setLoading(true);
            await axios.delete("https://silkiepos-project.onrender.com/api/staff/orders/item/${itemId}`);
            fetchBill(); 
        } catch (err) {
            console.log(err.response.data.message);
            console.error("Error deleting item", err);
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes('already completed')) {
                    alert('เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธขเธเน€เธฅเธดเธเธฃเธฒเธขเธเธฒเธฃเธ—เธตเนเน€เธชเธฃเนเธเธชเธกเธเธนเธฃเธ“เนเนเธฅเนเธงเนเธ”เน');
                    setLoading(false);
                    
                    return;
                }
                alert(`เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธขเธเน€เธฅเธดเธเธฃเธฒเธขเธเธฒเธฃเนเธ”เน: ${err.response.data.message}`);
                setLoading(false);
                return;
            } else {
                alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”เนเธเธเธฒเธฃเธฅเธเธฃเธฒเธขเธเธฒเธฃ: " + err.message);
                setLoading(false);
                return;
            }
        }
    };

    const createTrailingActions = (itemId, itemName) => (
        [
            <SwipeAction
                key={itemId}
                onClick={() => handleDeleteItem(itemId, itemName)}
                destructive={true}
            >
                <div className="swipe-action-delete">
                    ๐—‘๏ธ
                </div>
            </SwipeAction>
        ]
    );

    if (loading || !billData) {
        return <div className="bill-page-container"><div>เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</div></div>;
    }
    
    const { order, items } = billData;

    return (
        <div className="bill-page-container">
            <header className="bill-header">
                {/* (เน€เธฃเธฒเธฅเธเธเธธเนเธก Hamburger เธญเธญเธเนเธฅเนเธง) */}
                <button className="payment-back-btn" onClick={() => navigate('/')}>
                    <i className="arrow-left-payment"></i>
                </button>
                <h1>เธเธดเธฅเนเธ•เนเธฐ {tableId}</h1>
            </header>

            <main className="bill-list">
                <SwipeableList>
                    {items.map(item => (
                        <SwipeableListItem
                            key={item._id}
                            trailingActions={createTrailingActions(item._id, item.menuName)}
                            fullSwipe={false}
                        >
                            <div className="bill-item">
                                <div className="bill-item-details">
                                    <span className="bill-item-name">{item.menuName}</span>
                                    <span className="bill-item-qty">x{item.quantity}</span>
                                    {item.note && (
                                        <span className="bill-item-notes">
                                            {`-${item.note}`}
                                        </span>
                                    )}
                                </div>
                                <span className="bill-item-price">{(item.price).toFixed(2)} B</span>
                            </div>
                        </SwipeableListItem>
                    ))}
                </SwipeableList>
            </main>

            <footer className="bill-total-section">
                <div className="bill-total-row">
                    <span>เธฃเธฒเธเธฒเธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span>
                    <span>{(order.totalAmount).toFixed(2)} B</span>
                </div>
            </footer>

            {/* --- ๐‘ (เนเธเนเนเธ) --- */}
            <footer className="bill-footer">
                <button 
                    className="bill-action-btn order-more-btn"
                    onClick={() => navigate(`/order/${tableId}`)}
                >
                    เธชเธฑเนเธเธญเธฒเธซเธฒเธฃเน€เธเธดเนเธก
                </button>
                <button 
                    className="bill-action-btn payment-btn"
                    onClick={() => navigate(`/payment/${tableId}`)} // ๐‘ เนเธเธซเธเนเธฒเน€เธฅเธทเธญเธเธงเธดเธเธตเธเนเธฒเธขเน€เธเธดเธ
                >
                    เธเธณเธฃเธฐเน€เธเธดเธ
                </button>
            </footer>
        </div>
    );
}

export default BillPage;


