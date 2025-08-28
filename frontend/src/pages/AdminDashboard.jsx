// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import AddRepairModal from "../components/AddRepairModal";
import {
  FaPlus, FaSync, FaTools, FaHourglassHalf, FaCogs, FaCheckCircle,
  FaChartLine, FaChartPie, FaClipboardList, FaHistory
} from "react-icons/fa";
import config from "../config";

// --- Main Dashboard Component ---
export default function AdminDashboard() {
  // --- State Management ---
  const [showModal, setShowModal] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  const fetchRepairs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}/repairs`);
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      setRepairs(data);
    } catch (error) {
      setError("Failed to fetch repairs. Please ensure the server is running.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

  // --- Memoized Data Calculations ---
  const statusStats = useMemo(() => ({
    pending: repairs.filter(r => r.status === "Pending").length,
    inProgress: repairs.filter(r => r.status === "Ongoing").length,
    completed: repairs.filter(r => r.status === "Completed").length,
    total: repairs.length,
  }), [repairs]);

  const dailyRepairsData = useMemo(() => {
    const labels = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const data = Array(7).fill(0);
    repairs.forEach(repair => {
      const diffDays = Math.floor((new Date() - new Date(repair.created_at)) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) data[6 - diffDays]++;
    });

    return {
      labels,
      datasets: [{
        label: 'New Repairs', data, fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)', tension: 0.4,
      }],
    };
  }, [repairs]);

  const repairTypesData = useMemo(() => {
    const types = repairs.reduce((acc, { service }) => ({ ...acc, [service]: (acc[service] || 0) + 1 }), {});
    const sortedTypes = Object.entries(types).sort(([, a], [, b]) => b - a).slice(0, 7);

    return {
      labels: sortedTypes.map(([label]) => label),
      datasets: [{
        label: 'Number of Repairs', data: sortedTypes.map(([, data]) => data),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1, borderRadius: 4,
      }],
    };
  }, [repairs]);

  const recentActivity = useMemo(() =>
    [...repairs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5),
    [repairs]
  );
  
  const doughnutData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [{
      data: [statusStats.pending, statusStats.inProgress, statusStats.completed],
      backgroundColor: ["#ffc107", "#3498db", "#2ecc71"],
      borderColor: '#f4f7fc', borderWidth: 4,
    }],
  };
  
  const commonChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, grid: { drawBorder: false } }, x: { grid: { display: false } } },
  };

  const handleAddRepair = async (repairData) => { /* ... */ };

  // --- UI Components ---
  const StatCard = ({ title, value, icon, color }) => (
    <div className="col">
      <div className="p-3 d-flex dashboard-card" style={{ borderLeft: `5px solid ${color}` }}>
        <div style={{...styles.iconWrapper, color}}>
          {icon}
        </div>
        <div className="ms-3">
          <h6 style={styles.statTitle}>{title}</h6>
          <h3 style={styles.statValue}>{value}</h3>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, icon, children }) => (
    <div className="col-xl-6 mb-4">
      <div className="p-4 dashboard-card" style={{ height: "400px" }}>
        <h6 style={styles.cardTitle}>
          <span className="me-2">{icon}</span>{title}
        </h6>
        <div style={{ height: "calc(100% - 30px)" }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={styles.page}>
      <Sidebar />
      <div className="d-flex flex-column w-100">
        <Topbar />
        <main className="flex-grow-1 p-4" style={styles.mainContent}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 style={styles.pageTitle}>Dashboard</h4>
            <div>
              <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" />Add Repair
              </button>
              <button style={styles.refreshBtn} onClick={fetchRepairs} disabled={loading}>
                <FaSync className={loading ? 'fa-spin' : ''} />
              </button>
            </div>
          </div>
          
          {error && <div className="alert alert-danger">{error}</div>}

          {/* Top Stats Row */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-4">
            <StatCard title="Total Repairs" value={statusStats.total} icon={<FaTools />} color="#6f42c1" />
            <StatCard title="Pending" value={statusStats.pending} icon={<FaHourglassHalf />} color="#ffc107" />
            <StatCard title="In Progress" value={statusStats.inProgress} icon={<FaCogs />} color="#3498db" />
            <StatCard title="Completed" value={statusStats.completed} icon={<FaCheckCircle />} color="#2ecc71" />
          </div>

          {/* Main Chart Grid */}
          <div className="row">
            <ChartCard title="Daily Repair Volume (Last 7 Days)" icon={<FaChartLine />}>
              <Line data={dailyRepairsData} options={commonChartOptions} />
            </ChartCard>

            <ChartCard title="Repair Status Overview" icon={<FaChartPie />}>
              <Doughnut data={doughnutData} options={{ ...commonChartOptions, scales: {y:{display:false}, x:{display:false}} , plugins: { legend: { position: 'bottom' }}}} />
            </ChartCard>

            <ChartCard title="Most Common Repair Services" icon={<FaClipboardList />}>
              <Bar data={repairTypesData} options={{ ...commonChartOptions, indexAxis: 'y' }} />
            </ChartCard>

            {/* Recent Activity */}
            <div className="col-xl-6 mb-4">
              <div className="p-4 dashboard-card" style={{ height: '400px' }}>
                <h6 style={styles.cardTitle}><FaHistory className="me-2" />Recent Activity</h6>
                <div className="list-group list-group-flush">
                  {recentActivity.length > 0 ? recentActivity.map(r => (
                    <div key={r.id} className="list-group-item d-flex justify-content-between align-items-start border-0 px-0">
                      <div>
                        <p style={styles.activityText}><strong>{r.name}</strong> submitted a request for <strong>{r.service}</strong>.</p>
                        <small style={styles.activitySubText}>{r.brand} {r.model}</small>
                      </div>
                      <small style={styles.activitySubText}>{new Date(r.created_at).toLocaleDateString()}</small>
                    </div>
                  )) : <p style={styles.activityText}>No recent activity to display.</p>}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* --- Footer --- */}
        {/* Footer */}
<div className="footer-bottom text-center py-3 mt-4">
  <p className="mb-0 text-light">
    &copy; {new Date().getFullYear()} Dr.PHONE. All Rights Reserved.
  </p>
</div>


      </div>
      <AddRepairModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddRepair} />
    </div>
  );
}

// --- Styles ---
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f4f7fc",
    fontFamily: "'Inter', sans-serif",
  },
  mainContent: { overflowY: 'auto' },
  pageTitle: {
    fontWeight: '700',
    color: '#212529',
    fontSize: '1.75rem',
  },
  cardTitle: {
    fontWeight: '600',
    color: '#495057',
    fontSize: '1.1rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
  },
  statTitle: {
    color: '#6c757d',
    fontWeight: '600',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    fontWeight: '700',
    color: '#343a40',
    fontSize: '2rem',
  },
  iconWrapper: {
    fontSize: '1.75rem',
    backgroundColor: 'rgba(108, 117, 125, 0.1)',
    height: '50px',
    width: '50px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    backgroundColor: "#0d6efd",
    color: "#fff",
    fontWeight: "600",
    fontSize: '0.9rem',
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    transition: "background-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 4px 10px rgba(13,110,253,0.2)",
  },
  refreshBtn: {
    backgroundColor: '#fff',
    color: '#6c757d',
    border: '1px solid #ced4da',
    borderRadius: '8px',
    padding: '12px 18px',
    marginLeft: '10px',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  activityText: {
    color: '#343a40',
    marginBottom: '0.25rem',
    fontSize: '0.95rem',
  },
  activitySubText: {
    color: '#6c757d',
    fontSize: '0.85rem'
  }
};