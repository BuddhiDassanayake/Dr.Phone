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
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 ">
      <div className="sidebar-header d-flex align-items-center mb-4">
        <i className="bi bi-wrench-adjustable-circle-fill me-2 fs-2"></i>
        <h4 className="fs-4 m-0">Repair Admin</h4>
      </div>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <i className="bi bi-grid-fill"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/repairs"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <i className="bi bi-tools"></i> Repairs
          </NavLink>
        </li>
        
       
      </ul>

      <hr className="my-4 opacity-25" />
      <button className="btn btn-logout w-100 mt-auto py-2" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right me-2"></i> Logout
      </button>
    </div>
  );
}