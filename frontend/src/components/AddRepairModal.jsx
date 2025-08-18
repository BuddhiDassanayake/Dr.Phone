// src/components/AddRepairModal.jsx
import React, { useState } from "react";
import axios from "axios";

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

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send form data to API
      const response = await axios.post("http://localhost:5000/api/repairs", form);
      
      // Notify parent component about new repair
      onAdd(response.data);

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

      // Close modal
      onClose();
      
      console.log("Repair added:", response.data);
    } catch (error) {
      console.error("Error adding repair:", error);
      alert("Failed to submit repair. Please try again.");
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
    >
      <div
        className="bg-white p-4 rounded-4 shadow-lg"
        style={{ width: "500px", maxWidth: "95%" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold mb-0">Book Your Repair</h4>
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
    </div>
  );
}
