// src/pages/Customers.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { BiEdit, BiTrash } from "react-icons/bi";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [repairs, setRepairs] = useState([]); // optional: store repairs
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", repair: "" });
  const [editingIndex, setEditingIndex] = useState(null);
  const [lastAddedCustomer, setLastAddedCustomer] = useState(null);

  // Handle input changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Generate Tracking ID
  const generateTrackingID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    return `CUST${dateStr}-${random}`;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const trackingID = generateTrackingID();

    if (editingIndex !== null) {
      const updated = [...customers];
      updated[editingIndex] = { ...formData, id: customers[editingIndex].id };
      setCustomers(updated);
      setEditingIndex(null);
      setLastAddedCustomer(null);
    } else {
      const newCustomer = { ...formData, id: trackingID };
      setCustomers([...customers, newCustomer]);
      setLastAddedCustomer(newCustomer);

      // Optional: Add repair automatically with same ID
      if (formData.repair) {
        const newRepair = {
          id: trackingID,
          customer: formData.name,
          phone: formData.phone,
          email: formData.email,
          repair: formData.repair,
          status: "Pending",
        };
        setRepairs([...repairs, newRepair]);
      }

      // Hide popup after 5 seconds
      setTimeout(() => setLastAddedCustomer(null), 5000);
    }

    setFormData({ name: "", phone: "", email: "", repair: "" });
  };

  // Edit customer
  const handleEdit = (index) => {
    setFormData(customers[index]);
    setEditingIndex(index);
  };

  // Delete customer
  const handleDelete = (index) =>
    setCustomers(customers.filter((_, i) => i !== index));

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div className="d-flex flex-column flex-grow-1" style={{ background: "#e8f0fe" }}>
        <div className="container py-4 flex-grow-1">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold text-dark">Customers Management</h2>
            <p className="text-muted">Add, edit, or remove your customers here</p>
          </div>

          {/* Popup Modal Card */}
          {lastAddedCustomer && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
            >
              <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Customer Added!</h5>
                  <button className="btn-close" onClick={() => setLastAddedCustomer(null)}></button>
                </div>
                <p><strong>Customer:</strong> {lastAddedCustomer.name}</p>
                <p><strong>Phone:</strong> {lastAddedCustomer.phone}</p>
                <p><strong>Email:</strong> {lastAddedCustomer.email}</p>
                {lastAddedCustomer.repair && <p><strong>Repair:</strong> {lastAddedCustomer.repair}</p>}
                <p><strong>Tracking ID:</strong> {lastAddedCustomer.id}</p>
                <button
                  className="btn btn-success w-100 mt-2"
                  onClick={() => setLastAddedCustomer(null)}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="form-control"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="repair"
                    value={formData.repair}
                    onChange={handleChange}
                    placeholder="Repair Type (optional)"
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-success w-100 mt-2">
                    {editingIndex !== null ? "Update Customer" : "Add Customer"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Table Card */}
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Tracking ID</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Repair</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted">
                          No customers found
                        </td>
                      </tr>
                    ) : (
                      customers.map((c, i) => (
                        <tr key={c.id}>
                          <td>{i + 1}</td>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{c.phone}</td>
                          <td>{c.email}</td>
                          <td>{c.repair || "-"}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEdit(i)}
                            >
                              <BiEdit /> Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(i)}
                            >
                              <BiTrash /> Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-light text-center p-3" style={{ flexShrink: 0 }}>
          © 2025 My Admin Panel
        </footer>
      </div>
    </div>
  );
}
