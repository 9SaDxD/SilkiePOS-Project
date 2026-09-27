// src/pages/Dashboard.jsx (เธเธเธฑเธเธญเธฑเธเน€เธ”เธ•)
import { useEffect, useState } from "react"; // (เนเธซเธกเน)
import axios from "axios"; // (เนเธซเธกเน)
import DashboardCard from "../components/DashboardCard";
import SalesChart from "../components/SalesChart";
import "../styles/Dashboard.css"; //

// (เนเธซเธกเน) API URL
const API_URL = "https://silkiepos-project.onrender.com/api/admin/stats";

export default function Dashboard() {
  // (เนเธซเธกเน) State เธชเธณเธซเธฃเธฑเธเน€เธเนเธเธเนเธญเธกเธนเธฅ
  const [stats, setStats] = useState({
    todaysSales: 0,
    paidOrdersToday: 0,
    pendingOrders: 0,
    occupiedTables: 0
  });
  const [loading, setLoading] = useState(true);

  // (เนเธซเธกเน) เธ”เธถเธเธเนเธญเธกเธนเธฅเน€เธกเธทเนเธญเธซเธเนเธฒเนเธซเธฅเธ”
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
  
  if (loading) return <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ”เธเนเธญเธกเธนเธฅ Dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">๐ Ramen POS - เธซเธเนเธฒเธซเธฅเธฑเธ</h1>

      <div className="dashboard-main">
        {/* --- (เนเธเนเนเธ) Left Column - Cards --- */}
        <div className="dashboard-left">
          <div className="dashboard-grid">
            <DashboardCard 
              title="เธขเธญเธ”เธเธฒเธขเธงเธฑเธเธเธตเน" 
              value={`${stats.todaysSales.toLocaleString()} เธฟ`} 
              color="#c56868ff" 
            />
            <DashboardCard 
              title="Order เน€เธเนเธเธเธดเธฅเนเธฅเนเธง (เธงเธฑเธเธเธตเน)" 
              value={stats.paidOrdersToday.toLocaleString()} 
              color="#7e3838ff" 
            />
            <DashboardCard 
              title="Order เธขเธฑเธเนเธกเนเน€เธเนเธเธเธดเธฅ (เธ—เธฑเนเธเธซเธกเธ”)" 
              value={stats.pendingOrders.toLocaleString()} 
              color="#582121ff" 
            />
            <DashboardCard 
              title="เนเธ•เนเธฐเธ—เธตเนเน€เธเธดเธ”เธเธฃเธดเธเธฒเธฃเธญเธขเธนเน" 
              value={stats.occupiedTables.toLocaleString()} 
              color="#300a0aff" 
            />
          </div>
        </div>

        {/* Right Column - Chart (เธขเธฑเธเนเธเน Mock data) */}
        <div className="dashboard-right">
          <h3 className="chart-title">๐“ เธฃเธฒเธขเธเธฒเธเธขเธญเธ”เธเธฒเธข</h3>
          <div className="chart-container">
            <SalesChart />
          </div>
        </div>
      </div>
    </div>
  );

  
}



