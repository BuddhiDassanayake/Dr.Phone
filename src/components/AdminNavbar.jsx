import React from "react";

export default function AdminNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Welcome, Admin</span>
        <div className="d-flex align-items-center">
          <span className="me-3">Profile</span>
          <img src="https://via.placeholder.com/40" alt="profile" className="rounded-circle" />
        </div>
      </div>
    </nav>
  );
}
