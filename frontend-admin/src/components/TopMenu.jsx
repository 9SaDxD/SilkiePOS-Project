import { useEffect, useState } from "react";

export default function TopMenu() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    fetch("https://silkiepos-project.onrender.com/api/sales/top-menu")
      .then(res => res.json())
      .then(data => setMenus(data));
  }, []);

  return (
    <div>
      <h3 style={{color:"#b22222"}}>🍜 เมนูขายดี Top 5</h3>
      <ul>
        {menus.map((item, idx) => (
          <li key={idx}>{idx+1}. {item.name} - {item.qty} ชิ้น</li>
        ))}
      </ul>
    </div>
  );
}


