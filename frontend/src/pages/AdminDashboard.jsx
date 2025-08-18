// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import AddRepairModal from "../components/AddRepairModal";

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [lastAddedRepair, setLastAddedRepair] = useState(null);

  // --- Doughnut Chart Data ---
  const doughnutData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        data: [4, 6, 10],
        backgroundColor: ["#ffc107", "#3498db", "#2ecc71"],
        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { usePointStyle: true, pointStyle: "circle", padding: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const val = ctx.raw;
            const pct = ((val / total) * 100).toFixed(1);
            return `${ctx.label}: ${val} (${pct}%)`;
          },
        },
      },
    },
  };

  // --- Styles ---
  const styles = {
    statCard: {
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      transition: "transform .25s ease, box-shadow .25s ease",
      background: "#fff",
    },
    card: {
      border: "none",
      borderRadius: "15px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      background: "#fff",
    },
    addBtn: {
      background: "linear-gradient(135deg, #ffc107, #ffb300)",
      color: "#212529",
      fontWeight: "600",
      border: "none",
      borderRadius: "14px",
      padding: "12px 28px",
      marginTop: "8px",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(255,193,7,0.4)",
      fontSize: "1.05rem",
    },
  };

  const Stat = ({ title, value, color }) => (
    <div className="col-md-4">
      <div
        className="p-4 text-center"
        style={styles.statCard}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)";
        }}
      >
        <h6 className="text-muted fw-semibold mb-1">{title}</h6>
        <h3 className="fw-bold mb-0" style={{ color }}>{value}</h3>
      </div>
    </div>
  );

  // Generate unique tracking ID for repairs
  const generateRepairID = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date();
    const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    return `RP${dateStr}-${random}`;
  };

  // --- UPDATED: Save new repairs to localStorage ---
  const handleAddRepair = (repairData) => {
    const newRepair = { ...repairData, id: generateRepairID() };
    setRepairs([...repairs, newRepair]);

    // Save to localStorage so RepairPage can read it
    const savedRepairs = JSON.parse(localStorage.getItem("repairs") || "[]");
    localStorage.setItem("repairs", JSON.stringify([...savedRepairs, newRepair]));

    setLastAddedRepair(newRepair);
    setShowModal(false);

    // Hide popup after 5 seconds
    setTimeout(() => setLastAddedRepair(null), 5000);
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", background: "#e8f0fe" }}>
      <Sidebar />
      <div className="d-flex flex-column" style={{ flex: 1, minHeight: "100vh" }}>
        <Topbar />

        {/* Main content */}
        <main className="flex-grow-1 p-4 d-flex flex-column" style={{ height: "calc(100vh - 120px)", overflow: "hidden" }}>
          <h4 className="fw-bold text-dark mb-4">📊 Dashboard Overview</h4>

          <div className="row g-4 mb-3 flex-shrink-0">
            <Stat title="PENDING REPAIRS" value={4} color="#ffc107" />
            <Stat title="IN PROGRESS" value={6} color="#3498db" />
            <Stat title="COMPLETED" value={10} color="#2ecc71" />
          </div>

          <div className="mb-4">
            <button
              style={styles.addBtn}
              onMouseOver={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg,#ffb300,#e0a800)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(224,168,0,0.6)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #ffc107, #ffb300)";
                e.currentTarget.style.color = "#212529";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,193,7,0.4)";
              }}
              onClick={() => setShowModal(true)}
            >
              ➕ Add Repair
            </button>
          </div>

          <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ overflow: "hidden" }}>
            <div className="p-4" style={{ ...styles.card, width: "550px", height: "100%" }}>
              <h6 className="fw-semibold mb-3 text-secondary text-center">Repair Distribution</h6>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100% - 40px)" }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-light text-center p-3" style={{ flexShrink: 0 }}>© 2025 My Admin Panel</footer>
      </div>

      {/* Add Repair Modal */}
      <AddRepairModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddRepair} />

      {/* Repair Success Popup */}
      {lastAddedRepair && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}>
          <div className="card p-4 shadow-lg" style={{ width: "400px", borderRadius: "10px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Repair Added Successfully!</h5>
              <button className="btn-close" onClick={() => setLastAddedRepair(null)}></button>
            </div>
            <p><strong>Repair ID:</strong> {lastAddedRepair.id}</p>
            <p><strong>Device Brand:</strong> {lastAddedRepair.brand}</p>
            <p><strong>Device Model:</strong> {lastAddedRepair.model}</p>
            <p><strong>Service Needed:</strong> {lastAddedRepair.service}</p>
            <p><strong>Description:</strong> {lastAddedRepair.issue}</p>
            <p><strong>Name:</strong> {lastAddedRepair.name}</p>
            <p><strong>Phone:</strong> {lastAddedRepair.phone}</p>
            <button className="btn btn-success w-100 mt-2" onClick={() => setLastAddedRepair(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
