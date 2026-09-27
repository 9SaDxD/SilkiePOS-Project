import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // ๐‘ (เนเธซเธกเน) 1. Import QR Code
import './PaymentPage.css'; 

function PaymentPage() {
    const { tableId } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [billData, setBillData] = useState(null);
    const [showCashInput, setShowCashInput] = useState(false);
    const [amountReceived, setAmountReceived] = useState('');

    // --- ๐‘ (เนเธซเธกเน) 2. State เธชเธณเธซเธฃเธฑเธเนเธชเธ”เธ QR Code ---
    const [showQR, setShowQR] = useState(false);

    // (เธเธฑเธเธเนเธเธฑเธ fetchBill - เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
    const fetchBill = useCallback(async () => {
        if (!tableId) return;
        setLoading(true);
        try {
            const res = await axios.get("https://silkiepos-project.onrender.com/api/staff/tables/${tableId}/bill`);
            setBillData(res.data);
        } catch (err) {
            console.error("Error fetching bill", err);
            alert("เนเธกเนเธเธเธเธดเธฅเธ—เธตเนเนเธเนเธเธฒเธเธญเธขเธนเน");
            navigate(`/bill/${tableId}`);
        } finally {
            setLoading(false);
        }
    }, [tableId, navigate]);

    useEffect(() => {
        fetchBill();
    }, [fetchBill]);

    // (เธเธฑเธเธเนเธเธฑเธเธขเธดเธ API - เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
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
            alert(`เธเธณเธฃเธฐเน€เธเธดเธเธ”เนเธงเธข ${method} เธชเธณเน€เธฃเนเธ! เธเธดเธ”เนเธ•เนเธฐ`);
            navigate('/');
        } catch (err) {
            console.log(err.response.data.message);
            if (err.response && err.response.data && err.response.data.message) {
                if (err.response.data.message.includes('not yet completed')) {
                    alert('เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธเธณเธฃเธฐเน€เธเธดเธเนเธ”เน เน€เธเธทเนเธญเธเธเธฒเธเธขเธฑเธเธกเธตเธฃเธฒเธขเธเธฒเธฃเธญเธฒเธซเธฒเธฃเธ—เธตเนเธขเธฑเธเนเธกเนเน€เธชเธฃเนเธเธชเธกเธเธนเธฃเธ“เน');
                    setLoading(false);
                    navigate(`/bill/${tableId}`);
                    return;
                }
                alert(`เธเธณเธฃเธฐเน€เธเธดเธเนเธกเนเธชเธณเน€เธฃเนเธ: ${err.response.data.message}`);
                setLoading(false);
                return;
            } else {
                console.error("Error processing payment:", err);
                alert('เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”เนเธเธเธฒเธฃเธเธณเธฃเธฐเน€เธเธดเธ');
                setLoading(false);
                return;
            }
        }
    };

    // --- ๐‘ (เนเธเนเนเธ) 3. เธเธฑเธเธเนเธเธฑเธเธชเธณเธซเธฃเธฑเธเธเธธเนเธกเธซเธฅเธฑเธ ---
    const handlePaymentClick = (method) => {
        if (method === 'QR') {
            setShowQR(true); // ๐‘ (เนเธเนเนเธ) เน€เธเธดเธ”เธซเธเนเธฒ QR
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
        return <div className="payment-page-container"><div>เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</div></div>;
    }
    
    return (
        <div className="payment-page-container">
            <header className="payment-header">
                <button 
                    className="payment-back-btn" 
                    // (เนเธเนเนเธ) เธเธ”เธขเนเธญเธเธเธฅเธฑเธ
                    onClick={() => {
                        if (showCashInput) setShowCashInput(false);
                        else if (showQR) setShowQR(false); // ๐‘ (เนเธซเธกเน)
                        else navigate(`/bill/${tableId}`);
                    }}
                >
                    <i className="arrow-left-payment"></i>
                </button>
                <h1>เธเธณเธฃเธฐเน€เธเธดเธ (เนเธ•เนเธฐ {tableId})</h1>
            </header>

            <main className="payment-body">
                <div className="total-summary">
                    <span>เธขเธญเธ”เธ—เธตเนเธ•เนเธญเธเธเธณเธฃเธฐ</span>
                    <span className="total-amount">{totalAmount.toFixed(2)} เธฟ</span>
                </div>

                {/* --- ๐‘ (เนเธเนเนเธ) 4. Logic เธเธฒเธฃเนเธชเธ”เธเธเธฅ 3 เนเธเธ --- */}

                {/* 4.1: เธซเธเนเธฒเน€เธฅเธทเธญเธเธงเธดเธเธตเธเนเธฒเธข (Default) */}
                {!showCashInput && !showQR && (
                    <div className="payment-options">
                        <button 
                            className="payment-btn cash-btn"
                            onClick={() => handlePaymentClick('Cash')}
                        >
                            ๐’ต เน€เธเธดเธเธชเธ” (Cash)
                        </button>
                        <button 
                            className="payment-btn qr-btn"
                            onClick={() => handlePaymentClick('QR')}
                        >
                            ๐“ฑ เธชเนเธเธ QR Code
                        </button>
                    </div>
                )}

                {/* 4.2: เธซเธเนเธฒเธเนเธฒเธขเน€เธเธดเธเธชเธ” */}
                {showCashInput && (
                    <div className="cash-payment-section">
                        <label htmlFor="amountReceived">เธฃเธฑเธเน€เธเธดเธเธกเธฒ (เธเธฒเธ—):</label>
                        <input
                            type="number"
                            id="amountReceived"
                            className="cash-input"
                            placeholder="เนเธชเนเธเธณเธเธงเธเน€เธเธดเธเธ—เธตเนเธฃเธฑเธ (เนเธกเนเธเธณเน€เธเนเธ)"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            autoFocus
                        />
                        {received > 0 && (
                            <div className="change-display">
                                <span>เน€เธเธดเธเธ—เธญเธ:</span>
                                <span className="change-amount">{change.toFixed(2)} เธฟ</span>
                            </div>
                        )}
                        <button 
                            className="payment-btn cash-btn confirm-cash-btn"
                            onClick={handleConfirmCashPayment}
                        >
                            เธขเธทเธเธขเธฑเธเธเธณเธฃเธฐเน€เธเธดเธ (เน€เธเธดเธเธชเธ”)
                        </button>
                    </div>
                )}

                {/* 4.3: (เนเธซเธกเน) เธซเธเนเธฒเนเธชเธ”เธ QR Code */}
                {showQR && (
                    <div className="qr-payment-section">
                        <label>เธชเนเธเธ QR Code เน€เธเธทเนเธญเธเธณเธฃเธฐเน€เธเธดเธ</label>
                        <div className="qr-code-wrapper">
                            {/* (เธเธตเนเธเธทเธญ QR Code เธเธณเธฅเธญเธ เธ—เธตเนเธกเธตเธเนเธญเธกเธนเธฅเธขเธญเธ”เน€เธเธดเธ
                               เนเธเนเธฅเธเธเธฃเธดเธ เธเธธเธ“เธเธฐเนเธ”เน "String" เธเธตเนเธกเธฒเธเธฒเธ Payment Gateway)
                            */}
                            <QRCodeSVG 
                                value={`PAYMENT_TOTAL:${totalAmount.toFixed(2)}`} 
                                size={256} // เธเธเธฒเธ”
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"L"}
                            />
                        </div>
                        <p>
                            (เธเธตเนเธเธทเธญ QR Code เธเธณเธฅเธญเธเธชเธณเธซเธฃเธฑเธเนเธเธฃเธเธเธฒเธฃเธเธตเน
                            เนเธเธฃเธฐเธเธเธเธฃเธดเธ เธฅเธนเธเธเนเธฒเธเธฐเธชเนเธเธเธ”เนเธงเธขเนเธญเธเธเธเธฒเธเธฒเธฃ)
                        </p>
                        <button 
                            className="payment-btn qr-btn confirm-qr-btn"
                            onClick={() => handleProcessPayment('QR')}
                        >
                            (เธเธณเธฅเธญเธ) เธฅเธนเธเธเนเธฒเธเนเธฒเธขเนเธฅเนเธง
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default PaymentPage;


