import React from "react";
import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "250px" }}>
      <h3 className="text-center mb-4">Admin Panel</h3>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/admin" className="nav-link text-white">Dashboard</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/repairs" className="nav-link text-white">Manage Repairs</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/customers" className="nav-link text-white">Manage Customers</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/admin/inventory" className="nav-link text-white">Manage Inventory</Link>
        </li>
        <li className="nav-item mt-4">
          <Link to="/" className="nav-link text-white">Logout</Link>
        </li>
      </ul>
    </div>
  );
}
