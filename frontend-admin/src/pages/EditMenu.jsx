import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../styles/EditMenu.css";

const API_URL = "https://silkiepos-project.onrender.com/api/admin/menus";
const BASE_URL = "https://silkiepos-project.onrender.com"; // (ใหม่) สำหรับแสดงรูป

// (ฟังก์ชันสร้าง ID - เหมือนเดิม)
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
  
  // --- 👇 (แก้ไข) State สำหรับฟอร์ม "เพิ่ม" ---
  const [newMenu, setNewMenu] = useState({
    name: "",
    price: "",
    kitchenType: "Ramen",
    imageFile: null, // (เปลี่ยนจาก imageUrl เป็น imageFile)
  });
  const [preview, setPreview] = useState(null); // (ใหม่) สำหรับโชว์รูป
  
  const [editMenu, setEditMenu] = useState(null);
  const [editPreview, setEditPreview] = useState(null); // (ใหม่)

  // (ฟังก์ชัน fetchMenus - เหมือนเดิม)
  const fetchMenus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMenus(response.data);
    } catch (error) {
      console.error("Error fetching menus:", error);
      alert("ไม่สามารถดึงข้อมูลเมนูได้: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // --- 👇 (แก้ไข) ฟังก์ชัน "เพิ่มเมนู" (ใช้ FormData) ---
  const handleAdd = async () => {
    if (!newMenu.name || !newMenu.price || !newMenu.kitchenType) {
      alert("กรุณากรอกข้อมูลให้ครบ (ชื่อ, ราคา, ประเภทครัว)");
      return;
    }
    
    const generatedMenuId = generateNextMenuId(newMenu.kitchenType, menus);

    // 1. (ใหม่) สร้าง FormData
    const formData = new FormData();
    formData.append('menuId', generatedMenuId);
    formData.append('name', newMenu.name);
    formData.append('price', newMenu.price);
    formData.append('kitchenType', newMenu.kitchenType);
    
    // 2. (ใหม่) เพิ่มไฟล์ (ถ้ามี)
    if (newMenu.imageFile) {
      formData.append('image', newMenu.imageFile); // 'image' ต้องตรงกับ `upload.single('image')`
    }

    try {
      // 3. (ใหม่) ส่ง FormData
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert(`เพิ่มเมนูสำเร็จ! (ID: ${generatedMenuId})`);
      setNewMenu({ name: "", price: "", kitchenType: "Ramen", imageFile: null });
      setPreview(null);
      fetchMenus();
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.error);
    }
  };

  // --- 👇 (แก้ไข) ฟังก์ชัน "บันทึกการแก้ไข" (ใช้ FormData) ---
  const handleSave = async () => {
    if (!editMenu) return;

    // 1. (ใหม่) สร้าง FormData
    const formData = new FormData();
    formData.append('name', editMenu.name);
    formData.append('price', editMenu.price);
    formData.append('kitchenType', editMenu.kitchenType);
    
    // 2. (ใหม่) ถ้ามีการเลือกไฟล์ใหม่ (imageFile คือไฟล์ใหม่)
    if (editMenu.imageFile) {
      formData.append('image', editMenu.imageFile);
    }
    // (ถ้าไม่มีไฟล์ใหม่ Backend จะไม่แก้ไข imageUrl เดิม)

    try {
      // 3. (ใหม่) ส่ง FormData
      await axios.put(`${API_URL}/${editMenu.menuId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert("บันทึกการแก้ไขสำเร็จ!");
      setEditMenu(null);
      setEditPreview(null);
      fetchMenus();
    } catch (error) {
      console.error("Error updating menu:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  // --- (ฟังก์ชันเดิม) ---
  const handleDelete = async (menuId) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ที่จะลบเมนู ${menuId}?`)) return;
    try {
      await axios.delete(`${API_URL}/${menuId}`);
      alert("ลบเมนูสำเร็จ!");
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  const handleEdit = (menu) => {
    setEditMenu({ ...menu, imageFile: null }); // เริ่มต้นที่ยังไม่มีไฟล์ใหม่
    setEditPreview(menu.imageUrl ? `${BASE_URL}/${menu.imageUrl}` : null); // แสดงรูปเก่า
  };
  
  const handleChangeNew = (field, value) => {
    setNewMenu({ ...newMenu, [field]: value });
  };
  const handleChangeEdit = (field, value) => {
    setEditMenu({ ...editMenu, [field]: value });
  };

  // (ใหม่) Handler สำหรับอัปโหลดไฟล์ (ฟอร์ม "เพิ่ม")
  const handleNewFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewMenu({ ...newMenu, imageFile: file });
      setPreview(URL.createObjectURL(file)); // สร้าง URL ชั่วคราวสำหรับโชว์
    }
  };
  
  // (ใหม่) Handler สำหรับอัปโหลดไฟล์ (ฟอร์ม "แก้ไข")
  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditMenu({ ...editMenu, imageFile: file });
      setEditPreview(URL.createObjectURL(file)); // โชว์รูปใหม่
    }
  };


  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div className="main-wrapper">
      <h2 className="page-title">➕ เพิ่ม/แก้ไขเมนู</h2>

      {/* --- 👇 (แก้ไข) ฟอร์มเพิ่มเมนู --- */}
      <div className="menu-card new-card">
        <h3>เพิ่มเมนูใหม่</h3>
        <input
          type="text"
          className="full-row" 
          value={newMenu.name}
          placeholder="ชื่อเมนู"
          onChange={(e) => handleChangeNew("name", e.target.value)}
        />
        <input
          type="number"
          value={newMenu.price}
          placeholder="ราคา"
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
        
        {/* (เปลี่ยนเป็น type="file") */}
        <input
          type="file"
          className="full-row"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleNewFileChange}
        />
        {/* (แสดงรูป Preview) */}
        {preview && <img src={preview} alt="Preview" className="menu-preview full-row" />}
        
        <button className="add-btn-full" onClick={handleAdd}>
          ➕ เพิ่มเมนู
        </button>
      </div>

      {/* --- 👇 (แก้ไข) ฟอร์มแก้ไข --- */}
      {editMenu && (
        <div className="menu-card new-card">
          <h3>✏️ แก้ไขเมนู (ID: {editMenu.menuId})</h3>
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

          {/* (เปลี่ยนเป็น type="file") */}
          <input
            type="file"
            className="full-row"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleEditFileChange}
          />
          {/* (แสดงรูป Preview) */}
          {editPreview && <img src={editPreview} alt="Preview" className="menu-preview full-row" />}

          <div className="button-group full-row">
            <button onClick={handleSave} className="add-btn">
              💾 บันทึก
            </button>
            <button onClick={() => setEditMenu(null)} className="delete-btn">
              ❌ ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* --- 👇 (แก้ไข) ตาราง (แสดงรูปจาก Backend) --- */}
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อเมนู</th>
              <th>ราคา</th>
              <th>ประเภทครัว</th>
              <th>รูป</th>
              <th>จัดการ</th>
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
                      // (สำคัญ) เราดึงรูปมาจาก Backend ที่รัน 'express.static'
                      src={`${BASE_URL}/${m.imageUrl}`} 
                      alt={m.name}
                      style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                  ) : "-"}
                </td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(m)}>
                    ✏️ แก้ไข
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(m.menuId)}>
                    🗑️ ลบ
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



