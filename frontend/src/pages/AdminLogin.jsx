import React, { useState } from "react";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/dashboard"; // Redirect to admin dashboard
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Server connection failed.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card border-0 shadow-lg p-5 rounded-4" style={{ width: "100%", maxWidth: "450px" }}>
        <div className="text-center mb-4">
          <i className="bi bi-shield-lock text-primary display-4"></i>
          <h3 className="fw-bold mt-2">Admin Portal</h3>
          <p className="text-muted">Login to manage library records.</p>
        </div>

        {error && <div className="alert alert-danger rounded-3 py-2">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-floating mb-3">
            <input type="text" className="form-control rounded-pill" placeholder="Username" 
              onChange={e => setCredentials({...credentials, username: e.target.value})} required />
            <label className="ms-2">Username</label>
          </div>
          
          <div className="form-floating mb-4">
            <input type="password" className="form-control rounded-pill" placeholder="Password" 
              onChange={e => setCredentials({...credentials, password: e.target.value})} required />
            <label className="ms-2">Password</label>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-sm">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}