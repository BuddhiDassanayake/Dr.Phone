// src/pages/RepairPage.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

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

  // Load repairs from localStorage
  useEffect(() => {
    const updateRepairs = () => {
      const savedRepairs = JSON.parse(localStorage.getItem("repairs") || "[]");
      setRepairs(savedRepairs);
    };

    updateRepairs();
    window.addEventListener("storage", updateRepairs);
    return () => window.removeEventListener("storage", updateRepairs);
  }, []);

  // Handle form input change
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Generate Repair ID
  const generateRepairID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    return `RP${dateStr}-${random}`;
  };

  // Add or Update Repair
  const handleSubmit = (e) => {
    e.preventDefault();
    let updatedRepairs;
    if (editingRepair) {
      // Update existing
      updatedRepairs = repairs.map((r) => (r.id === editingRepair.id ? { ...editingRepair, ...form } : r));
      setEditingRepair(null);
    } else {
      // Add new
      const newRepair = { ...form, id: generateRepairID() };
      updatedRepairs = [...repairs, newRepair];
    }

    setRepairs(updatedRepairs);
    localStorage.setItem("repairs", JSON.stringify(updatedRepairs));
    setForm({ brand: "", model: "", service: "", issue: "", name: "", phone: "" });
    setShowForm(false);
  };

  // Edit repair
  const handleEdit = (repair) => {
    setEditingRepair(repair);
    setForm({ ...repair });
    setShowForm(true);
  };

  // Delete repair
  const handleRepairDelete = (id) => {
    const updatedRepairs = repairs.filter((r) => r.id !== id);
    setRepairs(updatedRepairs);
    localStorage.setItem("repairs", JSON.stringify(updatedRepairs));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#e8f0fe" }}>
      <Sidebar />
      <div className="d-flex flex-column" style={{ flex: 1, minHeight: "100vh" }}>
        <Topbar />
        <main className="flex-grow-1 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold">Repairs Table</h4>
            <button className="btn btn-success" onClick={() => setShowForm(true)}>➕ Add Repair</button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
              <div className="bg-white p-4 rounded-4 shadow-lg" style={{ width: "500px", maxWidth: "95%" }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">{editingRepair ? "Edit Repair" : "Add Repair"}</h4>
                  <button className="btn-close" onClick={() => { setShowForm(false); setEditingRepair(null); }}></button>
                </div>

                <form onSubmit={handleSubmit}>
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
          )}

          {/* Repairs Table */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Repair ID</th>
                      <th>Device Brand</th>
                      <th>Device Model</th>
                      <th>Service Needed</th>
                      <th>Description</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repairs.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted">No repairs found</td>
                      </tr>
                    ) : (
                      repairs.map((r, i) => (
                        <tr key={r.id}>
                          <td>{i + 1}</td>
                          <td>{r.id}</td>
                          <td>{r.brand}</td>
                          <td>{r.model}</td>
                          <td>{r.service}</td>
                          <td>{r.issue}</td>
                          <td>{r.name}</td>
                          <td>{r.phone}</td>
                          <td>
                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(r)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleRepairDelete(r.id)}>Delete</button>
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
