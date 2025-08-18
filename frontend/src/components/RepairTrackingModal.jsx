// src/components/RepairTrackingModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { CheckCircle, Clock, XCircle, Loader } from "lucide-react";

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
        `http://localhost:5000/api/repairs/track/${trackingId}`
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

  // Function to return color and icon based on status
  const renderStatus = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="text-warning d-flex align-items-center">
            <Clock className="me-1" size={18} /> Pending
          </span>
        );
      case "ongoing":
        return (
          <span className="text-primary d-flex align-items-center">
            <Loader className="me-1 animate-spin" size={18} /> Ongoing
          </span>
        );
      case "completed":
        return (
          <span className="text-success d-flex align-items-center">
            <CheckCircle className="me-1" size={18} /> Completed
          </span>
        );
      case "rejected":
        return (
          <span className="text-danger d-flex align-items-center">
            <XCircle className="me-1" size={18} /> Rejected
          </span>
        );
      default:
        return <span>{status}</span>;
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
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Track Your Repair</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleTrack}>
              <div className="mb-3">
                <label className="form-label">Enter Tracking ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. ABC123"
                  required
                />
              </div>
              <button className="btn btn-success w-100" type="submit">
                Track
              </button>
            </form>

            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}

            {trackingInfo && (
              <div className="mt-3 p-3 border rounded bg-light">
                <p>
                  <strong>Tracking ID:</strong> {trackingInfo.tracking_id}
                </p>
                <p>
                  <strong>Customer:</strong> {trackingInfo.name}
                </p>
                <p>
                  <strong>Device:</strong> {trackingInfo.brand}{" "}
                  {trackingInfo.model}
                </p>
                <p>
                  <strong>Service:</strong> {trackingInfo.service}
                </p>
                <p>
                  <strong>Issue:</strong> {trackingInfo.issue}
                </p>
                <p>
                  <strong>Status:</strong> {renderStatus(trackingInfo.status)}
                </p>
                <p>
                  <strong>Created At:</strong> {trackingInfo.created_at}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
