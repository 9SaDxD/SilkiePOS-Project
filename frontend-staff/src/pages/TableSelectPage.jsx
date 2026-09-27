import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './TableSelectPage.css';

function TableSelectPage() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { toggleSidebar } = useOutletContext();

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const res = await axios.get('https://silkiepos-project.onrender.com/api/staff/tables');
                setTables(res.data);
            } catch (err) { console.error("Error fetching tables", err); } 
            finally { setLoading(false); }
        };
        fetchTables();
    }, []);

    const handleTableSelect = (table) => {
        if (table.status === 'Open' || table.status === 'Closed') {
            navigate(`/order/${table.tableId}`);
        } else if (table.status === 'Occupied') {
            navigate(`/bill/${table.tableId}`);
        }
    };

    if (loading) return <div className="table-select-container"><div>Loading tables...</div></div>;

    return (
        <div className="table-select-container">
            {/* --- (เนเธเนเนเธ) Header --- */}
            <header className="table-header">
                {/* 1. เธเธธเนเธกเธเนเธฒเธข (Hamburger) */}
                <button className="hamburger-btn" onClick={toggleSidebar}>
                    โฐ
                </button>
                
                {/* 2. Title (เธ•เธฃเธเธเธฅเธฒเธ) */}
                <h1>เน€เธฅเธทเธญเธเนเธ•เนเธฐ</h1>
                
                {/* 3. (เนเธซเธกเน) เธ•เธฑเธงเธขเธถเธ”เธเธทเนเธเธ—เธตเน (เธเธงเธฒ) */}
                <div className="header-placeholder"></div>
            </header>
            {/* --------------------- */}

            <main className="table-grid">
                {tables.map(table => (
                    <button 
                        key={table.tableId} 
                        className={`table-button ${table.status.toLowerCase()}`}
                        onClick={() => handleTableSelect(table)}
                    >
                        {table.tableId}
                    </button>
                ))}
            </main>
        </div>
    );
}

export default TableSelectPage;


