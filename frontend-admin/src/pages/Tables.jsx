import { useState, useEffect, useCallback } from "react";
import axios from "axios"; // (ใหม่)
import "../styles/Tables.css"; //

// (ใหม่) API URL
const API_URL = "https://silkiepos-project.onrender.com/api/admin/tables";

export default function TablesGrid() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // (แก้ไข) State สำหรับฟอร์ม
  const [newTableId, setNewTableId] = useState("");

  // --- (ใหม่) ฟังก์ชันดึงข้อมูลโต๊ะ ---
  const fetchTables = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTables(response.data);
    } catch (error) {
      console.error("Error fetching tables:", error);
      alert("ไม่สามารถดึงข้อมูลโต๊ะได้: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  // --- (แก้ไข) ฟังก์ชันเพิ่มโต๊ะ ---
  const handleAddTable = async () => {
    if (!newTableId.trim()) return alert("กรุณากรอก ID โต๊ะ (เช่น T04)");

    try {
      // (ส่ง tableId ให้ตรงกับ Model)
      await axios.post(API_URL, { tableId: newTableId });
      alert(`เพิ่มโต๊ะ ${newTableId} สำเร็จ!`);
      setNewTableId("");
      fetchTables(); // โหลดใหม่
    } catch (error) {
      console.error("Error adding table:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  // --- (แก้ไข) ฟังก์ชันลบโต๊ะ ---
  const handleDelete = async (id, tableId) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะลบโต๊ะ ${tableId}?`)) return;
    
    try {
      await axios.delete(`${API_URL}/${id}`); // (ส่ง _id ของ MongoDB)
      alert(`ลบโต๊ะ ${tableId} สำเร็จ!`);
      fetchTables(); // โหลดใหม่
    } catch (error) {
      console.error("Error deleting table:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  return (
    <div className="tables-container">
      <h2>🪑 จัดการโต๊ะ</h2>

      {/* (แก้ไข) ฟอร์มเพิ่มโต๊ะ */}
      <div className="add-table-box">
        <input
          type="text"
          placeholder="ID โต๊ะใหม่ (เช่น T04, T05)"
          value={newTableId}
          onChange={e => setNewTableId(e.target.value)}
        />
        <button onClick={handleAddTable}>➕ เพิ่มโต๊ะ</button>
      </div>

      {/* (แก้ไข) ตารางแสดงผล */}
      <div className="tables-grid">
        {loading ? <p>กำลังโหลด...</p> : 
         tables.length === 0 ? <p>ไม่พบข้อมูลโต๊ะ (ลอง Seed ข้อมูล)</p> :
         tables.map((table) => (
          <div
            key={table._id} // (ใช้ _id)
            // (แก้ไข) ใช้ class "open" หรือ "occupied"
            className={`table-card ${table.status.toLowerCase()}`} 
          >
            <h3>{table.tableId}</h3>
            <p className="status">{table.status}</p>
            <div className="table-actions">
              {/* (ลบปุ่มสลับสถานะ) */}
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(table._id, table.tableId)}
              >
                🗑️ ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



