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
      { id: 1, name: "เนเธเนเธ•เนเธก", price: 15, image: null },
      { id: 2, name: "เธชเธฒเธซเธฃเนเธฒเธข", price: 10, image: null },
    ];
    setToppings(mockData);
    setLoading(false);
  }, []);

  const handleAdd = () => {
    if (!newTopping.name || !newTopping.price) {
      alert("เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเธทเนเธญเนเธฅเธฐเธฃเธฒเธเธฒ");
      return;
    }
    const newItem = { id: Date.now(), ...newTopping, image: preview };
    setToppings([...toppings, newItem]);
    setNewTopping({ name: "", price: "", image: null });
    setPreview(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเธ—เนเธญเธเธเธดเนเธ?")) return;
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

  if (loading) return <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ”เธเนเธญเธกเธนเธฅ...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">โ• เน€เธเธดเนเธกเธ—เนเธญเธเธเธดเนเธ</h2>

      {/* เธเธญเธฃเนเธกเน€เธเธดเนเธก */}
      <div className="menu-card new-card">
        <input type="text" value={newTopping.name} placeholder="เธเธทเนเธญเธ—เนเธญเธเธเธดเนเธ" onChange={(e) => setNewTopping({ ...newTopping, name: e.target.value })} />
        <input type="number" value={newTopping.price} placeholder="เธฃเธฒเธเธฒ" onChange={(e) => setNewTopping({ ...newTopping, price: e.target.value })} />
        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files[0];
          setNewTopping({ ...newTopping, image: file });
          setPreview(URL.createObjectURL(file));
        }} />
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        <button className="add-btn-full" onClick={handleAdd}>โ• เน€เธเธดเนเธกเธ—เนเธญเธเธเธดเนเธ</button>
      </div>

      {/* เธเธญเธฃเนเธกเนเธเนเนเธ */}
      {editTopping && (
        <div className="menu-card new-card">
          <h3>โ๏ธ เนเธเนเนเธเธ—เนเธญเธเธเธดเนเธ</h3>
          <input type="text" value={editTopping.name} onChange={(e) => setEditTopping({ ...editTopping, name: e.target.value })} />
          <input type="number" value={editTopping.price} onChange={(e) => setEditTopping({ ...editTopping, price: e.target.value })} />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files[0];
            setEditTopping({ ...editTopping, image: file });
            setEditPreview(URL.createObjectURL(file));
          }} />
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}
          <div className="button-group">
            <button onClick={handleSave} className="add-btn">๐’พ เธเธฑเธเธ—เธถเธ</button>
            <button onClick={() => setEditTopping(null)} className="delete-btn">โ เธขเธเน€เธฅเธดเธ</button>
          </div>
        </div>
      )}

      {/* เธ•เธฒเธฃเธฒเธ mockup */}
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>เธฅเธณเธ”เธฑเธ</th>
              <th>เธเธทเนเธญเธ—เนเธญเธเธเธดเนเธ</th>
              <th>เธฃเธฒเธเธฒ</th>
              <th>เธฃเธนเธ</th>
              <th>เธเธฑเธ”เธเธฒเธฃ</th>
            </tr>
          </thead>
          <tbody>
            {toppings.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", fontStyle:"italic" }}>เธขเธฑเธเนเธกเนเธกเธตเธ—เนเธญเธเธเธดเนเธ</td></tr>}
            {toppings.map((t, idx) => (
              <tr key={t.id}>
                <td>{idx+1}</td>
                <td>{t.name}</td>
                <td>{t.price}</td>
                <td>{t.image ? <img src={t.image} alt={t.name} style={{ width: "80px", height: "50px", objectFit:"cover", borderRadius:"6px" }}/> : "-"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(t)}>โ๏ธ เนเธเนเนเธ</button>
                  <button className="btn-delete" onClick={() => handleDelete(t.id)}>๐—‘๏ธ เธฅเธ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


