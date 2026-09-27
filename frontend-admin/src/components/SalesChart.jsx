import { useState } from "react";
import { Line } from "react-chartjs-2";
import"../styles/SalesChart.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SalesChart() {
  const [period, setPeriod] = useState("daily"); // daily หรือ weekly

  // ข้อมูลตัวอย่าง
  const dataDaily = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "ยอดขายรายวัน (฿)",
        data: [500, 1200, 800, 1500, 2000, 1700, 2200],
        borderColor: "#b22222",
        backgroundColor: "rgba(178,34,34,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const dataWeekly = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "ยอดขายรายสัปดาห์ (฿)",
        data: [5000, 7000, 6500, 8000],
        borderColor: "#b22222",
        backgroundColor: "rgba(178,34,34,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      title: {
        display: true,
        text: period === "daily" ? "ยอดขายรายวัน" : "ยอดขายรายสัปดาห์",
        color: "#b22222",
        font: { size: 18 },
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "ยอดขาย (บาท)", color: "#b22222", font: { size: 14 } },
      },
      x: {
        title: { display: true, text: period === "daily" ? "วันในสัปดาห์" : "สัปดาห์", color: "#b22222", font: { size: 14 } },
      },
    },
  };

  return (
    <div>
      {/* Dropdown เลือกช่วงเวลา */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px", fontWeight: 600 }}>เลือกช่วงเวลา:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="daily">รายวัน</option>
          <option value="weekly">รายสัปดาห์</option>
        </select>
      </div>

      {/* Chart */}
      <Line data={period === "daily" ? dataDaily : dataWeekly} options={options} />
    </div>
  );
}


