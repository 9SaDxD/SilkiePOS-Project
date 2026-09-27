import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/EditMenu.css";

const API_URL = "https://silkiepos-project.onrender.com/api/admin/menus";
const BASE_URL = "https://silkiepos-project.onrender.com"; // (เนเธซเธกเน) เธชเธณเธซเธฃเธฑเธเนเธชเธ”เธเธฃเธนเธ

// (เธเธฑเธเธเนเธเธฑเธเธชเธฃเนเธฒเธ ID - เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
const generateNextMenuId = (kitchenType, allMenus) => {
  const prefix = kitchenType.charAt(0).toUpperCase();
  const relevantMenus = allMenus.filter(m => m.menuId && m.menuId.startsWith(prefix));
  let maxNum = 0;
  if (relevantMenus.length > 0) {
    relevantMenus.forEach(m => {
      const num = parseInt(m.menuId.substring(1), 10);
      if (num > maxNum) maxNum = num;
    });
  }
  const nextNum = maxNum + 1;
  const paddedNum = String(nextNum).padStart(3, '0');
  return `${prefix}${paddedNum}`;
};

export default function EditMenu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- ๐‘ (เนเธเนเนเธ) State เธชเธณเธซเธฃเธฑเธเธเธญเธฃเนเธก "เน€เธเธดเนเธก" ---
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    kitchenType: "Ramen",
    imageFile: null, // (เน€เธเธฅเธตเนเธขเธเธเธฒเธ imageUrl เน€เธเนเธ imageFile)
  });
  const [preview, setPreview] = useState(null); // (เนเธซเธกเน) เธชเธณเธซเธฃเธฑเธเนเธเธงเนเธฃเธนเธ
  
  const [editMenu, setEditMenu] = useState(null);
  const [editPreview, setEditPreview] = useState(null); // (เนเธซเธกเน)

  // (เธเธฑเธเธเนเธเธฑเธ fetchMenus - เน€เธซเธกเธทเธญเธเน€เธ”เธดเธก)
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      alert("เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธ”เธถเธเธเนเธญเธกเธนเธฅเน€เธกเธเธนเนเธ”เน: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // --- ๐‘ (เนเธเนเนเธ) เธเธฑเธเธเนเธเธฑเธ "เน€เธเธดเนเธกเน€เธกเธเธน" (เนเธเน FormData) ---
  const handleAdd = async () => {
    if (!newMenu.name || !newMenu.price || !newMenu.kitchenType) {
      alert("เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธฃเธ (เธเธทเนเธญ, เธฃเธฒเธเธฒ, เธเธฃเธฐเน€เธ เธ—เธเธฃเธฑเธง)");
      return;
    }
    
    const generatedMenuId = generateNextMenuId(newMenu.kitchenType, menus);

    // 1. (เนเธซเธกเน) เธชเธฃเนเธฒเธ FormData
    const formData = new FormData();
    formData.append('menuId', generatedMenuId);
    formData.append('name', newMenu.name);
    formData.append('price', newMenu.price);
    formData.append('kitchenType', newMenu.kitchenType);
    
    // 2. (เนเธซเธกเน) เน€เธเธดเนเธกเนเธเธฅเน (เธ–เนเธฒเธกเธต)
    if (newMenu.imageFile) {
      formData.append('image', newMenu.imageFile); // 'image' เธ•เนเธญเธเธ•เธฃเธเธเธฑเธ `upload.single('image')`
    }

    try {
      // 3. (เนเธซเธกเน) เธชเนเธ FormData
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert(`เน€เธเธดเนเธกเน€เธกเธเธนเธชเธณเน€เธฃเนเธ! (ID: ${generatedMenuId})`);
      setNewMenu({ name: "", price: "", kitchenType: "Ramen", imageFile: null });
      setPreview(null);
      fetchMenus();
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.error);
    }
  };

  // --- ๐‘ (เนเธเนเนเธ) เธเธฑเธเธเนเธเธฑเธ "เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธเนเนเธ" (เนเธเน FormData) ---
  const handleSave = async () => {
    if (!editMenu) return;

    // 1. (เนเธซเธกเน) เธชเธฃเนเธฒเธ FormData
    const formData = new FormData();
    formData.append('name', editMenu.name);
    formData.append('price', editMenu.price);
    formData.append('kitchenType', editMenu.kitchenType);
    
    // 2. (เนเธซเธกเน) เธ–เนเธฒเธกเธตเธเธฒเธฃเน€เธฅเธทเธญเธเนเธเธฅเนเนเธซเธกเน (imageFile เธเธทเธญเนเธเธฅเนเนเธซเธกเน)
    if (editMenu.imageFile) {
      formData.append('image', editMenu.imageFile);
    }
    // (เธ–เนเธฒเนเธกเนเธกเธตเนเธเธฅเนเนเธซเธกเน Backend เธเธฐเนเธกเนเนเธเนเนเธ imageUrl เน€เธ”เธดเธก)

    try {
      // 3. (เนเธซเธกเน) เธชเนเธ FormData
      await axios.put(`${API_URL}/${editMenu.menuId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธเนเนเธเธชเธณเน€เธฃเนเธ!");
      setEditMenu(null);
      setEditPreview(null);
      fetchMenus();
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  // --- (เธเธฑเธเธเนเธเธฑเธเน€เธ”เธดเธก) ---
  const handleDelete = async (menuId) => {
    if (!window.confirm(`เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเน€เธกเธเธน ${menuId}?`)) return;
    try {
      await axios.delete(`${API_URL}/${menuId}`);
      alert("เธฅเธเน€เธกเธเธนเธชเธณเน€เธฃเนเธ!");
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  const handleEdit = (menu) => {
    setEditMenu({ ...menu, imageFile: null }); // เน€เธฃเธดเนเธกเธ•เนเธเธ—เธตเนเธขเธฑเธเนเธกเนเธกเธตเนเธเธฅเนเนเธซเธกเน
    setEditPreview(menu.imageUrl ? `${BASE_URL}/${menu.imageUrl}` : null); // เนเธชเธ”เธเธฃเธนเธเน€เธเนเธฒ
  };
  
  const handleChangeNew = (field, value) => {
    setNewMenu({ ...newMenu, [field]: value });
  };
  const handleChangeEdit = (field, value) => {
    setEditMenu({ ...editMenu, [field]: value });
  };

  // (เนเธซเธกเน) Handler เธชเธณเธซเธฃเธฑเธเธญเธฑเธเนเธซเธฅเธ”เนเธเธฅเน (เธเธญเธฃเนเธก "เน€เธเธดเนเธก")
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenu({ ...newMenu, imageFile: file });
      setPreview(URL.createObjectURL(file)); // เธชเธฃเนเธฒเธ URL เธเธฑเนเธงเธเธฃเธฒเธงเธชเธณเธซเธฃเธฑเธเนเธเธงเน
    }
  };
  
  // (เนเธซเธกเน) Handler เธชเธณเธซเธฃเธฑเธเธญเธฑเธเนเธซเธฅเธ”เนเธเธฅเน (เธเธญเธฃเนเธก "เนเธเนเนเธ")
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditMenu({ ...editMenu, imageFile: file });
      setEditPreview(URL.createObjectURL(file)); // เนเธเธงเนเธฃเธนเธเนเธซเธกเน
    }
  };


  if (loading) return <p>เธเธณเธฅเธฑเธเนเธซเธฅเธ”เธเนเธญเธกเธนเธฅ...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">โ• เน€เธเธดเนเธก/เนเธเนเนเธเน€เธกเธเธน</h2>

      {/* --- ๐‘ (เนเธเนเนเธ) เธเธญเธฃเนเธกเน€เธเธดเนเธกเน€เธกเธเธน --- */}
      <div className="menu-card new-card">
        <h3>เน€เธเธดเนเธกเน€เธกเธเธนเนเธซเธกเน</h3>
        <input
          type="text"
          className="full-row" 
          value={newMenu.name}
          placeholder="เธเธทเนเธญเน€เธกเธเธน"
          onChange={(e) => handleChangeNew("name", e.target.value)}
        />
        <input
          type="number"
          value={newMenu.price}
          placeholder="เธฃเธฒเธเธฒ"
          onChange={(e) => handleChangeNew("price", e.target.value)}
        />
        <select
          value={newMenu.kitchenType}
          onChange={(e) => handleChangeNew("kitchenType", e.target.value)}
        >
          <option value="Ramen">Ramen</option>
          <option value="Fry">Fry</option>
          <option value="Drink">Drink</option>
          <option value="Other">Other</option>
        </select>
        
        {/* (เน€เธเธฅเธตเนเธขเธเน€เธเนเธ type="file") */}
        <input
          type="file"
          className="full-row"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleNewFileChange}
        />
        {/* (เนเธชเธ”เธเธฃเธนเธ Preview) */}
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        
        <button className="add-btn-full" onClick={handleAdd}>
          โ• เน€เธเธดเนเธกเน€เธกเธเธน
        </button>
      </div>

      {/* --- ๐‘ (เนเธเนเนเธ) เธเธญเธฃเนเธกเนเธเนเนเธ --- */}
      {editMenu && (
        <div className="menu-card new-card">
          <h3>โ๏ธ เนเธเนเนเธเน€เธกเธเธน (ID: {editMenu.menuId})</h3>
          <input
            type="text"
            value={editMenu.name}
            onChange={(e) => handleChangeEdit("name", e.target.value)}
          />
          <input
            type="number"
            value={editMenu.price}
            onChange={(e) => handleChangeEdit("price", e.target.value)}
          />
          <input
            type="text"
            value={editMenu.menuId}
            placeholder="Menu ID"
            disabled
          />
          <select
            value={editMenu.kitchenType}
            onChange={(e) => handleChangeEdit("kitchenType", e.g.value)}
          >
            <option value="Ramen">Ramen</option>
            <option value="Fry">Fry</option>
            <option value="Drink">Drink</option>
            <option value="Other">Other</option>
          </select>

          {/* (เน€เธเธฅเธตเนเธขเธเน€เธเนเธ type="file") */}
          <input
            type="file"
            className="full-row"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleEditFileChange}
          />
          {/* (เนเธชเธ”เธเธฃเธนเธ Preview) */}
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}

          <div className="button-group full-row">
            <button onClick={handleSave} className="add-btn">
              ๐’พ เธเธฑเธเธ—เธถเธ
            </button>
            <button onClick={() => setEditMenu(null)} className="delete-btn">
              โ เธขเธเน€เธฅเธดเธ
            </button>
          </div>
        </div>
      )}

      {/* --- ๐‘ (เนเธเนเนเธ) เธ•เธฒเธฃเธฒเธ (เนเธชเธ”เธเธฃเธนเธเธเธฒเธ Backend) --- */}
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>เธเธทเนเธญเน€เธกเธเธน</th>
              <th>เธฃเธฒเธเธฒ</th>
              <th>เธเธฃเธฐเน€เธ เธ—เธเธฃเธฑเธง</th>
              <th>เธฃเธนเธ</th>
              <th>เธเธฑเธ”เธเธฒเธฃ</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((m) => (
              <tr key={m._id}>
                <td>{m.menuId}</td>
                <td>{m.name}</td>
                <td>{m.price}</td>
                <td>{m.kitchenType}</td>
                <td>
                  {m.imageUrl ? (
                    <img
                      // (เธชเธณเธเธฑเธ) เน€เธฃเธฒเธ”เธถเธเธฃเธนเธเธกเธฒเธเธฒเธ Backend เธ—เธตเนเธฃเธฑเธ 'express.static'
                      src={`${BASE_URL}/${m.imageUrl}`} 
                      alt={m.name}
                      style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : "-"}
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(m)}>
                    โ๏ธ เนเธเนเนเธ
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(m.menuId)}>
                    ๐—‘๏ธ เธฅเธ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



