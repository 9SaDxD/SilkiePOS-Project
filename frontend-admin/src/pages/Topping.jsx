// src/pages/AddTopping.jsx
import { useEffect, useState } from "react";
import "../styles/EditMenu.css";

export default function AddTopping() {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTopping, setNewTopping] = useState({ name: "", price: "", image: null });
  const [preview, setPreview] = useState(null);
  const [editTopping, setEditTopping] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  useEffect(() => {
    const mockData = [
      { id: 1, name: "ไข่ต้ม", price: 15, image: null },
      { id: 2, name: "สาหร่าย", price: 10, image: null },
    ];
    setToppings(mockData);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    if (!newTopping.name || !newTopping.price) {
      alert("กรุณากรอกชื่อและราคา");
      return;
    }
    const newItem = { id: Date.now(), ...newTopping, image: preview };
    setToppings([...toppings, newItem]);
    setNewTopping({ name: "", price: "", image: null });
    setPreview(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบท็อปปิ้ง?")) return;
    setToppings(toppings.filter((t) => t.id !== id));
  };

  const handleEdit = (topping) => {
    setEditTopping({ ...topping });
    setEditPreview(topping.image);
  };

  const handleSave = () => {
    setToppings(
      toppings.map((t) => (t.id === editTopping.id ? { ...editTopping, image: editPreview } : t))
    );
    setEditTopping(null);
    setEditPreview(null);
  };

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">➕ เพิ่มท็อปปิ้ง</h2>

      {/* ฟอร์มเพิ่ม */}
      <div className="menu-card new-card">
        <input type="text" value={newTopping.name} placeholder="ชื่อท็อปปิ้ง" onChange={(e) => setNewTopping({ ...newTopping, name: e.target.value })} />
        <input type="number" value={newTopping.price} placeholder="ราคา" onChange={(e) => setNewTopping({ ...newTopping, price: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          setNewTopping({ ...newTopping, image: file });
          setPreview(URL.createObjectURL(file));
        }} />
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        <button className="add-btn-full" onClick={handleAdd}>➕ เพิ่มท็อปปิ้ง</button>
      </div>

      {/* ฟอร์มแก้ไข */}
      {editTopping && (
        <div className="menu-card new-card">
          <h3>✏️ แก้ไขท็อปปิ้ง</h3>
          <input type="text" value={editTopping.name} onChange={(e) => setEditTopping({ ...editTopping, name: e.target.value })} />
          <input type="number" value={editTopping.price} onChange={(e) => setEditTopping({ ...editTopping, price: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            setEditTopping({ ...editTopping, image: file });
            setEditPreview(URL.createObjectURL(file));
          }} />
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}
          <div className="button-group">
            <button onClick={handleSave} className="add-btn">💾 บันทึก</button>
            <button onClick={() => setEditTopping(null)} className="delete-btn">❌ ยกเลิก</button>
          </div>
        </div>
      )}

      {/* ตาราง mockup */}
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อท็อปปิ้ง</th>
              <th>ราคา</th>
              <th>รูป</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {toppings.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", fontStyle:"italic" }}>ยังไม่มีท็อปปิ้ง</td></tr>}
            {toppings.map((t, idx) => (
              <tr key={t.id}>
                <td>{idx+1}</td>
                <td>{t.name}</td>
                <td>{t.price}</td>
                <td>{t.image ? <img src={t.image} alt={t.name} style={{ width: "80px", height: "50px", objectFit:"cover", borderRadius:"6px" }}/> : "-"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(t)}>✏️ แก้ไข</button>
                  <button className="btn-delete" onClick={() => handleDelete(t.id)}>🗑️ ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
