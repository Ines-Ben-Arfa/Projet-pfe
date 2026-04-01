import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/register.css";

const countries = [
  { name: "Tunisia", code: "+216" },
  { name: "USA", code: "+1" },
  { name: "France", code: "+33" },
  { name: "UK", code: "+44" },
  { name: "Germany", code: "+49" },
  { name: "Italy", code: "+39" },
  { name: "Spain", code: "+34" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Brazil", code: "+55" },
  { name: "India", code: "+91" },
  { name: "China", code: "+86" },
  { name: "Japan", code: "+81" },
  { name: "South Korea", code: "+82" },
  { name: "Russia", code: "+7" },
  { name: "Egypt", code: "+20" },
  { name: "Morocco", code: "+212" },
  { name: "Algeria", code: "+213" },
  { name: "South Africa", code: "+27" },
  { name: "Mexico", code: "+52" },
];

export default function AddEmployeeModal({ closeModal, onEmployeeAdded, editEmployee }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    phone_number: "",
    email: "",
    national_id_card_number: "",
    address1: "",
    address2: "",
    postcode: "",
    avatar: null,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (editEmployee) {
      setForm({
        firstName: editEmployee.firstName || "",
        lastName: editEmployee.lastName || "",
        country: editEmployee.country || "",
        phone_number: editEmployee.phone_number || "",
        email: editEmployee.email || "",
        national_id_card_number: editEmployee.national_id_card_number || "",
        address1: editEmployee.address1 || "",
        address2: editEmployee.address2 || "",
        postcode: editEmployee.postcode || "",
        avatar: null,
      });
    }
  }, [editEmployee]);

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      setForm({ ...form, avatar: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    const { firstName, lastName, country, phone_number, email, national_id_card_number, address1, postcode } = form;
    if (!firstName || !lastName || !country || !phone_number || !email || !national_id_card_number || !address1 || !postcode) {
      return "All required fields must be filled";
    }
    const selectedCountry = countries.find((c) => c.name === country);
    if (selectedCountry && !phone_number.startsWith(selectedCountry.code)) {
      return `Phone number must start with ${selectedCountry.code}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      if (editEmployee) {
        await axios.put(`http://localhost:3636/api/admin/employees/${editEmployee._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        onEmployeeAdded("updated");
      } else {
        await axios.post("http://localhost:3636/api/admin/employees", formData, {
          headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
        });
        onEmployeeAdded("added");
      }
      closeModal();
    } catch (err) {
      setError(err.response?.data?.msg || "Server error");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editEmployee ? "Edit Employee" : "Add Employee"}</h2>

        <input type="text" name="firstName" placeholder="First Name" className="input" value={form.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" className="input" value={form.lastName} onChange={handleChange} />

        <select name="country" className="input" value={form.country} onChange={handleChange}>
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.name} value={c.name}>{c.name} ({c.code})</option>
          ))}
        </select>

        <input type="text" name="phone_number" placeholder="Phone Number" className="input" value={form.phone_number} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} />
        <input type="text" name="national_id_card_number" placeholder="National ID" className="input" value={form.national_id_card_number} onChange={handleChange} />

        {/* ✅ Address Fields */}
        <input type="text" name="address1" placeholder="Address 1" className="input" value={form.address1} onChange={handleChange} />
        <input type="text" name="address2" placeholder="Address 2 (Optional)" className="input" value={form.address2} onChange={handleChange} />
        <input type="text" name="postcode" placeholder="Postcode" className="input" value={form.postcode} onChange={handleChange} />

        <input type="file" name="avatar" onChange={handleChange} />

        {error && <p className="error">{error}</p>}

        <button className="register" onClick={handleSubmit}>{editEmployee ? "Update" : "Add"}</button>
        <button className="addBtn" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
}