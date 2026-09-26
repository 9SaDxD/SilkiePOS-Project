// src/pages/Dashboard.jsx (ฉบับอัปเดต)
import { useEffect, useState } from "react"; // (ใหม่)
import axios from "axios"; // (ใหม่)
import DashboardCard from "../components/DashboardCard";
import SalesChart from "../components/SalesChart";
import "../styles/Dashboard.css"; //

// (ใหม่) API URL
const API_URL = "http://localhost:3000/api/admin/stats";

export default function Dashboard() {
  // (ใหม่) State สำหรับเก็บข้อมูล
  const [stats, setStats] = useState({
    todaysSales: 0,
    paidOrdersToday: 0,
    pendingOrders: 0,
    occupiedTables: 0
  });
  const [loading, setLoading] = useState(true);

  // (ใหม่) ดึงข้อมูลเมื่อหน้าโหลด
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL);
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);
  
  if (loading) return <p>กำลังโหลดข้อมูล Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🍜 Ramen POS - หน้าหลัก</h1>

      <div className="dashboard-main">
        {/* --- (แก้ไข) Left Column - Cards --- */}
        <div className="dashboard-left">
          <div className="dashboard-grid">
            <DashboardCard 
              title="ยอดขายวันนี้" 
              value={`${stats.todaysSales.toLocaleString()} ฿`} 
              color="#c56868ff" 
            />
            <DashboardCard 
              title="Order เช็กบิลแล้ว (วันนี้)" 
              value={stats.paidOrdersToday.toLocaleString()} 
              color="#7e3838ff" 
            />
            <DashboardCard 
              title="Order ยังไม่เช็กบิล (ทั้งหมด)" 
              value={stats.pendingOrders.toLocaleString()} 
              color="#582121ff" 
            />
            <DashboardCard 
              title="โต๊ะที่เปิดบริการอยู่" 
              value={stats.occupiedTables.toLocaleString()} 
              color="#300a0aff" 
            />
          </div>
        </div>

        {/* Right Column - Chart (ยังใช้ Mock data) */}
        <div className="dashboard-right">
          <h3 className="chart-title">📊 รายงานยอดขาย</h3>
          <div className="chart-container">
            <SalesChart />
          </div>
        </div>
      </div>
    </div>
  );

  
}