// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handleLogout = () => {
    // Clear any auth/session data here
    navigate("/admin"); // redirect to admin login
  };

  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 vh-100 bg-dark text-white">
      <div className="sidebar-header d-flex align-items-center mb-4">
        <i className="bi bi-wrench-adjustable-circle-fill me-2 fs-2"></i>
        <h4 className="fs-4 m-0">Repair Admin</h4>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
          >
            <i className="bi bi-grid-fill me-2"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/repairs"
            className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
          >
            <i className="bi bi-tools me-2"></i> Repairs
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/customers"
            className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
          >
            <i className="bi bi-people-fill me-2"></i> Customers
          </NavLink>
        </li>
        <li>
          <a href="#" className="nav-link text-white" onClick={toggleSettings}>
            <i className="bi bi-gear-fill me-2"></i> Settings
            <i className={`bi bi-chevron-down float-end ${isSettingsOpen ? 'rotate-180' : ''}`}></i>
          </a>
          <div className={`collapse ${isSettingsOpen ? 'show' : ''}`}>
            <ul className="nav flex-column ms-4">
              <li>
                <NavLink
                  to="/admin/settings/profile"
                  className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
                >
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/settings/billing"
                  className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
                >
                  Billing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/settings/security"
                  className={({ isActive }) => `nav-link text-white ${isActive ? "active fw-bold text-success" : ""}`}
                >
                  Security
                </NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <hr />
      <button className="btn btn-danger w-100 mt-auto" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </div>
  );
}
