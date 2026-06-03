import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [newIssue, setNewIssue] = useState({ book_title: "", author: "", member_name: "", member_email: "", due_date: "" });

  // Fetch Data
  const fetchIssues = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/issues");
      const data = await res.json();
      setIssues(data);
    } catch (err) {
      console.error("Failed to fetch issues", err);
    }
  };

  useEffect(() => {
    // Basic Auth Check
    if (!localStorage.getItem("adminToken")) {
      window.location.href = "/admin"; // Redirect to login
    }
    fetchIssues();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  };

  // Add Record
  const handleAddIssue = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3000/api/issues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIssue),
    });
    setNewIssue({ book_title: "", author: "", member_name: "", member_email: "", due_date: "" });
    document.getElementById("closeModalBtn").click();
    fetchIssues();
  };

  // Delete Record
  const handleDelete = async (id) => {
    if(window.confirm("Are you sure you want to delete this record?")) {
      await fetch(`http://localhost:3000/api/issues/${id}`, { method: "DELETE" });
      fetchIssues();
    }
  };

  // Update Status
  const handleStatusChange = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Borrowed" ? "Returned" : "Borrowed";
    await fetch(`http://localhost:3000/api/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    fetchIssues();
  };

  return (
    <div className="bg-light min-vh-100">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold" href="#"><i className="bi bi-book-half me-2"></i>EduLib Admin</a>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm rounded-pill px-3">Logout</button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold text-dark m-0">Library Records</h3>
          <button className="btn btn-primary shadow-sm rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#addModal">
            <i className="bi bi-plus-lg me-2"></i> Issue Book
          </button>
        </div>

        {/* Data Table */}
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tracking ID</th>
                  <th>Book Title</th>
                  <th>Member</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(issue => (
                  <tr key={issue.id}>
                    <td><span className="badge bg-secondary">{issue.tracking_id}</span></td>
                    <td className="fw-bold">{issue.book_title} <br/><small className="text-muted fw-normal">{issue.author}</small></td>
                    <td>{issue.member_name} <br/><small className="text-muted">{issue.member_email}</small></td>
                    <td>{issue.due_date}</td>
                    <td>
                      <span className={`badge rounded-pill ${issue.status === 'Returned' ? 'bg-success' : issue.status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <button onClick={() => handleStatusChange(issue.id, issue.status)} className="btn btn-sm btn-outline-primary rounded-pill me-2">
                        {issue.status === "Borrowed" ? "Mark Returned" : "Mark Borrowed"}
                      </button>
                      <button onClick={() => handleDelete(issue.id)} className="btn btn-sm btn-outline-danger rounded-circle">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
                {issues.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No records found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Issue Modal */}
      <div className="modal fade" id="addModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-4 shadow">
            <div className="modal-header border-0 bg-light">
              <h5 className="modal-title fw-bold">Issue New Book</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" id="closeModalBtn"></button>
            </div>
            <div className="modal-body p-4">
              <form onSubmit={handleAddIssue}>
                <div className="mb-3"><input type="text" className="form-control" placeholder="Book Title" required value={newIssue.book_title} onChange={e => setNewIssue({...newIssue, book_title: e.target.value})} /></div>
                <div className="mb-3"><input type="text" className="form-control" placeholder="Author" required value={newIssue.author} onChange={e => setNewIssue({...newIssue, author: e.target.value})} /></div>
                <div className="mb-3"><input type="text" className="form-control" placeholder="Member Name" required value={newIssue.member_name} onChange={e => setNewIssue({...newIssue, member_name: e.target.value})} /></div>
                <div className="mb-3"><input type="email" className="form-control" placeholder="Member Email" required value={newIssue.member_email} onChange={e => setNewIssue({...newIssue, member_email: e.target.value})} /></div>
                <div className="mb-4"><label className="form-label text-muted small">Due Date</label><input type="date" className="form-control" required value={newIssue.due_date} onChange={e => setNewIssue({...newIssue, due_date: e.target.value})} /></div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">Submit Record</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}