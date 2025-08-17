import React, { useState } from "react";

export default function Repairs() {
  const [repairs, setRepairs] = useState([]);
  const [formData, setFormData] = useState({
    customer: "",
    repair: "",
    phone: "",
    email: "",
    status: "Pending", // Default status
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...repairs];
      updated[editingIndex] = formData;
      setRepairs(updated);
      setEditingIndex(null);
    } else {
      const newRepair = { ...formData, id: `RP${Date.now()}` };
      setRepairs([...repairs, newRepair]);
    }
    setFormData({ customer: "", repair: "", phone: "", email: "", status: "Pending" });
  };

  const handleEdit = (i) => {
    setFormData(repairs[i]);
    setEditingIndex(i);
  };

  const handleDelete = (i) => setRepairs(repairs.filter((_, idx) => idx !== i));

  return (
    <div className="container py-4">
      <h2 className="mb-4">Repairs Management</h2>

      {/* Repair Form */}
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-2">
          <input
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Customer Name"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <input
            name="repair"
            value={formData.repair}
            onChange={handleChange}
            placeholder="Repair Type"
            className="form-control"
            required
          />
        </div>
        <div className="col-md-2">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">
            {editingIndex !== null ? "Update" : "Add Repair"}
          </button>
        </div>
      </form>

      {/* Repairs Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Repair ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Repair</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {repairs.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No repairs found</td>
            </tr>
          ) : (
            repairs.map((r, i) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.customer}</td>
                <td>{r.phone}</td>
                <td>{r.email}</td>
                <td>{r.repair}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Pending"
                        ? "bg-warning text-dark"
                        : r.status === "In Progress"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
