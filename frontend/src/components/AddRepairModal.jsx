import React, { useState } from "react";
import axios from "axios";
import config from "../config";

const BRANDS = ["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "Vivo", "Google", "Other"];
const MODELS = ["iPhone 15 Pro", "iPhone 14", "S24 Ultra", "S23", "Pixel 8", "Note 13 Pro", "Other"];
const SERVICES = [
  "Screen Replacement", 
  "Battery Replacement", 
  "Charging Port Repair", 
  "Water Damage", 
  "Software/Unlocking", 
  "Motherboard Repair"
];

export default function AddRepairModal({ show, onClose, onAdd }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    service: "",
    issue: "",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (!show) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${config.apiBaseUrl}/repairs`, form);
      onAdd(response.data);
      setSuccessData(response.data);
      
      setForm({
        brand: "", model: "", service: "", issue: "",
        date: new Date().toISOString().split("T")[0],
        time: "", name: "", phone: "",
      });
    } catch (error) {
      alert("Error: Could not save repair.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{ background: "rgba(15, 23, 42, 0.9)", zIndex: 1050, backdropFilter: "blur(12px)" }}
    >
      {!successData ? (
        <div className="bg-white rounded-4 shadow-lg border-0 overflow-hidden" 
             style={{ width: "580px", maxWidth: "95%", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
          
          {/* Header - Fixed */}
          <div className="bg-primary p-4 text-white d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0">🛠️ New Repair Ticket</h4>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="p-4 bg-light overflow-auto">
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Brand</label>
                <select name="brand" className="form-select border-0 shadow-sm py-2" value={form.brand} onChange={handleChange} required>
                  <option value="">Select Brand</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Model</label>
                <select name="model" className="form-select border-0 shadow-sm py-2" value={form.model} onChange={handleChange} required>
                  <option value="">Select Model</option>
                  {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Service Required</label>
              <select name="service" className="form-select border-0 shadow-sm py-2" value={form.service} onChange={handleChange} required>
                <option value="">Choose Service...</option>
                {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Date</label>
                <input type="date" name="date" className="form-control border-0 shadow-sm" value={form.date} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Time</label>
                <input type="time" name="time" className="form-control border-0 shadow-sm" value={form.time} onChange={handleChange} required />
              </div>
            </div>

            <div className="row g-3 mb-4 border-top pt-4">
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Customer Name</label>
                <input type="text" name="name" className="form-control border-0 shadow-sm py-2" placeholder="Full Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                <input type="tel" name="phone" className="form-control border-0 shadow-sm py-2" placeholder="07XXXXXXXX" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Issue Description</label>
              <textarea name="issue" className="form-control border-0 shadow-sm" rows="3" placeholder="Describe the fault..." value={form.issue} onChange={handleChange} required></textarea>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-100 py-3 fw-bold rounded-3 shadow text-uppercase">
              {loading ? "SAVING..." : "CONFIRM REPAIR JOB"}
            </button>
          </form>
        </div>
      ) : (
        /* HIGHLIGHTED TRACKING ID SCREEN */
        <div className="bg-white rounded-5 shadow-lg p-5 text-center animate__animated animate__zoomIn" style={{ width: "450px" }}>
          <div className="display-1 text-success mb-3">✅</div>
          <h2 className="fw-black text-dark">JOB SAVED</h2>
          <p className="text-muted">Customer: <strong>{successData.name}</strong></p>

          <div className="my-4 py-4 px-2 rounded-4" style={{ background: "#f8fafc", border: "3px dashed #cbd5e1" }}>
            <span className="text-primary small fw-bold text-uppercase d-block mb-2">Tracking Number</span>
            <h1 className="display-3 fw-bold text-dark font-monospace mb-0" style={{ letterSpacing: "4px" }}>
              {successData.tracking_id}
            </h1>
          </div>

          <button className="btn btn-dark btn-lg w-100 rounded-pill py-3 fw-bold shadow mt-2" onClick={() => { setSuccessData(null); onClose(); }}>
            BACK TO DASHBOARD
          </button>
        </div>
      )}
    </div>
  );
}