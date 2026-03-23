// src/components/RepairTrackingModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Loader } from "lucide-react";
import config from "../config";

export default function RepairTrackingModal() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setTrackingInfo(null);

    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/repairs/track/${trackingId}`
      );
      setTrackingInfo(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Repair not found. Please check your tracking ID.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  const renderStatus = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span style={{ color: "var(--secondary-color)" }} className="d-flex align-items-center fw-bold">
            <Clock className="me-1" size={18} /> Pending
          </span>
        );
      case "ongoing":
        return (
          <span style={{ color: "var(--primary-color)" }} className="d-flex align-items-center fw-bold">
            <Loader className="me-1 animate-spin" size={18} /> Ongoing
          </span>
        );
      case "completed":
        return (
          <span style={{ color: "var(--accent-color)" }} className="d-flex align-items-center fw-bold">
            <CheckCircle className="me-1" size={18} /> Completed
          </span>
        );
      case "rejected":
        return (
          <span className="text-danger d-flex align-items-center fw-bold">
            <XCircle className="me-1" size={18} /> Rejected
          </span>
        );
      default:
        return <span className="fw-bold">{status}</span>;
    }
  };

  return (
    <div
      className="modal fade"
      id="repairTrackingModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        {/* Matches --radius-2xl and --shadow-2xl from your CSS */}
        <div className="modal-content border-0" style={{ borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-2xl)" }}>
          
          <div className="modal-header border-0 pb-0" style={{ padding: "30px 30px 10px" }}>
            <h5 className="modal-title" style={{ fontWeight: "800", color: "var(--text-primary)", fontSize: "1.5rem" }}>
              Track Your <span style={{ color: "var(--primary-color)" }}>Repair</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body" style={{ padding: "30px" }}>
            <form onSubmit={handleTrack}>
              <div className="mb-4">
                <label className="form-label" style={{ fontWeight: "600", color: "var(--text-secondary)", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Tracking ID
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{
                    borderRadius: "var(--radius-lg)",
                    padding: "14px",
                    border: "2px solid var(--border-color)",
                    fontSize: "1rem",
                    transition: "var(--transition-base)"
                  }}
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter your ID (e.g. ABC123)"
                  required
                />
              </div>

              <button 
                className="btn w-100" 
                type="submit"
                style={{
                  background: "var(--gradient-primary)",
                  color: "white",
                  padding: "14px",
                  fontWeight: "700",
                  borderRadius: "var(--radius-lg)",
                  boxShadow: "var(--shadow-md)",
                  border: "none"
                }}
              >
                Track Now
              </button>
            </form>

            {error && (
              <div className="alert alert-danger mt-4 border-0" role="alert" style={{ borderRadius: "var(--radius-md)", fontSize: "0.9rem" }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
              </div>
            )}

            {trackingInfo && (
              <div className="mt-4 p-4 border-0 animate-on-scroll animated" 
                   style={{ 
                     borderRadius: "var(--radius-xl)", 
                     background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
                     border: "1px solid var(--border-color)"
                   }}>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase" }}>Status Update</span>
                    {renderStatus(trackingInfo.status)}
                </div>
                
                <div className="tracking-details">
                  {[
                    { label: "Repair ID", value: trackingInfo.tracking_id },
                    { label: "Device", value: `${trackingInfo.brand} ${trackingInfo.model}` },
                    { label: "Service", value: trackingInfo.service },
                    { label: "Date Added", value: new Date(trackingInfo.created_at).toLocaleDateString() }
                  ].map((item, idx) => (
                    <div key={idx} className="d-flex justify-content-between mb-2">
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{item.label}</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "0.9rem" }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3" style={{ borderTop: "1px dashed var(--border-color)" }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: "600" }}>Reported Issue:</span>
                  <p className="mb-0 mt-1" style={{ color: "var(--text-primary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                    {trackingInfo.issue}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}