import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // 👈 (ใหม่) 1. Import QR Code
import './PaymentPage.css'; 

function PaymentPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [billData, setBillData] = useState(null);
    const [showCashInput, setShowCashInput] = useState(false);
    const [amountReceived, setAmountReceived] = useState('');

    // --- 👇 (ใหม่) 2. State สำหรับแสดง QR Code ---
    const [showQR, setShowQR] = useState(false);

    // (ฟังก์ชัน fetchBill - เหมือนเดิม)
    const fetchBill = useCallback(async () => {
        if (!tableId) return;
        setLoading(true);
        try {
            const res = await axios.get("https://silkiepos-project.onrender.com/api/staff/tables/${tableId}/bill`);
            setBillData(res.data);
        } catch (err) {
            console.error("Error fetching bill", err);
            alert("ไม่พบบิลที่ใช้งานอยู่");
            navigate(`/bill/${tableId}`);
        } finally {
            setLoading(false);
        }
    }, [tableId, navigate]);

    useEffect(() => {
        fetchBill();
    }, [fetchBill]);

    // (ฟังก์ชันยิง API - เหมือนเดิม)
    const handleProcessPayment = async (method) => {
        if (!billData || !billData.order) return;
        const paymentData = {
            tableId: tableId,
            method: method,
            amountPaid: billData.order.totalAmount
        };
        try {
            setLoading(true);
            await axios.post('https://silkiepos-project.onrender.com/api/staff/payments', paymentData);
            alert(`ชำระเงินด้วย ${method} สำเร็จ! ปิดโต๊ะ`);
            navigate('/');
        } catch (err) {
            console.log(err.response.data.message);
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes('not yet completed')) {
                    alert('ไม่สามารถชำระเงินได้ เนื่องจากยังมีรายการอาหารที่ยังไม่เสร็จสมบูรณ์');
                    setLoading(false);
                    navigate(`/bill/${tableId}`);
                    return;
                }
                alert(`ชำระเงินไม่สำเร็จ: ${err.response.data.message}`);
                setLoading(false);
                return;
            } else {
                console.error("Error processing payment:", err);
                alert('เกิดข้อผิดพลาดในการชำระเงิน');
                setLoading(false);
                return;
            }
        }
    };

    // --- 👇 (แก้ไข) 3. ฟังก์ชันสำหรับปุ่มหลัก ---
    const handlePaymentClick = (method) => {
        if (method === 'QR') {
            setShowQR(true); // 👈 (แก้ไข) เปิดหน้า QR
        } else if (method === 'Cash') {
            setShowCashInput(true);
        }
    };
    
    const handleConfirmCashPayment = () => {
        handleProcessPayment('Cash');
    };

    const totalAmount = billData ? billData.order.totalAmount : 0;
    const received = parseFloat(amountReceived) || 0;
    const change = received > totalAmount ? received - totalAmount : 0;

    if (loading || !billData) {
        return <div className="payment-page-container"><div>กำลังโหลด...</div></div>;
    }
    
    return (
        <div className="payment-page-container">
            <header className="payment-header">
                <button 
                    className="payment-back-btn" 
                    // (แก้ไข) กดย้อนกลับ
                    onClick={() => {
                        if (showCashInput) setShowCashInput(false);
                        else if (showQR) setShowQR(false); // 👈 (ใหม่)
                        else navigate(`/bill/${tableId}`);
                    }}
                >
                    <i className="arrow-left-payment"></i>
                </button>
                <h1>ชำระเงิน (โต๊ะ {tableId})</h1>
            </header>

            <main className="payment-body">
                <div className="total-summary">
                    <span>ยอดที่ต้องชำระ</span>
                    <span className="total-amount">{totalAmount.toFixed(2)} ฿</span>
                </div>

                {/* --- 👇 (แก้ไข) 4. Logic การแสดงผล 3 แบบ --- */}

                {/* 4.1: หน้าเลือกวิธีจ่าย (Default) */}
                {!showCashInput && !showQR && (
                    <div className="payment-options">
                        <button 
                            className="payment-btn cash-btn"
                            onClick={() => handlePaymentClick('Cash')}
                        >
                            💵 เงินสด (Cash)
                        </button>
                        <button 
                            className="payment-btn qr-btn"
                            onClick={() => handlePaymentClick('QR')}
                        >
                            📱 สแกน QR Code
                        </button>
                    </div>
                )}

                {/* 4.2: หน้าจ่ายเงินสด */}
                {showCashInput && (
                    <div className="cash-payment-section">
                        <label htmlFor="amountReceived">รับเงินมา (บาท):</label>
                        <input
                            type="number"
                            id="amountReceived"
                            className="cash-input"
                            placeholder="ใส่จำนวนเงินที่รับ (ไม่จำเป็น)"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            autoFocus
                        />
                        {received > 0 && (
                            <div className="change-display">
                                <span>เงินทอน:</span>
                                <span className="change-amount">{change.toFixed(2)} ฿</span>
                            </div>
                        )}
                        <button 
                            className="payment-btn cash-btn confirm-cash-btn"
                            onClick={handleConfirmCashPayment}
                        >
                            ยืนยันชำระเงิน (เงินสด)
                        </button>
                    </div>
                )}

                {/* 4.3: (ใหม่) หน้าแสดง QR Code */}
                {showQR && (
                    <div className="qr-payment-section">
                        <label>สแกน QR Code เพื่อชำระเงิน</label>
                        <div className="qr-code-wrapper">
                            {/* (นี่คือ QR Code จำลอง ที่มีข้อมูลยอดเงิน
                               ในโลกจริง คุณจะได้ "String" นี้มาจาก Payment Gateway)
                            */}
                            <QRCodeSVG 
                                value={`PAYMENT_TOTAL:${totalAmount.toFixed(2)}`} 
                                size={256} // ขนาด
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                            />
                        </div>
                        <p>
                            (นี่คือ QR Code จำลองสำหรับโครงการนี้
                            ในระบบจริง ลูกค้าจะสแกนด้วยแอปธนาคาร)
                        </p>
                        <button 
                            className="payment-btn qr-btn confirm-qr-btn"
                            onClick={() => handleProcessPayment('QR')}
                        >
                            (จำลอง) ลูกค้าจ่ายแล้ว
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default PaymentPage;


