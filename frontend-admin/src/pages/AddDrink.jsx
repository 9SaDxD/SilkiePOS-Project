// src/pages/AddDrink.jsx
import { useEffect, useState } from "react";
import "../styles/EditMenu.css";

export default function AddDrink() {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDrink, setNewDrink] = useState({ name: "", price: "", image: null });
  const [preview, setPreview] = useState(null);
  const [editDrink, setEditDrink] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  useEffect(() => {
    const mockData = [
      { id: 1, name: "ชาเย็น", price: 25, image: null },
      { id: 2, name: "น้ำเปล่า", price: 10, image: null },
    ];
    setDrinks(mockData);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    if (!newDrink.name || !newDrink.price) { alert("กรุณากรอกชื่อและราคา"); return; }
    const newItem = { id: Date.now(), ...newDrink, image: preview };
    setDrinks([...drinks, newItem]);
    setNewDrink({ name: "", price: "", image: null });
    setPreview(null);
  };

  const handleDelete = (id) => { if(!window.confirm("คุณแน่ใจหรือไม่ที่จะลบน้ำ?")) return; setDrinks(drinks.filter(d => d.id !== id)); }
  const handleEdit = (drink) => { setEditDrink({...drink}); setEditPreview(drink.image); }
  const handleSave = () => { setDrinks(drinks.map(d => d.id === editDrink.id ? {...editDrink, image:editPreview} : d)); setEditDrink(null); setEditPreview(null); }

  if(loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">➕ เพิ่มน้ำ</h2>

      <div className="menu-card new-card">
        <input type="text" placeholder="ชื่อเครื่องดื่ม" value={newDrink.name} onChange={(e)=>setNewDrink({...newDrink,name:e.target.value})} />
        <input type="number" placeholder="ราคา" value={newDrink.price} onChange={(e)=>setNewDrink({...newDrink,price:e.target.value})} />
        <input type="file" accept="image/*" onChange={(e)=>{const file=e.target.files[0]; setNewDrink({...newDrink,image:file}); setPreview(URL.createObjectURL(file));}} />
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        <button className="add-btn-full" onClick={handleAdd}>➕ เพิ่มน้ำ</button>
      </div>

      {editDrink && (
        <div className="menu-card new-card">
          <h3>✏️ แก้ไขน้ำ</h3>
          <input type="text" value={editDrink.name} onChange={(e)=>setEditDrink({...editDrink,name:e.target.value})}/>
          <input type="number" value={editDrink.price} onChange={(e)=>setEditDrink({...editDrink,price:e.target.value})}/>
          <input type="file" accept="image/*" onChange={(e)=>{const file=e.target.files[0]; setEditDrink({...editDrink,image:file}); setEditPreview(URL.createObjectURL(file));}}/>
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}
          <div className="button-group">
            <button className="add-btn" onClick={handleSave}>💾 บันทึก</button>
            <button className="delete-btn" onClick={()=>setEditDrink(null)}>❌ ยกเลิก</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ลำดับ</th><th>ชื่อเครื่องดื่ม</th><th>ราคา</th><th>รูป</th><th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {drinks.length===0 && <tr><td colSpan="5" style={{textAlign:"center", fontStyle:"italic"}}>ยังไม่มีเครื่องดื่ม</td></tr>}
            {drinks.map((d,idx)=>(
              <tr key={d.id}>
                <td>{idx+1}</td>
                <td>{d.name}</td>
                <td>{d.price}</td>
                <td>{d.image?<img src={d.image} alt={d.name} style={{width:"80px",height:"50px",objectFit:"cover",borderRadius:"6px"}}/>:"-"}</td>
                <td><button className="btn-edit" onClick={()=>handleEdit(d)}>✏️ แก้ไข</button><button className="btn-delete" onClick={()=>handleDelete(d.id)}>🗑️ ลบ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


