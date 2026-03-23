import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import config from "../config";

export default function AdminLoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);

    try {
      const response = await axios.post(`${config.apiBaseUrl}/admin/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Invalid credentials or server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-0 shadow-lg" style={{ width: "400px", borderRadius: "1.25rem", overflow: "hidden" }}>
      {/* Top Accent Bar */}
      <div className="bg-primary" style={{ height: "6px" }}></div>
      
      <div className="card-body p-5">
        <div className="text-center mb-4">
          <div 
            className="d-inline-flex align-items-center justify-content-center bg-light text-primary rounded-circle mb-3"
            style={{ width: "60px", height: "60px" }}
          >
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h3 className="fw-bold text-dark">Admin Access</h3>
          <p className="text-muted small">Please enter your credentials to continue</p>
        </div>

        {error && (
          <div className="alert alert-danger border-0 small fw-semibold mb-4" style={{ borderRadius: "10px" }}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">USERNAME</label>
            <input
              type="text"
              className="form-control border-0 bg-light py-2 shadow-sm"
              placeholder="admin123"
              style={{ borderRadius: "10px" }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-secondary">PASSWORD</label>
            <input
              type="password"
              className="form-control border-0 bg-light py-2 shadow-sm"
              placeholder="••••••••"
              style={{ borderRadius: "10px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-100 py-2 fw-bold shadow-sm"
            style={{ borderRadius: "10px", transition: "0.3s" }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm"></span>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>
      </div>
      
      <div className="card-footer bg-white border-0 text-center pb-4">
        <small className="text-muted">© 2026 Dr. Phone Repair System</small>
      </div>
    </div>
  );
}