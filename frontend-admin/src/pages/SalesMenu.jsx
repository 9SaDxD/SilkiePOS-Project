import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import DashboardCard from "../components/DashboardCard"; 
import "../styles/SalesMenu.css"; //

const API_URL = "https://silkiepos-project.onrender.com/api/admin/sales/top-menu";

// --- ๐‘ (เนเธเนเนเธ) เธชเธตเธเธทเนเธเธซเธฅเธฑเธ Card (เน€เธเธดเนเธก Contrast) ---
const TOP_COLORS = [
  "#991B1B", // 1. Dark Red (เน€เธเนเธก)
  "#E25822", // 2. Deep Orange (เน€เธเนเธก)
  "#A9580A", // 3. Brownish Gold (เน€เธเนเธกเธเธถเนเธเธญเธตเธ)
  "#f0f0f0", // 4. Light Gray
  "#f0f0f0"  // 5. Light Gray
]; 
// --- ๐‘ (เนเธเนเนเธ) เธชเธตเธ•เธฑเธงเธซเธเธฑเธเธชเธทเธญ Card (เธเธฑเธเธเธฑเธเน€เธเนเธเธชเธตเธเธฒเธงเธเธเธเธทเนเธเน€เธเนเธก) ---
const TEXT_COLORS = [
  "#ffffff", // 1. White (เธเธฑเธ”เน€เธเธ)
  "#ffffff", // 2. White (เธเธฑเธ”เน€เธเธ)
  "#ffffff", // 3. White (เธเธฑเธ”เน€เธเธเธเธเธเธทเนเธเน€เธเนเธก)
  "#3a0d0d", // 4. Dark (เธเธเธเธทเนเธเธชเธงเนเธฒเธ)
  "#3a0d0d"  // 5. Dark (เธเธเธเธทเนเธเธชเธงเนเธฒเธ)
];

export default function SalesMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filter, setFilter] = useState("เธ—เธฑเนเธเธซเธกเธ”");
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
      <h2 className="page-title">๐ เน€เธกเธเธนเธเธฒเธขเธ”เธต</h2>

      <div className="top5-grid">
        {loading ? (
            <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ” Top 5...</p>
        ) : (
            topMenus.map((item, idx) => (
                <DashboardCard 
                    key={item._id} 
                    title={`${idx + 1}. ${item._id}`} 
                    value={`เธเธฒเธขเนเธฅเนเธง ${item.qty.toLocaleString()} เธเธดเนเธ`}
                    color={TOP_COLORS[idx]} 
                    textColor={TEXT_COLORS[idx]} // ๐‘ เธชเนเธเธชเธตเธ•เธฑเธงเธซเธเธฑเธเธชเธทเธญเธ—เธตเนเธเธฑเธ”เน€เธเธ
                    className="top-menu-card" 
                />
            ))
        )}
      </div>

      {/* Filter (เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก) */}
      <div className="filter-box">
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>เธ—เธฑเนเธเธซเธกเธ”</option>
          <option>เธงเธฑเธเธเธตเน</option>
          <option>เธชเธฑเธเธ”เธฒเธซเนเธเธตเน</option>
          <option>เน€เธ”เธทเธญเธเธเธตเน</option>
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="qty">เน€เธฃเธตเธขเธเธ•เธฒเธกเธเธณเธเธงเธเธเธฒเธข</option>
          <option value="revenue">เน€เธฃเธตเธขเธเธ•เธฒเธกเธฃเธฒเธขเนเธ”เน</option>
        </select>
      </div>

      {/* เธ•เธฒเธฃเธฒเธ */}
      <div className="table-wrapper">
        <table className="sales-table">
          <thead>
            <tr>
              <th>#</th>
              <th>เธเธทเนเธญเน€เธกเธเธน</th>
              <th>เธเธณเธเธงเธเธเธฒเธข</th>
              <th>เธฃเธฒเธขเนเธ”เน (เธเธฒเธ—)</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="4">เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</td></tr>
            ) : menus.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                  เนเธกเนเธกเธตเธเนเธญเธกเธนเธฅ (เธฅเธญเธเธชเธฑเนเธเธญเธฒเธซเธฒเธฃเนเธฅเธฐเธเนเธฒเธขเน€เธเธดเธเนเธเธเธฑเนเธ Staff)
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



