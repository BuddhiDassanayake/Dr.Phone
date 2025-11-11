// src/components/AddRepairModal.jsx
import React, { useState } from "react";
import axios from "axios";
import config from "../config";

export default function AddRepairModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    service: "",
    issue: "",
    date: "",
    time: "",
    name: "",
    phone: "",
  });

  const [successData, setSuccessData] = useState(null); // To store success response

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the form data to the backend API using Axios POST request
      const response = await axios.post(`${config.apiBaseUrl}/repairs`, form);

      // Notify parent component about new repair
      onAdd(response.data);

      // Store success data for popup
      setSuccessData(response.data);

      // Reset form
      setForm({
        brand: "",
        model: "",
        service: "",
        issue: "",
        date: "",
        time: "",
        name: "",
        phone: "",
      });

      console.log("Repair added:", response.data);
    } catch (error) {
      console.error("Error adding repair:", error);
      alert("Failed to submit repair. Please try again.");
    }
  };

  // Handler to close the success popup and the main modal
  const handleCloseSuccess = () => {
    setSuccessData(null);
    onClose();
  };

  return (
    <div
     // Styling for the modal backdrop
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
      // Styling for the modal content card
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "500px", maxWidth: "95%" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Book Your Repair</h4>
          {/*Close Button */}
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Device Brand *</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Device Model *</label>
              <input
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Service Needed *</label>
            <input
              type="text"
              name="service"
              value={form.service}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Describe the Issue *</label>
            <textarea
              name="issue"
              value={form.issue}
              onChange={handleChange}
              className="form-control"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Your Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="text-center mt-4">

            <button
              type="submit"
              className="btn btn-success fw-semibold w-100"
            >
              Add Repair
            </button>
            
          </div>
        </form>
      </div>

      {/*  Success Popup Card */}
      {successData && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1100 }}
        >
          <div className="bg-white p-4 rounded-4 shadow-lg text-center"
            style={{ width: "400px" }}
          >
            <h5 className="fw-bold text-success mb-3">✅ Repair Added Successfully!</h5>
            <p><strong>Tracking ID:</strong> {successData.tracking_id}</p>
            <p><strong>Brand:</strong> {successData.brand}</p>
            <p><strong>Model:</strong> {successData.model}</p>
            <p><strong>Service:</strong> {successData.service}</p>
            <p><strong>Name:</strong> {successData.name}</p>
            <p><strong>Phone:</strong> {successData.phone}</p>

            <button className="btn btn-success mt-3 w-100" onClick={handleCloseSuccess}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
