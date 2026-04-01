import AdminRegister from "../pages/adminregister";
import "../styles/WelcomePage.css"; // ✅ NEW FILE

export default function WelcomePage() {
  return (
    <div className="welcome">
      {/* LEFT SIDE */}
      <div className="welcome-left">
  <div className="hero-container">

    {/* Badge */}
    <div className="hero-badge">
       SmartOps
    </div>

    {/* Title */}
    <h1 className="hero-title">
      One platform.
      <br />
      <span>Infinite control.</span>
    </h1>

    {/* Subtitle */}
    <p className="hero-subtitle">
      Manage operations, analytics, and growth — all from a single intelligent system.
    </p>

    {/* Description */}
    <p className="hero-description">
      Designed for modern businesses that demand speed and precision. Automate
      workflows, centralize your data, and gain real-time visibility across your
      entire organization.
    </p>

    {/* Actions */}
    <div className="hero-actions">
      <button className="btn-primary">Start Now</button>
      <button className="btn-outline">See Demo</button>
    </div>

    {/* Stats */}
    <div className="hero-stats">
      <div>
        <h3>+120%</h3>
        <p>Efficiency</p>
      </div>
      <div>
        <h3>-40%</h3>
        <p>Costs</p>
      </div>
      <div>
        <h3>Real-time</h3>
        <p>Insights</p>
          </div>
        </div>
      </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="welcome-right">
        <div className="welcome-card">
          <h2>Start your journey in seconds</h2>

          <AdminRegister />
        </div>
      </div>
    </div>
  );
}