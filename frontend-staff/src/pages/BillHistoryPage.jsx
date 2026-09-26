import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom'; // 👈 (ใหม่) Import useNavigate
import './BillHistoryPage.css';

function BillHistoryPage() {
    const { toggleSidebar } = useOutletContext();
    const navigate = useNavigate(); // 👈 (ใหม่)
    
    const [loading, setLoading] = useState(true);
    const [paidOrders, setPaidOrders] = useState([]);

    const fetchHistory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:3000/api/staff/history/paid-orders');
            setPaidOrders(res.data);
        } catch (err) {
            console.error("Error fetching bill history", err);
            alert("ไม่สามารถดึงประวัติบิลได้");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // (ใหม่) ฟังก์ชันเมื่อคลิกดูรายละเอียด
    const handleViewDetail = (orderId) => {
        navigate(`/history/${orderId}`);
    };

    return (
        <div className="history-page-container">
            <header className="history-header">
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    ☰
                </button>
                <h1>ประวัติบิล (วันนี้)</h1>
                <div className="header-placeholder"></div>
            </header>

            <main className="history-list">
                {loading && <div>กำลังโหลด...</div>}
                {!loading && paidOrders.length === 0 && (
                    <div className="no-history">ยังไม่มีบิลที่จ่ายแล้วสำหรับวันนี้</div>
                )}
                
                {paidOrders.map(order => (
                    // --- 👇 (แก้ไข) ---
                    <div 
                        className="history-card clickable" // (เพิ่ม class clickable)
                        key={order._id}
                        onClick={() => handleViewDetail(order._id)} // (เพิ่ม onClick)
                    >
                    {/* ----------------- */}
                        <div className="history-card-header">
                            <span>โต๊ะ: {order.tableId}</span>
                            <span>{new Date(order.createdAt).toLocaleTimeString('th-TH')}</span>
                        </div>
                        <div className="history-card-body">
                            <span className="history-total">
                                {order.totalAmount.toFixed(2)} ฿
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