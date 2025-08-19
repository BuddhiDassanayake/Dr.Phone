// src/pages/RepairPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Loader, CheckCircle, XCircle } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

// --- Configuration ---
const API_URL = "http://localhost:5000/api/repairs"; // Your backend server URL

// --- Status Component ---
// A dedicated component to display the status with icons and colors
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: { icon: <Clock size={16} />, color: "warning", text: "Pending" },
    Ongoing: { icon: <Loader size={16} className="animate-spin" />, color: "primary", text: "Ongoing" },
    Completed: { icon: <CheckCircle size={16} />, color: "success", text: "Completed" },
    Rejected: { icon: <XCircle size={16} />, color: "danger", text: "Rejected" },
  };

  const currentStatus = statusConfig[status] || statusConfig.Pending;

  return (
    <span className={`badge bg-${currentStatus.color} d-inline-flex align-items-center`}>
      {currentStatus.icon}
      <span className="ms-2">{currentStatus.text}</span>
    </span>
  );
};

export default function RepairPage() {
  const [repairs, setRepairs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRepair, setEditingRepair] = useState(null);
  const [form, setForm] = useState({
    brand: "",
    model: "",
    service: "",
    issue: "",
    name: "",
    phone: "",
  });

  // Fetch all repairs from the backend
  const fetchRepairs = async () => {
    try {
      const response = await axios.get(API_URL);
      setRepairs(response.data);
    } catch (error) {
      console.error("Error fetching repairs:", error);
      // Here you could add user-facing error handling (e.g., a toast notification)
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle Add or Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const repairData = { ...form };

    try {
      if (editingRepair) {
        // Update existing repair
        await axios.put(`${API_URL}/${editingRepair.id}`, repairData);
      } else {
        // Add new repair
        await axios.post(API_URL, repairData);
      }
      // Reset form and state, then refetch data to show changes
      resetForm();
      await fetchRepairs();
    } catch (error) {
      console.error("Error saving repair:", error);
    }
  };

  // Set up the form for editing
  const handleEdit = (repair) => {
    setEditingRepair(repair);
    setForm(repair);
    setShowForm(true);
  };

  // Delete a repair with confirmation
  const handleRepairDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this repair record?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchRepairs(); // Refetch to update the list
      } catch (error) {
        console.error("Error deleting repair:", error);
      }
    }
  };

  // Update the status of a repair
  const handleStatusChange = async (id, newStatus) => {
    try {
        await axios.put(`${API_URL}/${id}`, { status: newStatus });
        await fetchRepairs(); // Refetch to show the updated status
    } catch (error) {
        console.error("Error updating status:", error);
    }
  };
  
  const resetForm = () => {
    setForm({ brand: "", model: "", service: "", issue: "", name: "", phone: "" });
    setEditingRepair(null);
    setShowForm(false);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#e8f0fe" }}>
      <Sidebar />
      <div className="d-flex flex-column" style={{ flex: 1 }}>
        <Topbar />
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Repairs Management</h4>
           
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">{editingRepair ? "Edit Repair" : "Add New Repair"}</h5>
                    <button type="button" className="btn-close" onClick={resetForm}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      {/* Form fields remain the same */}
                       <div className="row g-3 mb-3">
                         <div className="col-md-6">
                           <label className="form-label fw-semibold">Device Brand *</label>
                           <input type="text" name="brand" value={form.brand} onChange={handleChange} className="form-control" required />
                         </div>
                         <div className="col-md-6">
                           <label className="form-label fw-semibold">Device Model *</label>
                           <input type="text" name="model" value={form.model} onChange={handleChange} className="form-control" required />
                         </div>
                       </div>
                       <div className="mb-3">
                         <label className="form-label fw-semibold">Service Needed *</label>
                         <input type="text" name="service" value={form.service} onChange={handleChange} className="form-control" required />
                       </div>
                       <div className="mb-3">
                         <label className="form-label fw-semibold">Describe the Issue *</label>
                         <textarea name="issue" value={form.issue} onChange={handleChange} className="form-control" rows="3" required></textarea>
                       </div>
                       <div className="row g-3 mb-3">
                         <div className="col-md-6">
                           <label className="form-label fw-semibold">Your Name *</label>
                           <input type="text" name="name" value={form.name} onChange={handleChange} className="form-control" required />
                         </div>
                         <div className="col-md-6">
                           <label className="form-label fw-semibold">Phone Number *</label>
                           <input type="text" name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
                         </div>
                       </div>
                       <div className="text-center mt-4">
                         <button type="submit" className="btn btn-success fw-semibold w-100">{editingRepair ? "Update Repair" : "Add Repair"}</button>
                       </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Repairs Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Status</th>
                      <th>Device</th>
                      <th>Service</th>
                      <th>Customer</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairs.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted p-4">No repairs found.</td>
                      </tr>
                    ) : (
                      repairs.map((r) => (
                        <tr key={r.tracking_id}>
                          <td className="fw-bold">{r.tracking_id}</td>
                          <td><StatusBadge status={r.status} /></td>
                          <td>{r.brand} {r.model}</td>
                          <td>{r.service}</td>
                          <td>{r.name}<br /><small className="text-muted">{r.phone}</small></td>
                          <td>
                            <div className="d-flex align-items-center">
                               <select 
                                 className="form-select form-select-sm me-2" 
                                 value={r.status} 
                                 onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                >
                                <option value="Pending">Pending</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Rejected">Rejected</option>
                               </select>
                               <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(r)}>Edit</button>
                               <button className="btn btn-danger btn-sm" onClick={() => handleRepairDelete(r.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}