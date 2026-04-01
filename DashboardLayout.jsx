import { useState } from "react";
import Dashboard from "./employeesDashboard";
import Products from "./products";
import Orders from "./orders"; // ✅ Add Orders page
import { 
  FaHome, FaSearch, FaUsers, FaLock, FaSignOutAlt, 
  FaBoxes, FaChevronDown, FaChevronRight, FaShoppingCart 
} from "react-icons/fa";
import "../styles/dashboardlayout.css";

export default function DashboardLayout({ onLogout }) {
  const [activePage, setActivePage] = useState("home");
  const [openProducts, setOpenProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    "AI Sensors",
    "Maintenance Robots",
    "IoT Hubs",
    "AR/VR Stations",
    "Climate Controllers",
    "Smart Equipment & Machines"
  ];

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Operations Center</h2>
        <button onClick={() => { setActivePage("home"); setSelectedCategory(null); }}>
          <FaHome /> Home
        </button>
        <button onClick={() => { setActivePage("search"); setSelectedCategory(null); }}>
          <FaSearch /> Search
        </button>
        <button onClick={() => { setActivePage("team"); setSelectedCategory(null); }}>
          <FaUsers /> Team
        </button>

        {/* 🔥 PRODUCTS TREE */}
        <div className="products-tree-container">
          <button className="products-btn" onClick={() => setOpenProducts(!openProducts)}>
            <FaBoxes /> Products {openProducts ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openProducts && (
            <div className="tree">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  className={`tree-category ${selectedCategory === cat ? "active-cat" : ""}`}
                  onClick={() => { setSelectedCategory(cat); setActivePage("products"); }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ORDERS BUTTON */}
        <button onClick={() => { setActivePage("orders"); setSelectedCategory(null); }}>
          <FaShoppingCart /> Orders
        </button>
          <button onClick={() => { setActivePage("chat"); setSelectedCategory(null); }}>
          <FaLock /> Chat
        </button>
        <button onClick={() => { setActivePage("privacy"); setSelectedCategory(null); }}>
          <FaLock /> Privacy
        </button>
        <button className="logout-btn" onClick={onLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
       {activePage === "home" && (
  <div className="dashboard-hero">
    {/* Hero Title */}
    <h1 className="dashboard-title">
      Welcome, Admin
    </h1>

    {/* Subtitle */}
    <p className="dashboard-subtitle">
      All your teams, tasks, and systems in one smart hub.
    </p>
  </div>
)}
        {activePage === "team" && <Dashboard />}
        {activePage === "products" && selectedCategory && (
          <Products selectedCategory={selectedCategory} />
        )}
        {activePage === "products" && !selectedCategory && (
          <p className="select-category-msg">Please select a category from the sidebar to view products</p>
        )}
        {activePage === "orders" && <Orders />} {/* ✅ Orders page */}
      </div>
    </div>
  );
}