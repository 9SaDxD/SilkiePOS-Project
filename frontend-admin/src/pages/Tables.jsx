import { useState, useEffect, useCallback } from "react";
import axios from "axios"; // (เนเธซเธกเน)
import "../styles/Tables.css"; //

// (เนเธซเธกเน) API URL
const API_URL = "https://silkiepos-project.onrender.com/api/admin/tables";

export default function TablesGrid() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // (เนเธเนเนเธ) State เธชเธณเธซเธฃเธฑเธเธเธญเธฃเนเธก
  const [newTableId, setNewTableId] = useState("");

  // --- (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธเธ”เธถเธเธเนเธญเธกเธนเธฅเนเธ•เนเธฐ ---
  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธ”เธถเธเธเนเธญเธกเธนเธฅเนเธ•เนเธฐเนเธ”เน: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // --- (เนเธเนเนเธ) เธเธฑเธเธเนเธเธฑเธเน€เธเธดเนเธกเนเธ•เนเธฐ ---
  const handleAddTable = async () => {
    if (!newTableId.trim()) return alert("เธเธฃเธธเธ“เธฒเธเธฃเธญเธ ID เนเธ•เนเธฐ (เน€เธเนเธ T04)");

    try {
      // (เธชเนเธ tableId เนเธซเนเธ•เธฃเธเธเธฑเธ Model)
      await axios.post(API_URL, { tableId: newTableId });
      alert(`เน€เธเธดเนเธกเนเธ•เนเธฐ ${newTableId} เธชเธณเน€เธฃเนเธ!`);
      setNewTableId("");
      fetchTables(); // เนเธซเธฅเธ”เนเธซเธกเน
    } catch (error) {
      console.error("Error adding table:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  // --- (เนเธเนเนเธ) เธเธฑเธเธเนเธเธฑเธเธฅเธเนเธ•เนเธฐ ---
  const handleDelete = async (id, tableId) => {
    if (!window.confirm(`เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเนเธ•เนเธฐ ${tableId}?`)) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`); // (เธชเนเธ _id เธเธญเธ MongoDB)
      alert(`เธฅเธเนเธ•เนเธฐ ${tableId} เธชเธณเน€เธฃเนเธ!`);
      fetchTables(); // เนเธซเธฅเธ”เนเธซเธกเน
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  return (
    <div className="tables-container">
      <h2>๐ช‘ เธเธฑเธ”เธเธฒเธฃเนเธ•เนเธฐ</h2>

      {/* (เนเธเนเนเธ) เธเธญเธฃเนเธกเน€เธเธดเนเธกเนเธ•เนเธฐ */}
      <div className="add-table-box">
        <input
          type="text"
          placeholder="ID เนเธ•เนเธฐเนเธซเธกเน (เน€เธเนเธ T04, T05)"
          value={newTableId}
          onChange={e => setNewTableId(e.target.value)}
        />
        <button onClick={handleAddTable}>โ• เน€เธเธดเนเธกเนเธ•เนเธฐ</button>
      </div>

      {/* (เนเธเนเนเธ) เธ•เธฒเธฃเธฒเธเนเธชเธ”เธเธเธฅ */}
      <div className="tables-grid">
        {loading ? <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</p> : 
         tables.length === 0 ? <p>เนเธกเนเธเธเธเนเธญเธกเธนเธฅเนเธ•เนเธฐ (เธฅเธญเธ Seed เธเนเธญเธกเธนเธฅ)</p> :
         tables.map((table) => (
          <div
            key={table._id} // (เนเธเน _id)
            // (เนเธเนเนเธ) เนเธเน class "open" เธซเธฃเธทเธญ "occupied"
            className={`table-card ${table.status.toLowerCase()}`} 
          >
            <h3>{table.tableId}</h3>
            <p className="status">{table.status}</p>
            <div className="table-actions">
              {/* (เธฅเธเธเธธเนเธกเธชเธฅเธฑเธเธชเธ–เธฒเธเธฐ) */}
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(table._id, table.tableId)}
              >
                ๐—‘๏ธ เธฅเธ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



