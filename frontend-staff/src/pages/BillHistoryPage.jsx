import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom'; // ๐‘ (เนเธซเธกเน) Import useNavigate
import './BillHistoryPage.css';

function BillHistoryPage() {
    const { toggleSidebar } = useOutletContext();
    const navigate = useNavigate(); // ๐‘ (เนเธซเธกเน)
    
    const [loading, setLoading] = useState(true);
    const [paidOrders, setPaidOrders] = useState([]);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('https://silkiepos-project.onrender.com/api/staff/history/paid-orders');
            setPaidOrders(res.data);
        } catch (err) {
            console.error("Error fetching bill history", err);
            alert("เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธ”เธถเธเธเธฃเธฐเธงเธฑเธ•เธดเธเธดเธฅเนเธ”เน");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธเน€เธกเธทเนเธญเธเธฅเธดเธเธ”เธนเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”
    const handleViewDetail = (orderId) => {
        navigate(`/history/${orderId}`);
    };

    return (
        <div className="history-page-container">
            <header className="history-header">
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    โฐ
                </button>
                <h1>เธเธฃเธฐเธงเธฑเธ•เธดเธเธดเธฅ (เธงเธฑเธเธเธตเน)</h1>
                <div className="header-placeholder"></div>
            </header>

            <main className="history-list">
                {loading && <div>เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</div>}
                {!loading && paidOrders.length === 0 && (
                    <div className="no-history">เธขเธฑเธเนเธกเนเธกเธตเธเธดเธฅเธ—เธตเนเธเนเธฒเธขเนเธฅเนเธงเธชเธณเธซเธฃเธฑเธเธงเธฑเธเธเธตเน</div>
                )}
                
                {paidOrders.map(order => (
                    // --- ๐‘ (เนเธเนเนเธ) ---
                    <div 
                        className="history-card clickable" // (เน€เธเธดเนเธก class clickable)
                        key={order._id}
                        onClick={() => handleViewDetail(order._id)} // (เน€เธเธดเนเธก onClick)
                    >
                    {/* ----------------- */}
                        <div className="history-card-header">
                            <span>เนเธ•เนเธฐ: {order.tableId}</span>
                            <span>{new Date(order.createdAt).toLocaleTimeString('th-TH')}</span>
                        </div>
                        <div className="history-card-body">
                            <span className="history-total">
                                {order.totalAmount.toFixed(2)} เธฟ
                            </span>
                            <span 
                                className={`history-method ${order.paymentId?.method.toLowerCase()}`}
                            >
                                {order.paymentId?.method || 'N/A'}
                            </span>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}

export default BillHistoryPage;


