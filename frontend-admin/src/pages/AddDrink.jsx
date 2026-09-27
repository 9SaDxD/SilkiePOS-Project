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
      { id: 1, name: "เธเธฒเน€เธขเนเธ", price: 25, image: null },
      { id: 2, name: "เธเนเธณเน€เธเธฅเนเธฒ", price: 10, image: null },
    ];
    setDrinks(mockData);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    if (!newDrink.name || !newDrink.price) { alert("เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเธทเนเธญเนเธฅเธฐเธฃเธฒเธเธฒ"); return; }
    const newItem = { id: Date.now(), ...newDrink, image: preview };
    setDrinks([...drinks, newItem]);
    setNewDrink({ name: "", price: "", image: null });
    setPreview(null);
  };

  const handleDelete = (id) => { if(!window.confirm("เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเธเนเธณ?")) return; setDrinks(drinks.filter(d => d.id !== id)); }
  const handleEdit = (drink) => { setEditDrink({...drink}); setEditPreview(drink.image); }
  const handleSave = () => { setDrinks(drinks.map(d => d.id === editDrink.id ? {...editDrink, image:editPreview} : d)); setEditDrink(null); setEditPreview(null); }

  if(loading) return <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ”เธเนเธญเธกเธนเธฅ...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">โ• เน€เธเธดเนเธกเธเนเธณ</h2>

      <div className="menu-card new-card">
        <input type="text" placeholder="เธเธทเนเธญเน€เธเธฃเธทเนเธญเธเธ”เธทเนเธก" value={newDrink.name} onChange={(e)=>setNewDrink({...newDrink,name:e.target.value})} />
        <input type="number" placeholder="เธฃเธฒเธเธฒ" value={newDrink.price} onChange={(e)=>setNewDrink({...newDrink,price:e.target.value})} />
        <input type="file" accept="image/*" onChange={(e)=>{const file=e.target.files[0]; setNewDrink({...newDrink,image:file}); setPreview(URL.createObjectURL(file));}} />
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        <button className="add-btn-full" onClick={handleAdd}>โ• เน€เธเธดเนเธกเธเนเธณ</button>
      </div>

      {editDrink && (
        <div className="menu-card new-card">
          <h3>โ๏ธ เนเธเนเนเธเธเนเธณ</h3>
          <input type="text" value={editDrink.name} onChange={(e)=>setEditDrink({...editDrink,name:e.target.value})}/>
          <input type="number" value={editDrink.price} onChange={(e)=>setEditDrink({...editDrink,price:e.target.value})}/>
          <input type="file" accept="image/*" onChange={(e)=>{const file=e.target.files[0]; setEditDrink({...editDrink,image:file}); setEditPreview(URL.createObjectURL(file));}}/>
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}
          <div className="button-group">
            <button className="add-btn" onClick={handleSave}>๐’พ เธเธฑเธเธ—เธถเธ</button>
            <button className="delete-btn" onClick={()=>setEditDrink(null)}>โ เธขเธเน€เธฅเธดเธ</button>
          </div>
        </div>
      )}

      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>เธฅเธณเธ”เธฑเธ</th><th>เธเธทเนเธญเน€เธเธฃเธทเนเธญเธเธ”เธทเนเธก</th><th>เธฃเธฒเธเธฒ</th><th>เธฃเธนเธ</th><th>เธเธฑเธ”เธเธฒเธฃ</th>
            </tr>
          </thead>
          <tbody>
            {drinks.length===0 && <tr><td colSpan="5" style={{textAlign:"center", fontStyle:"italic"}}>เธขเธฑเธเนเธกเนเธกเธตเน€เธเธฃเธทเนเธญเธเธ”เธทเนเธก</td></tr>}
            {drinks.map((d,idx)=>(
              <tr key={d.id}>
                <td>{idx+1}</td>
                <td>{d.name}</td>
                <td>{d.price}</td>
                <td>{d.image?<img src={d.image} alt={d.name} style={{width:"80px",height:"50px",objectFit:"cover",borderRadius:"6px"}}/>:"-"}</td>
                <td><button className="btn-edit" onClick={()=>handleEdit(d)}>โ๏ธ เนเธเนเนเธ</button><button className="btn-delete" onClick={()=>handleDelete(d.id)}>๐—‘๏ธ เธฅเธ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


