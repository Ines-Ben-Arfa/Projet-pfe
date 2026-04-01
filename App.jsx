import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import Login from "./pages/login";
import DashboardLayout from "./pages/DashboardLayout";
import "./styles/login.css"; // hero text & login styles
import "./styles/employeesDashboard.css"; // dashboard styles

function App() {
  const handleLoginSuccess = () => {
    console.log("Login successful!");
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
}

export default App;