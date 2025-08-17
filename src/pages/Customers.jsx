import React, { useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updated = [...customers];
      updated[editingIndex] = formData;
      setCustomers(updated);
      setEditingIndex(null);
    } else {
      setCustomers([...customers, { ...formData, id: Date.now() }]);
    }
    setFormData({ name: "", phone: "", email: "" });
  };

  const handleEdit = (index) => setFormData(customers[index]) || setEditingIndex(index);
  const handleDelete = (index) => setCustomers(customers.filter((_, i) => i !== index));

  return (
    <div className="container py-4">
      <h2 className="mb-4">Customers Management</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3"><input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="form-control" required/></div>
        <div className="col-md-3"><input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="form-control" required/></div>
        <div className="col-md-3"><input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="form-control" required/></div>
        <div className="col-md-3"><button type="submit" className="btn btn-success w-100">{editingIndex !== null ? "Update" : "Add"}</button></div>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {customers.length === 0 ? <tr><td colSpan="4" className="text-center">No customers found</td></tr> :
            customers.map((c, i) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(i)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i)}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
