// src/components/RepairTrackingModal.jsx
import React, { useState } from "react"; //for managing component state
import axios from "axios"; //for making http requests to the backend
import { CheckCircle, Clock, XCircle, Loader } from "lucide-react";

import config from "../config";

export default function RepairTrackingModal() {
  const [trackingId, setTrackingId] = useState(""); //store the tracking ID entered by the user
  const [trackingInfo, setTrackingInfo] = useState(null); //Stores the repair detail fetched from the API
  const [error, setError] = useState("");


  //to handle the tracking submission
  const handleTrack = async (e) => {
    e.preventDefault();
    setError("");
    setTrackingInfo(null);

    try {
      //Make the GET req to the backend API to fetch repair details
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
      className="modal fade"  // Bootstrap classes for a modal with a fade animation
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
            <form onSubmit={handleTrack}>   {/* Form for tracking ID input */}
              <div className="mb-3">
                <label className="form-label">Enter Tracking ID</label>
                <input
                  type="text"
                  className="form-control"  // Bootstrap form control style
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

{/* Conditional rendering for error messages */}
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
