import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/Staff.css"; //

// (ใหม่) API URL
const API_URL = "http://localhost:3000/api/admin/employees";

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // (แก้ไข) ปรับ State ให้ตรงกับ Model
  const [newEmp, setNewEmp] = useState({
    employeeId: "",
    name: "",
    username: "",
    password: "",
    role: "Staff",
  });

  const [editEmp, setEditEmp] = useState(null); // State สำหรับฟอร์มแก้ไข

  // --- (ใหม่) ฟังก์ชันดึงข้อมูลพนักงาน ---
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("ไม่สามารถดึงข้อมูลพนักงานได้: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChangeNew = (field, value) =>
    setNewEmp({ ...newEmp, [field]: value });

  // --- (แก้ไข) ฟังก์ชัน "เพิ่มพนักงาน" (เรียก API POST) ---
  const handleAdd = async () => {
    if (!newEmp.employeeId || !newEmp.name || !newEmp.username || !newEmp.password || !newEmp.role) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    try {
      await axios.post(API_URL, newEmp);
      alert("เพิ่มพนักงานสำเร็จ!");
      setNewEmp({ employeeId: "", name: "", username: "", password: "", role: "Staff" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  // --- (ใหม่) ฟังก์ชัน "ลบพนักงาน" (เรียก API DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบพนักงานคนนี้?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("ลบพนักงานสำเร็จ!");
      fetchEmployees();
      if (editEmp?._id === id) setEditEmp(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  const handleEdit = (emp) => {
    // (ตั้งค่า password เป็นค่าว่าง เพื่อให้กรอกใหม่ หรือไม่กรอกก็ได้)
    setEditEmp({ ...emp, password: "" });
  };

  // --- (ใหม่) ฟังก์ชัน "บันทึกการแก้ไข" (เรียก API PUT) ---
  const handleSaveEdit = async () => {
    if (!editEmp) return;
    
    // (เราจะส่ง password ไปก็ต่อเมื่อมีการพิมพ์ใหม่เท่านั้น)
    const dataToSend = { ...editEmp };
    if (!dataToSend.password) {
      delete dataToSend.password; // ถ้า password ว่าง ให้ลบออก (Backend จะได้ไม่ Hash รหัสว่าง)
    }

    try {
      await axios.put(`${API_URL}/${editEmp._id}`, dataToSend);
      alert("บันทึกการแก้ไขสำเร็จ!");
      setEditEmp(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("เกิดข้อผิดพลาด: " + error.response?.data?.message);
    }
  };

  return (
    <div className="employees-container">
      <h2>👩‍💼 จัดการพนักงาน</h2>

      {/* --- (แก้ไข) FORM ADD --- */}
      <div className="form-card">
        <h3>➕ เพิ่มพนักงานใหม่</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Employee ID (เช่น E001)"
            value={newEmp.employeeId}
            onChange={(e) => handleChangeNew("employeeId", e.target.value)}
          />
          <input
            type="text"
            placeholder="ชื่อพนักงาน"
            value={newEmp.name}
            onChange={(e) => handleChangeNew("name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Username (สำหรับ Login)"
            value={newEmp.username}
            onChange={(e) => handleChangeNew("username", e.target.value)}
          />
          <input
            type="text"
            placeholder="Password (สำหรับ Login)"
            value={newEmp.password}
            onChange={(e) => handleChangeNew("password", e.target.value)}
          />
          <select
            value={newEmp.role}
            onChange={(e) => handleChangeNew("role", e.target.value)}
          >
            <option value="Staff">Staff (หน้าร้าน)</option>
            <option value="Kitchen_Ramen">Kitchen (ครัวราเมง)</option>
            <option value="Kitchen_Fry">Kitchen (ครัวทอด)</option>
            <option value="Admin">Admin (ผู้ดูแล)</option>
          </select>
        </div>
        <button className="btn-primary" onClick={handleAdd}> ➕ เพิ่ม </button>
      </div>

      {/* --- (แก้ไข) TABLE --- */}
      <div className="table-card">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>ชื่อ</th>
              <th>ตำแหน่ง (Role)</th>
              <th>Username</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">กำลังโหลด...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="5">ไม่พบข้อมูลพนักงาน</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.username}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(emp)}>
                      ✏️ แก้ไข
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(emp._id)} // (ใช้ _id ของ MongoDB)
                    >
                      🗑️ ลบ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- (แก้ไข) EDIT FORM --- */}
      {editEmp && (
        <div className="form-card edit-form">
          <h3>✏️ แก้ไขพนักงาน: {editEmp.name}</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID (เช่น E001)"
              value={editEmp.employeeId}
              onChange={(e) =>
                setEditEmp({ ...editEmp, employeeId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="ชื่อพนักงาน"
              value={editEmp.name}
              onChange={(e) =>
                setEditEmp({ ...editEmp, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Username"
              value={editEmp.username}
              onChange={(e) =>
                setEditEmp({ ...editEmp, username: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="กรอกเพื่อตั้งรหัสผ่านใหม่"
              value={editEmp.password}
              onChange={(e) =>
                setEditEmp({ ...editEmp, password: e.target.value })
              }
            />
            <select
              value={editEmp.role}
              onChange={(e) =>
                setEditEmp({ ...editEmp, role: e.target.value })
              }
            >
              <option value="Staff">Staff (หน้าร้าน)</option>
              <option value="Kitchen_Ramen">Kitchen (ครัวราเมง)</option>
              <option value="Kitchen_Fry">Kitchen (ครัวทอด)</option>
              <option value="Admin">Admin (ผู้ดูแล)</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleSaveEdit}>
            💾 บันทึก
          </button>
          <button className="btn-cancel" onClick={() => setEditEmp(null)}>
            ❌ ยกเลิก
          </button>
        </div>
      )}
    </div>
  );
}