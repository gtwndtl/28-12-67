import React, { useState } from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import cruise_ship_logo from "../../../assets/cruise_ship_logo.jpg";
import "./index.css"; // นำ CSS เข้ามาใช้

const Navbar: React.FC = () => {
  const [active, setActive] = useState("home");

  const handleButtonClick = (section: string) => {
    setActive(section);
  };

  return (
    <Layout.Header className="navbaradmin">
      <div className="navbaradmin-logo">
        <img src={cruise_ship_logo} alt="Logo" className="navbaradmin-logo-image" />
        <h1 className="navbaradmin-logo-text">Cruise Ship</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/promotion">
          <button
            className={`navbaradmin-button ${active === "Promotion" ? "active" : ""}`}
            onClick={() => handleButtonClick("Promotion")}
          >
            Promotion
          </button>
        </Link>
        <Link to="/review">
          <button
            className={`navbaradmin-button ${active === "review" ? "active" : ""}`}
            onClick={() => handleButtonClick("review")}
          >
            Review
          </button>
        </Link>
        <Link to="/login/food-service/order">
          <button
            className={`navbaradmin-button ${active === "Food-Service" ? "active" : ""}`}
            onClick={() => handleButtonClick("Food-Service")}
          >
            Food-Service
          </button>
        </Link>
        <Link to="/contact">
          <button
            className={`navbaradmin-button ${active === "contact" ? "active" : ""}`}
            onClick={() => handleButtonClick("contact")}
          >
            Contact Me
          </button>
        </Link>
      </div>
      <div className="navbaradmin-icons">
        <i className="navbaradmin-icon search-icon">🔍</i>
        <i className="navbaradmin-icon profile-icon">👤</i>
      </div>
    </Layout.Header>
  );
};

export default Navbar;
