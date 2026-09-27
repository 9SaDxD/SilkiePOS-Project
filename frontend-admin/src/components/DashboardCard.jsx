export default function DashboardCard({ title, value, color, textColor = '#ffffff', className = '' }) {
  return (
    <div
      className={`dashboard-card shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
      style={{ 
        backgroundColor: color, 
        color: textColor // 👈 (สำคัญ) กำหนดสีตัวอักษรของ Card
      }}
    >
      <h4 className="card-title" style={{ color: textColor }}>{title}</h4> {/* 👈 (สำคัญ) กำหนดสีตัวอักษร */}
      <p className="card-value" style={{ color: textColor }}>{value}</p> {/* 👈 (สำคัญ) กำหนดสีตัวอักษร */}
    </div>
  );
}

