import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/Staff.css"; //

// (เนเธซเธกเน) API URL
const API_URL = "https://silkiepos-project.onrender.com/api/admin/employees";

export default function Staff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // (เนเธเนเนเธ) เธเธฃเธฑเธ State เนเธซเนเธ•เธฃเธเธเธฑเธ Model
  const [newEmp, setNewEmp] = useState({
    employeeId: "",
    name: "",
    username: "",
    password: "",
    role: "Staff",
  });

  const [editEmp, setEditEmp] = useState(null); // State เธชเธณเธซเธฃเธฑเธเธเธญเธฃเนเธกเนเธเนเนเธ

  // --- (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธเธ”เธถเธเธเนเธญเธกเธนเธฅเธเธเธฑเธเธเธฒเธ ---
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      alert("เนเธกเนเธชเธฒเธกเธฒเธฃเธ–เธ”เธถเธเธเนเธญเธกเธนเธฅเธเธเธฑเธเธเธฒเธเนเธ”เน: " + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChangeNew = (field, value) =>
    setNewEmp({ ...newEmp, [field]: value });

  // --- (เนเธเนเนเธ) เธเธฑเธเธเนเธเธฑเธ "เน€เธเธดเนเธกเธเธเธฑเธเธเธฒเธ" (เน€เธฃเธตเธขเธ API POST) ---
  const handleAdd = async () => {
    if (!newEmp.employeeId || !newEmp.name || !newEmp.username || !newEmp.password || !newEmp.role) {
      alert("เธเธฃเธธเธ“เธฒเธเธฃเธญเธเธเนเธญเธกเธนเธฅเนเธซเนเธเธฃเธ");
      return;
    }
    try {
      await axios.post(API_URL, newEmp);
      alert("เน€เธเธดเนเธกเธเธเธฑเธเธเธฒเธเธชเธณเน€เธฃเนเธ!");
      setNewEmp({ employeeId: "", name: "", username: "", password: "", role: "Staff" });
      fetchEmployees();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  // --- (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธ "เธฅเธเธเธเธฑเธเธเธฒเธ" (เน€เธฃเธตเธขเธ API DELETE) ---
  const handleDelete = async (id) => {
    if (!window.confirm("เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเธเธเธฑเธเธเธฒเธเธเธเธเธตเน?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("เธฅเธเธเธเธฑเธเธเธฒเธเธชเธณเน€เธฃเนเธ!");
      fetchEmployees();
      if (editEmp?._id === id) setEditEmp(null);
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  const handleEdit = (emp) => {
    // (เธ•เธฑเนเธเธเนเธฒ password เน€เธเนเธเธเนเธฒเธงเนเธฒเธ เน€เธเธทเนเธญเนเธซเนเธเธฃเธญเธเนเธซเธกเน เธซเธฃเธทเธญเนเธกเนเธเธฃเธญเธเธเนเนเธ”เน)
    setEditEmp({ ...emp, password: "" });
  };

  // --- (เนเธซเธกเน) เธเธฑเธเธเนเธเธฑเธ "เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธเนเนเธ" (เน€เธฃเธตเธขเธ API PUT) ---
  const handleSaveEdit = async () => {
    if (!editEmp) return;
    
    // (เน€เธฃเธฒเธเธฐเธชเนเธ password เนเธเธเนเธ•เนเธญเน€เธกเธทเนเธญเธกเธตเธเธฒเธฃเธเธดเธกเธเนเนเธซเธกเนเน€เธ—เนเธฒเธเธฑเนเธ)
    const dataToSend = { ...editEmp };
    if (!dataToSend.password) {
      delete dataToSend.password; // เธ–เนเธฒ password เธงเนเธฒเธ เนเธซเนเธฅเธเธญเธญเธ (Backend เธเธฐเนเธ”เนเนเธกเน Hash เธฃเธซเธฑเธชเธงเนเธฒเธ)
    }

    try {
      await axios.put(`${API_URL}/${editEmp._id}`, dataToSend);
      alert("เธเธฑเธเธ—เธถเธเธเธฒเธฃเนเธเนเนเธเธชเธณเน€เธฃเนเธ!");
      setEditEmp(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("เน€เธเธดเธ”เธเนเธญเธเธดเธ”เธเธฅเธฒเธ”: " + error.response?.data?.message);
    }
  };

  return (
    <div className="employees-container">
      <h2>๐‘ฉโ€๐’ผ เธเธฑเธ”เธเธฒเธฃเธเธเธฑเธเธเธฒเธ</h2>

      {/* --- (เนเธเนเนเธ) FORM ADD --- */}
      <div className="form-card">
        <h3>โ• เน€เธเธดเนเธกเธเธเธฑเธเธเธฒเธเนเธซเธกเน</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Employee ID (เน€เธเนเธ E001)"
            value={newEmp.employeeId}
            onChange={(e) => handleChangeNew("employeeId", e.target.value)}
          />
          <input
            type="text"
            placeholder="เธเธทเนเธญเธเธเธฑเธเธเธฒเธ"
            value={newEmp.name}
            onChange={(e) => handleChangeNew("name", e.target.value)}
          />
          <input
            type="text"
            placeholder="Username (เธชเธณเธซเธฃเธฑเธ Login)"
            value={newEmp.username}
            onChange={(e) => handleChangeNew("username", e.target.value)}
          />
          <input
            type="text"
            placeholder="Password (เธชเธณเธซเธฃเธฑเธ Login)"
            value={newEmp.password}
            onChange={(e) => handleChangeNew("password", e.target.value)}
          />
          <select
            value={newEmp.role}
            onChange={(e) => handleChangeNew("role", e.target.value)}
          >
            <option value="Staff">Staff (เธซเธเนเธฒเธฃเนเธฒเธ)</option>
            <option value="Kitchen_Ramen">Kitchen (เธเธฃเธฑเธงเธฃเธฒเน€เธกเธ)</option>
            <option value="Kitchen_Fry">Kitchen (เธเธฃเธฑเธงเธ—เธญเธ”)</option>
            <option value="Admin">Admin (เธเธนเนเธ”เธนเนเธฅ)</option>
          </select>
        </div>
        <button className="btn-primary" onClick={handleAdd}> โ• เน€เธเธดเนเธก </button>
      </div>

      {/* --- (เนเธเนเนเธ) TABLE --- */}
      <div className="table-card">
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>เธเธทเนเธญ</th>
              <th>เธ•เธณเนเธซเธเนเธ (Role)</th>
              <th>Username</th>
              <th>เธเธฑเธ”เธเธฒเธฃ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5">เธเธณเธฅเธฑเธเนเธซเธฅเธ”...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan="5">เนเธกเนเธเธเธเนเธญเธกเธนเธฅเธเธเธฑเธเธเธฒเธ</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name}</td>
                  <td>{emp.role}</td>
                  <td>{emp.username}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(emp)}>
                      โ๏ธ เนเธเนเนเธ
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(emp._id)} // (เนเธเน _id เธเธญเธ MongoDB)
                    >
                      ๐—‘๏ธ เธฅเธ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- (เนเธเนเนเธ) EDIT FORM --- */}
      {editEmp && (
        <div className="form-card edit-form">
          <h3>โ๏ธ เนเธเนเนเธเธเธเธฑเธเธเธฒเธ: {editEmp.name}</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Employee ID (เน€เธเนเธ E001)"
              value={editEmp.employeeId}
              onChange={(e) =>
                setEditEmp({ ...editEmp, employeeId: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="เธเธทเนเธญเธเธเธฑเธเธเธฒเธ"
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
              placeholder="เธเธฃเธญเธเน€เธเธทเนเธญเธ•เธฑเนเธเธฃเธซเธฑเธชเธเนเธฒเธเนเธซเธกเน"
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
              <option value="Staff">Staff (เธซเธเนเธฒเธฃเนเธฒเธ)</option>
              <option value="Kitchen_Ramen">Kitchen (เธเธฃเธฑเธงเธฃเธฒเน€เธกเธ)</option>
              <option value="Kitchen_Fry">Kitchen (เธเธฃเธฑเธงเธ—เธญเธ”)</option>
              <option value="Admin">Admin (เธเธนเนเธ”เธนเนเธฅ)</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleSaveEdit}>
            ๐’พ เธเธฑเธเธ—เธถเธ
          </button>
          <button className="btn-cancel" onClick={() => setEditEmp(null)}>
            โ เธขเธเน€เธฅเธดเธ
          </button>
        </div>
      )}
    </div>
  );
}



