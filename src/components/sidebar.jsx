import React from "react";
import { NavLink } from "react-router-dom";
import './Sidebar.css';

export default function Sidebar() {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100">
      <h4 className="mb-4">Repair Admin</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/admin" className="nav-link text-white" activeClassName="active">
            <i className="bi bi-grid-1x2-fill me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/repairs" className="nav-link text-white" activeClassName="active">
            <i className="bi bi-tools me-2"></i>
            Repairs
          </NavLink>
        </li>
        <li>
          <NavLink to="/users" className="nav-link text-white" activeClassName="active">
            <i className="bi bi-people-fill me-2"></i>
            Customers
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings" className="nav-link text-white" activeClassName="active">
            <i className="bi bi-gear-fill me-2"></i>
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}