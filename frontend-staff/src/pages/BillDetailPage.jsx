import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BillDetailPage.css'; // (เราจะสร้างไฟล์นี้)

function BillDetailPage() {
    const { orderId } = useParams(); // อ่าน orderId จาก URL
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [billDetails, setBillDetails] = useState(null); // { order: {...}, items: [...] }

    // 1. ดึงข้อมูลบิล (โดยใช้ API ที่มีอยู่)
    const fetchBillDetails = useCallback(async () => {
        if (!orderId) return;
        setLoading(true);
        try {
            // (เรียก API เดิมที่ใช้ในหน้า OrderSummary)
            const res = await axios.get(`http://localhost:3000/api/staff/orders/${orderId}`);
            setBillDetails(res.data);
        } catch (err) {
            console.error("Error fetching bill details", err);
            alert("ไม่พบข้อมูลบิล");
            navigate('/history'); // เด้งกลับหน้าประวัติ
        } finally {
            setLoading(false);
        }
    }, [orderId, navigate]);

    useEffect(() => {
        fetchBillDetails();
    }, [fetchBillDetails]);

    if (loading || !billDetails) {
        return <div className="detail-page-container"><div>กำลังโหลด...</div></div>;
    }
    
    const { order, items } = billDetails;

    return (
        <div className="detail-page-container">
            <header className="detail-header">
                <button className="detail-back-btn" onClick={() => navigate('/history')}>
                    <i className="arrow-left-detail"></i>
                </button>
                <h1>รายละเอียดบิล (โต๊ะ {order.tableId})</h1>
            </header>

            {/* (เราใช้ CSS/Class เดียวกับหน้า BillPage) */}
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
                    <span>ราคารวมทั้งหมด</span>
                    <span>{(order.totalAmount).toFixed(2)} B</span>
                </div>
            </footer>

            {/* (หน้านี้ไม่มีปุ่มจ่ายเงิน) */}
        </div>
    );
}

export default BillDetailPage;