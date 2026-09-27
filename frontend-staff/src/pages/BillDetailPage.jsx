import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BillDetailPage.css'; // (เน€เธฃเธฒเธเธฐเธชเธฃเนเธฒเธเนเธเธฅเนเธเธตเน)

function BillDetailPage() {
    const { orderId } = useParams(); // เธญเนเธฒเธ orderId เธเธฒเธ URL
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [billDetails, setBillDetails] = useState(null); // { order: {...}, items: [...] }

    // 1. เธ”เธถเธเธเนเธญเธกเธนเธฅเธเธดเธฅ (เนเธ”เธขเนเธเน API เธ—เธตเนเธกเธตเธญเธขเธนเน)
    const fetchBillDetails = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            // (เน€เธฃเธตเธขเธ API เน€เธ”เธดเธกเธ—เธตเนเนเธเนเนเธเธซเธเนเธฒ OrderSummary)
            const res = await axios.get("https://silkiepos-project.onrender.com/api/staff/orders/${orderId}`);
            setBillDetails(res.data);
        } catch (err) {
            console.error("Error fetching bill details", err);
            alert("เนเธกเนเธเธเธเนเธญเธกเธนเธฅเธเธดเธฅ");
            navigate('/history'); // เน€เธ”เนเธเธเธฅเธฑเธเธซเธเนเธฒเธเธฃเธฐเธงเธฑเธ•เธด
        } finally {
            setLoading(false);
        }
    }, [orderId, navigate]);

    useEffect(() => {
        fetchBillDetails();
    }, [fetchBillDetails]);

    if (loading || !billDetails) {
        return <div className="detail-page-container"><div>เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</div></div>;
    }
    
    const { order, items } = billDetails;

    return (
        <div className="detail-page-container">
            <header className="detail-header">
                <button className="detail-back-btn" onClick={() => navigate('/history')}>
                    <i className="arrow-left-detail"></i>
                </button>
                <h1>เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธดเธฅ (เนเธ•เนเธฐ {order.tableId})</h1>
            </header>

            {/* (เน€เธฃเธฒเนเธเน CSS/Class เน€เธ”เธตเธขเธงเธเธฑเธเธซเธเนเธฒ BillPage) */}
            <main className="bill-list">
                {items.map(item => (
                    <div key={item._id} className="bill-item">
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
                ))}
            </main>

            <footer className="bill-total-section">
                <div className="bill-total-row">
                    <span>เธฃเธฒเธเธฒเธฃเธงเธกเธ—เธฑเนเธเธซเธกเธ”</span>
                    <span>{(order.totalAmount).toFixed(2)} B</span>
                </div>
            </footer>

            {/* (เธซเธเนเธฒเธเธตเนเนเธกเนเธกเธตเธเธธเนเธกเธเนเธฒเธขเน€เธเธดเธ) */}
        </div>
    );
}

export default BillDetailPage;


