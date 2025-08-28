import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure you have axios installed: npm install axios

export default function AdminLoginCard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Make a POST request to your backend's login endpoint
      const response = await axios.post("http://localhost:3000/api/admin/login", {
        username,
        password,
      });

      // If login is successful (status 200 OK)
      if (response.status === 200) {
        // In a real app, you might store a token or user info here
        navigate("/admin/dashboard"); // Redirect to Dashboard
      }
    } catch (err) {
      // Handle errors from the backend (e.g., 401 Unauthorized)
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Display error message from backend
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="card-title mb-3 text-center">Admin Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#1ABC9C",
              borderColor: "#1ABC9C",
              color: "white"
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}