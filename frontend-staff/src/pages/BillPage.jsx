import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'; // (แก้ไข) เพิ่ม useOutletContext
import { SwipeableList, SwipeableListItem, SwipeAction } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css'; 
import './BillPage.css';

function BillPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    // (แก้ไข) เราต้องดึง toggleSidebar มา แม้จะไม่ได้ใช้ (เพราะหน้านี้ไม่มี Hamburger)
    // เพื่อป้องกัน Error "useOutletContext is not defined" ในหน้าอื่น
    // **อัปเดต:** เราจะลบ useOutletContext ออกจากหน้านี้
    
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
                alert("ไม่พบบิลที่ใช้งานอยู่");
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
        if (!window.confirm(`คุณต้องการยกเลิก "${itemName}" ใช่หรือไม่?`)) {
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
                    alert('ไม่สามารถยกเลิกรายการที่เสร็จสมบูรณ์แล้วได้');
                    setLoading(false);
                    
                    return;
                }
                alert(`ไม่สามารถยกเลิกรายการได้: ${err.response.data.message}`);
                setLoading(false);
                return;
            } else {
                alert("เกิดข้อผิดพลาดในการลบรายการ: " + err.message);
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
                    🗑️
                </div>
            </SwipeAction>
        ]
    );

    if (loading || !billData) {
        return <div className="bill-page-container"><div>กำลังโหลด...</div></div>;
    }
    
    const { order, items } = billData;

    return (
        <div className="bill-page-container">
            <header className="bill-header">
                {/* (เราลบปุ่ม Hamburger ออกแล้ว) */}
                <button className="payment-back-btn" onClick={() => navigate('/')}>
                    <i className="arrow-left-payment"></i>
                </button>
                <h1>บิลโต๊ะ {tableId}</h1>
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
                    <span>ราคารวมทั้งหมด</span>
                    <span>{(order.totalAmount).toFixed(2)} B</span>
                </div>
            </footer>

            {/* --- 👇 (แก้ไข) --- */}
            <footer className="bill-footer">
                <button 
                    className="bill-action-btn order-more-btn"
                    onClick={() => navigate(`/order/${tableId}`)}
                >
                    สั่งอาหารเพิ่ม
                </button>
                <button 
                    className="bill-action-btn payment-btn"
                    onClick={() => navigate(`/payment/${tableId}`)} // 👈 ไปหน้าเลือกวิธีจ่ายเงิน
                >
                    ชำระเงิน
                </button>
            </footer>
        </div>
    );
}

export default BillPage;


