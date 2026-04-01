import { useState } from "react";
import axios from "axios";
import Login from "../pages/login";
import DashboardLayout from "./DashboardLayout";
import "../styles/register.css";

export default function AdminRegister() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3636/api/register-admin",
        form
      );
      console.log(res.data);
      setSuccess(true);
      setShowRegister(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Server error");
    }
  };

  // IF AUTHENTICATED → SHOW DASHBOARD
  if (isAuthenticated) {
    return (
      <DashboardLayout
        onLogout={() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }}
      />
    );
  }

  return (
    <div className="platform-right">
      {/* CTA BOX */}
      <div className="cta-box">
        <h2>Get Started </h2>
        <p>Join our platform and manage your business in one click.</p>
        <button className="primary-btn" onClick={() => setShowRegister(true)}>
          Create Admin Account
        </button>
        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => setShowLogin(true)}>Login</span>
        </p>
      </div>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Admin</h2>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="input"
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="input"
              value={form.lastName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input"
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input"
              value={form.password}
              onChange={handleChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="input"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            {error && <p className="error">{error}</p>}
            <button className="register" onClick={handleSubmit}>
              Register
            </button>
            <button
              className="close-btn"
              onClick={() => setShowRegister(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div className="modal-overlay">
          <div className="modal login-modal">
            <Login
              onLoginSuccess={() => setIsAuthenticated(true)}
              hideLeft={true} // hides left-side text in login page
            />
            <button className="close-btn" onClick={() => setShowLogin(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {success && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Admin Registered!</h2>
            <p>The admin account has been created successfully.</p>
            <button className="addBtn" onClick={() => setSuccess(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}