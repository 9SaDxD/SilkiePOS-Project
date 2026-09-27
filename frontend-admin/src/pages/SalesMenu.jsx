import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard"; 
import "../styles/SalesMenu.css"; //

const API_URL = "https://silkiepos-project.onrender.com/api/admin/sales/top-menu";

// --- 👇 (แก้ไข) สีพื้นหลัง Card (เพิ่ม Contrast) ---
const TOP_COLORS = [
  "#991B1B", // 1. Dark Red (เข้ม)
  "#E25822", // 2. Deep Orange (เข้ม)
  "#A9580A", // 3. Brownish Gold (เข้มขึ้นอีก)
  "#f0f0f0", // 4. Light Gray
  "#f0f0f0"  // 5. Light Gray
]; 
// --- 👇 (แก้ไข) สีตัวหนังสือ Card (บังคับเป็นสีขาวบนพื้นเข้ม) ---
const TEXT_COLORS = [
  "#ffffff", // 1. White (ชัดเจน)
  "#ffffff", // 2. White (ชัดเจน)
  "#ffffff", // 3. White (ชัดเจนบนพื้นเข้ม)
  "#3a0d0d", // 4. Dark (บนพื้นสว่าง)
  "#3a0d0d"  // 5. Dark (บนพื้นสว่าง)
];

export default function SalesMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState("ทั้งหมด");
  const [sort, setSort] = useState("qty");

  const fetchSales = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { period: filter, sort: sort }
      });
      setMenus(response.data); 
    } catch (err) {
      console.error("Error fetching sales menu:", err);
    } finally {
      setLoading(false);
    }
  }, [filter, sort]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const topMenus = menus.slice(0, 5);

  return (
    <div className="sales-container">
      <h2 className="page-title">🍜 เมนูขายดี</h2>

      <div className="top5-grid">
        {loading ? (
            <p>กำลังโหลด Top 5...</p>
        ) : (
            topMenus.map((item, idx) => (
                <DashboardCard 
                    key={item._id} 
                    title={`${idx + 1}. ${item._id}`} 
                    value={`ขายแล้ว ${item.qty.toLocaleString()} ชิ้น`}
                    color={TOP_COLORS[idx]} 
                    textColor={TEXT_COLORS[idx]} // 👈 ส่งสีตัวหนังสือที่ชัดเจน
                    className="top-menu-card" 
                />
            ))
        )}
      </div>

      {/* Filter (เหมือนเดิม) */}
      <div className="filter-box">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>ทั้งหมด</option>
          <option>วันนี้</option>
          <option>สัปดาห์นี้</option>
          <option>เดือนนี้</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="qty">เรียงตามจำนวนขาย</option>
          <option value="revenue">เรียงตามรายได้</option>
        </select>
      </div>

      {/* ตาราง */}
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อเมนู</th>
              <th>จำนวนขาย</th>
              <th>รายได้ (บาท)</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4">กำลังโหลด...</td></tr>
            ) : menus.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                  ไม่มีข้อมูล (ลองสั่งอาหารและจ่ายเงินในฝั่ง Staff)
                </td>
              </tr>
            ) : (
              menus.map((item, idx) => (
                <tr key={item._id}>
                  <td>{idx + 1}</td>
                  <td>{item._id}</td> 
                  <td>{item.qty}</td>
                  <td>{item.revenue.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



