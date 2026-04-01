import { useEffect, useState } from "react";
import axios from "axios";
import AddEmployeeModal from "../components/addemployeemodal";
import PopUp from "../components/PopUp";
import "../styles/employeesDashboard.css";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [search, setSearch] = useState("");
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchEmployees = async (pageNumber = 1) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:3636/api/admin/employees?page=${pageNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmployees(res.data?.employees || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.msg || err.message || "Error fetching employees");
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(page);
  }, [page]);

  const handleDelete = (id) => {
    setSuccessMessage("");
    setDeleteId(id); // open PopUp
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3636/api/admin/employees/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null); // 🔥 CLOSE FIRST
      fetchEmployees(page);
      setSuccessMessage("🗑️ Employee Deleted Successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete employee");
    }
  };

  const handleEdit = (employee) => {
    setEditEmployee(employee);
    setShowModal(true);
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.firstName.toLowerCase().includes(search.toLowerCase()) ||
      e.lastName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>WELCOME TO THE EMPLOYEES BOARD</h1>
        <button
          className="floating-addBtn"
          onClick={() => { setEditEmployee(null); setShowModal(true); }}
        >
          +
        </button>
      </div>

      <input
        type="text"
        placeholder="Search employees..."
        className="search-bar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading employees...</p>}

      <div className="employees-grid">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((emp) => (
            <div className="employee-card" key={emp._id}>
              <div className="employee-top">
                <img
                  src={emp.avatar ? `http://localhost:3636/uploads/${emp.avatar}` : "/default-avatar.png"}
                  alt="avatar"
                  className="avatar"
                />
                <div>
                  <h3>{emp.firstName} {emp.lastName}</h3>
                  <span className="country">{emp.country}</span>
                </div>
              </div>

             <div className="employee-details">
  <p>📞 {emp.phone_number}</p>
  <p>✉️ {emp.email}</p>
  <p>🪪 {emp.national_id_card_number}</p>
  <p>🏠 {emp.address1}{emp.address2 ? `, ${emp.address2}` : ""}</p>
  <p>📮 {emp.postcode}</p>
</div>

              <div className="employee-actions">
                <button className="edit" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : !loading ? (
          <p>No employees found.</p>
        ) : null}
      </div>

      <div className="pagination">
        <button className="page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button className="page-btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {showModal && (
        <AddEmployeeModal
          closeModal={() => setShowModal(false)}
          editEmployee={editEmployee}
          onEmployeeAdded={(type) => {
            setSuccessMessage(""); // 🔥 reset first
            fetchEmployees(page);
            if (type === "updated") {
              setSuccessMessage("✅ Employee Updated Successfully!");
            } else {
              setSuccessMessage("🎉 Employee Added Successfully!");
            }
          }}
        />
      )}

      {deleteId && (
        <PopUp
          message="Are you sure you want to delete this employee?"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {successMessage && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{successMessage}</h2>
            <button className="addBtn" onClick={() => setSuccessMessage("")}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}