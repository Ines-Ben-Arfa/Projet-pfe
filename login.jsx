import { useState } from "react";
import axios from "axios";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

export default function Login({ onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(
        "http://localhost:3636/api/auth/admin/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      onLoginSuccess();
      navigate("/dashboard"); // redirect to DashboardLayout
    } catch (err) {
      setError(err.response?.data.msg || "Server error");
    }
  };

  return (
    <div className="platform-right" style={{ flex: 1, margin: "auto", maxWidth: "400px" }}>
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>Welcome Back 👋</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}