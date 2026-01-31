// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import AddRepairModal from "../components/AddRepairModal";
import {
  FaPlus, FaSync, FaTools, FaHourglassHalf, FaCogs, FaCheckCircle,
  FaChartLine, FaChartPie, FaClipboardList, FaHistory
} from "react-icons/fa";
import config from "../config";

// Modern Color Palette aligned with your CSS variables
const COLORS = {
  primary: "#2563eb",
  pending: "#f59e0b",
  ongoing: "#3b82f6",
  completed: "#10b981",
  purple: "#7c3aed",
  bg: "#f8fafc",
  textMain: "#1e293b",
  textSub: "#64748b"
};

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
  }, []);

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
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: COLORS.primary, tension: 0.4,
        pointBackgroundColor: COLORS.primary,
      }],
    };
  }, [repairs]);

  const repairTypesData = useMemo(() => {
    const types = repairs.reduce((acc, { service }) => ({ ...acc, [service]: (acc[service] || 0) + 1 }), {});
    const sortedTypes = Object.entries(types).sort(([, a], [, b]) => b - a).slice(0, 5);

    return {
      labels: sortedTypes.map(([label]) => label),
      datasets: [{
        label: 'Services', data: sortedTypes.map(([, data]) => data),
        backgroundColor: [COLORS.primary, COLORS.purple, COLORS.ongoing, COLORS.completed, COLORS.pending],
        borderRadius: 8,
      }],
    };
  }, [repairs]);

  const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { 
      y: { grid: { color: "#f1f5f9" }, ticks: { color: COLORS.textSub } },
      x: { grid: { display: false }, ticks: { color: COLORS.textSub } }
    },
  };

  const handleAddRepair = async (repairData) => { /* Logic */ };

  // --- UI Components ---
  const StatCard = ({ title, value, icon, gradient }) => (
    <div className="col">
      <div style={{...styles.statCard, background: '#fff'}}>
        <div style={{...styles.statIconWrapper, background: gradient}}>
          {icon}
        </div>
        <div className="ms-3">
          <p style={styles.statTitle}>{title}</p>
          <h3 style={styles.statValue}>{value}</h3>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, icon, children, height = "400px" }) => (
    <div className="col-xl-6 mb-4">
      <div style={{ ...styles.dashboardCard, height }}>
        <div className="d-flex align-items-center mb-4">
          <div style={styles.cardIconHeader}>{icon}</div>
          <h6 style={styles.cardTitle}>{title}</h6>
        </div>
        <div style={{ height: "calc(100% - 60px)" }}>{children}</div>
      </div>
    </div>
  );

  return (
    <div className="d-flex" style={styles.page}>
      <Sidebar />
      <div className="d-flex flex-column w-100">
        <Topbar />
        <main className="flex-grow-1 p-4" style={styles.mainContent}>
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h4 style={styles.pageTitle}>Admin Overview</h4>
              <p style={styles.pageSubtitle}>Welcome back! Here's what's happening today.</p>
            </div>
            <div className="d-flex gap-2">
              <button style={styles.refreshBtn} onClick={fetchRepairs} disabled={loading}>
                <FaSync className={loading ? 'fa-spin' : ''} />
              </button>
              <button style={styles.addBtn} onClick={() => setShowModal(true)}>
                <FaPlus className="me-2" /> New Repair
              </button>
            </div>
          </div>
          
          {error && <div className="alert alert-danger shadow-sm border-0">{error}</div>}

          {/* Stats Grid */}
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4 mb-5">
            <StatCard title="Total Jobs" value={statusStats.total} icon={<FaTools />} gradient="linear-gradient(135deg, #6366f1, #a855f7)" />
            <StatCard title="Pending" value={statusStats.pending} icon={<FaHourglassHalf />} gradient="linear-gradient(135deg, #f59e0b, #fbbf24)" />
            <StatCard title="In Progress" value={statusStats.inProgress} icon={<FaCogs />} gradient="linear-gradient(135deg, #3b82f6, #2563eb)" />
            <StatCard title="Finished" value={statusStats.completed} icon={<FaCheckCircle />} gradient="linear-gradient(135deg, #10b981, #34d399)" />
          </div>

          <div className="row">
            <ChartCard title="Weekly Volume" icon={<FaChartLine />}>
              <Line data={dailyRepairsData} options={commonChartOptions} />
            </ChartCard>

            <ChartCard title="Status Distribution" icon={<FaChartPie />}>
              <Doughnut 
                data={{
                  labels: ["Pending", "Progress", "Done"],
                  datasets: [{
                    data: [statusStats.pending, statusStats.inProgress, statusStats.completed],
                    backgroundColor: [COLORS.pending, COLORS.ongoing, COLORS.completed],
                    borderWidth: 0,
                    hoverOffset: 10
                  }],
                }} 
                options={{ ...commonChartOptions, cutout: '70%', plugins: { legend: { display: true, position: 'bottom' }}}} 
              />
            </ChartCard>

            <ChartCard title="Top Services" icon={<FaClipboardList />}>
              <Bar data={repairTypesData} options={{ ...commonChartOptions, indexAxis: 'y' }} />
            </ChartCard>

            {/* Recent Activity Section */}
            <div className="col-xl-6 mb-4">
              <div style={{ ...styles.dashboardCard, height: '400px' }}>
                <div className="d-flex align-items-center mb-4">
                  <div style={styles.cardIconHeader}><FaHistory /></div>
                  <h6 style={styles.cardTitle}>Recent Activity</h6>
                </div>
                <div className="overflow-auto pe-2" style={{ maxHeight: '300px' }}>
                  {repairs.slice(0, 5).map(r => (
                    <div key={r.id} style={styles.activityItem}>
                      <div style={styles.activityIndicator}></div>
                      <div className="flex-grow-1">
                        <p style={styles.activityText}><strong>{r.name}</strong> - {r.service}</p>
                        <small style={styles.activitySubText}>{r.brand} {r.model} • {new Date(r.created_at).toLocaleDateString()}</small>
                      </div>
                      <span style={{...styles.statusBadge, backgroundColor: r.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: r.status === 'Completed' ? '#166534' : '#92400e'}}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AddRepairModal show={showModal} onClose={() => setShowModal(false)} onAdd={handleAddRepair} />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: COLORS.bg,
    fontFamily: "'Inter', sans-serif",
  },
  mainContent: { overflowY: 'auto' },
  pageTitle: {
    fontWeight: '800',
    color: COLORS.textMain,
    fontSize: '1.8rem',
    marginBottom: '0.2rem'
  },
  pageSubtitle: {
    color: COLORS.textSub,
    fontSize: '0.95rem'
  },
  dashboardCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
    transition: 'transform 0.2s ease',
  },
  cardTitle: {
    fontWeight: '700',
    color: COLORS.textMain,
    fontSize: '1.1rem',
    margin: 0
  },
  cardIconHeader: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    color: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    fontSize: '1rem'
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderRadius: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)'
  },
  statIconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  statTitle: {
    color: COLORS.textSub,
    fontWeight: '600',
    fontSize: '0.85rem',
    margin: 0,
    textTransform: 'uppercase'
  },
  statValue: {
    fontWeight: '800',
    color: COLORS.textMain,
    fontSize: '1.75rem',
    margin: 0
  },
  addBtn: {
    background: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    color: "#fff",
    fontWeight: "600",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.3)",
    transition: "all 0.2s ease",
  },
  refreshBtn: {
    backgroundColor: '#fff',
    color: COLORS.textSub,
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '12px 16px',
    transition: 'all 0.2s ease',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    gap: '12px'
  },
  activityIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: COLORS.primary
  },
  activityText: { fontSize: '0.95rem', margin: 0, color: COLORS.textMain },
  activitySubText: { color: COLORS.textSub, fontSize: '0.8rem' },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700'
  }
};