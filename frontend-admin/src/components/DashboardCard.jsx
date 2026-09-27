export default function DashboardCard({ title, value, color, textColor = '#ffffff', className = '' }) {
  return (
    <div
      className={`dashboard-card shadow-md hover:shadow-xl transition-shadow duration-300 ${className}`}
      style={{ 
        backgroundColor: color, 
        color: textColor // ๐‘ (เธชเธณเธเธฑเธ) เธเธณเธซเธเธ”เธชเธตเธ•เธฑเธงเธญเธฑเธเธฉเธฃเธเธญเธ Card
      }}
    >
      <h4 className="card-title" style={{ color: textColor }}>{title}</h4> {/* ๐‘ (เธชเธณเธเธฑเธ) เธเธณเธซเธเธ”เธชเธตเธ•เธฑเธงเธญเธฑเธเธฉเธฃ */}
      <p className="card-value" style={{ color: textColor }}>{value}</p> {/* ๐‘ (เธชเธณเธเธฑเธ) เธเธณเธซเธเธ”เธชเธตเธ•เธฑเธงเธญเธฑเธเธฉเธฃ */}
    </div>
  );
}

