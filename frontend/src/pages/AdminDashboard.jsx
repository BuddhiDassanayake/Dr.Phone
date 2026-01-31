// src/pages/AdminDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/sidebar";
import Topbar from "../components/Topbar";
import { Doughnut, Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import AddRepairModal from "../components/AddRepairModal";
import {
  FaPlus, FaSync, FaTools, FaHourglassHalf, FaCogs, FaCheckCircle,
  FaChartLine, FaChartPie, FaClipboardList, FaHistory, FaTrendingUp,
  FaCalendarAlt, FaMobileAlt, FaExclamationCircle, FaFilter, FaDownload
} from "react-icons/fa";
import config from "../config";

export default function AdminDashboard() {
  // State Management
  const [showModal, setShowModal] = useState(false);
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // Filter for time range
  const [refreshing, setRefreshing] = useState(false);

  // --- Data Fetching ---
  const fetchRepairs = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const response = await fetch(`${config.apiBaseUrl}/repairs`);
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      setRepairs(data);
      
      // Success notification (you can replace with toast)
      setTimeout(() => setRefreshing(false), 500);
    } catch (error) {
      setError("Failed to fetch repairs. Please ensure the server is running.");
      console.error("Fetch error:", error);
      setRefreshing(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairs();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchRepairs, 300000);
    return () => clearInterval(interval);
  }, []);

  // --- Memoized Data Calculations ---
  const statusStats = useMemo(() => ({
    pending: repairs.filter(r => r.status === "Pending").length,
    inProgress: repairs.filter(r => r.status === "Ongoing").length,
    completed: repairs.filter(r => r.status === "Completed").length,
    total: repairs.length,
  }), [repairs]);

  // Calculate growth percentage
  const growthStats = useMemo(() => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeekRepairs = repairs.filter(r => new Date(r.created_at) >= lastWeek).length;
    const lastWeekRepairs = repairs.filter(r => {
      const date = new Date(r.created_at);
      return date >= lastMonth && date < lastWeek;
    }).length;
    
    const growth = lastWeekRepairs > 0 
      ? ((thisWeekRepairs - lastWeekRepairs) / lastWeekRepairs * 100).toFixed(1)
      : 0;
      
    return { thisWeek: thisWeekRepairs, growth };
  }, [repairs]);

  const dailyRepairsData = useMemo(() => {
    const days = timeRange === '7days' ? 7 : 30;
    const labels = [...Array(days)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }).reverse();

    const data = Array(days).fill(0);
    repairs.forEach(repair => {
      const diffDays = Math.floor((new Date() - new Date(repair.created_at)) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < days) data[days - 1 - diffDays]++;
    });

    return {
      labels,
      datasets: [{
        label: 'New Repairs',
        data,
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }],
    };
  }, [repairs, timeRange]);

  const repairTypesData = useMemo(() => {
    const types = repairs.reduce((acc, { service }) => ({ 
      ...acc, 
      [service]: (acc[service] || 0) + 1 
    }), {});
    const sortedTypes = Object.entries(types)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 7);

    const colors = [
      'rgba(99, 102, 241, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(251, 146, 60, 0.8)',
      'rgba(34, 197, 94, 0.8)',
      'rgba(59, 130, 246, 0.8)',
      'rgba(168, 85, 247, 0.8)',
    ];

    return {
      labels: sortedTypes.map(([label]) => label),
      datasets: [{
        label: 'Number of Repairs',
        data: sortedTypes.map(([, data]) => data),
        backgroundColor: colors.slice(0, sortedTypes.length),
        borderColor: colors.slice(0, sortedTypes.length).map(c => c.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 8,
      }],
    };
  }, [repairs]);

  const recentActivity = useMemo(() =>
    [...repairs]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 6),
    [repairs]
  );

  // Chart configurations
  const doughnutData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [{
      data: [statusStats.pending, statusStats.inProgress, statusStats.completed],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
      borderColor: ['#fbbf24', '#3b82f6', '#22c55e'],
      borderWidth: 3,
      hoverOffset: 10,
    }],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#fff',
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 12, weight: '600' },
          color: '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        grid: { display: false },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#6b7280',
          font: { size: 11 },
        },
      },
    },
  };

  const handleAddRepair = async (repairData) => {
    // Add repair logic here
    await fetchRepairs();
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#fbbf24',
      'Ongoing': '#3b82f6',
      'Completed': '#22c55e',
    };
    return colors[status] || '#6b7280';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Pending': <FaHourglassHalf />,
      'Ongoing': <FaCogs />,
      'Completed': <FaCheckCircle />,
    };
    return icons[status] || <FaExclamationCircle />;
  };

  // --- UI Components ---
  const StatCard = ({ title, value, icon, color, gradient, trend, trendValue }) => (
    <div className="col-12 col-sm-6 col-xl-3">
      <div className="stat-card">
        <div className="stat-card-inner" style={{ borderTopColor: color }}>
          <div className="stat-icon-wrapper" style={{ background: gradient }}>
            {icon}
          </div>
          <div className="stat-content">
            <p className="stat-title">{title}</p>
            <div className="d-flex align-items-end justify-content-between">
              <h2 className="stat-value">{value}</h2>
              {trend && (
                <div className="stat-trend" style={{ color: trendValue >= 0 ? '#22c55e' : '#ef4444' }}>
                  <FaTrendingUp className="me-1" style={{ fontSize: '0.9rem' }} />
                  <span>{Math.abs(trendValue)}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ChartCard = ({ title, icon, children, actions }) => (
    <div className="col-xl-6 mb-4">
      <div className="chart-card">
        <div className="chart-card-header">
          <h6 className="chart-card-title">
            <span className="chart-icon">{icon}</span>
            {title}
          </h6>
          {actions && <div className="chart-actions">{actions}</div>}
        </div>
        <div className="chart-card-body">{children}</div>
      </div>
    </div>
  );

  const ActivityItem = ({ repair }) => (
    <div className="activity-item">
      <div className="activity-icon-wrapper" style={{ background: `${getStatusColor(repair.status)}20` }}>
        <FaMobileAlt style={{ color: getStatusColor(repair.status) }} />
      </div>
      <div className="activity-content">
        <div className="activity-header">
          <p className="activity-text">
            <strong>{repair.name}</strong> requested <strong>{repair.service}</strong>
          </p>
          <span className="activity-badge" style={{ 
            background: `${getStatusColor(repair.status)}20`,
            color: getStatusColor(repair.status)
          }}>
            {getStatusIcon(repair.status)}
            <span className="ms-1">{repair.status}</span>
          </span>
        </div>
        <div className="activity-meta">
          <span className="activity-device">{repair.brand} {repair.model}</span>
          <span className="activity-date">
            <FaCalendarAlt className="me-1" />
            {new Date(repair.created_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading && repairs.length === 0) {
    return (
      <div className="d-flex" style={styles.page}>
        <Sidebar />
        <div className="d-flex flex-column w-100">
          <Topbar />
          <main className="flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading dashboard data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex" style={styles.page}>
      <Sidebar />
      <div className="d-flex flex-column w-100">
        <Topbar />
        <main className="flex-grow-1 p-3 p-md-4" style={styles.mainContent}>
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h4 className="dashboard-title">Dashboard Overview</h4>
              <p className="dashboard-subtitle">
                Welcome back! Here's what's happening with your repair service today.
              </p>
            </div>
            <div className="dashboard-actions">
              <button 
                className="btn-refresh" 
                onClick={fetchRepairs} 
                disabled={refreshing}
                title="Refresh data"
              >
                <FaSync className={refreshing ? 'fa-spin' : ''} />
              </button>
              <button 
                className="btn-primary-custom"
                onClick={() => setShowModal(true)}
              >
                <FaPlus className="me-2" />
                <span>Add Repair</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <FaExclamationCircle className="me-2" />
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Stats Cards */}
          <div className="row g-3 g-md-4 mb-4">
            <StatCard
              title="Total Repairs"
              value={statusStats.total}
              icon={<FaTools />}
              color="#6366f1"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            />
            <StatCard
              title="Pending"
              value={statusStats.pending}
              icon={<FaHourglassHalf />}
              color="#fbbf24"
              gradient="linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)"
            />
            <StatCard
              title="In Progress"
              value={statusStats.inProgress}
              icon={<FaCogs />}
              color="#3b82f6"
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
            />
            <StatCard
              title="Completed"
              value={statusStats.completed}
              icon={<FaCheckCircle />}
              color="#22c55e"
              gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              trend={true}
              trendValue={growthStats.growth}
            />
          </div>

          {/* Charts Grid */}
          <div className="row">
            {/* Daily Repairs Chart */}
            <ChartCard
              title="Daily Repair Volume"
              icon={<FaChartLine />}
              actions={
                <select
                  className="form-select form-select-sm time-range-select"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              }
            >
              <Line data={dailyRepairsData} options={lineChartOptions} />
            </ChartCard>

            {/* Status Overview Chart */}
            <ChartCard title="Repair Status Distribution" icon={<FaChartPie />}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </ChartCard>

            {/* Common Repairs Chart */}
            <ChartCard title="Most Common Repair Services" icon={<FaClipboardList />}>
              <Bar data={repairTypesData} options={barChartOptions} />
            </ChartCard>

            {/* Recent Activity */}
            <div className="col-xl-6 mb-4">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h6 className="chart-card-title">
                    <span className="chart-icon"><FaHistory /></span>
                    Recent Activity
                  </h6>
                  <button className="btn-link-custom">View All</button>
                </div>
                <div className="activity-list">
                  {recentActivity.length > 0 ? (
                    recentActivity.map(repair => (
                      <ActivityItem key={repair.id} repair={repair} />
                    ))
                  ) : (
                    <div className="empty-state">
                      <FaHistory className="empty-icon" />
                      <p className="empty-text">No recent activity to display</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="container-fluid px-3 px-md-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
              <p className="footer-text mb-2 mb-md-0">
                &copy; {new Date().getFullYear()} Dr.PHONE. All Rights Reserved.
              </p>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Support</a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <AddRepairModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddRepair}
      />
      
      <style>{`
        ${dashboardStyles}
      `}</style>
    </div>
  );
}

// --- Inline Styles ---
const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  mainContent: {
    overflowY: 'auto',
    overflowX: 'hidden',
  },
};


// Enhanced CSS
const dashboardStyles = `
  /* Dashboard Header */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .dashboard-title {
    font-size: 1.75rem;
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 0.25rem;
  }

  .dashboard-subtitle {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0;
  }

  .dashboard-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }

  .btn-primary-custom {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .btn-primary-custom:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn-primary-custom:active {
    transform: translateY(0);
  }

  .btn-refresh {
    background: white;
    color: #6b7280;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 0.75rem;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .btn-refresh:hover {
    background: #f9fafb;
    color: #6366f1;
    border-color: #6366f1;
  }

  .btn-refresh:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Stat Cards */
  .stat-card {
    height: 100%;
    animation: fadeInUp 0.5s ease forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .stat-card-inner {
    background: white;
    border-radius: 1rem;
    padding: 1.5rem;
    height: 100%;
    display: flex;
    gap: 1rem;
    align-items: center;
    border-top: 4px solid;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
  }

  .stat-card-inner:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
    min-width: 0;
  }

  .stat-title {
    font-size: 0.85rem;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: #1f2937;
    margin: 0;
    line-height: 1;
  }

  .stat-trend {
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
  }

  /* Chart Cards */
  .chart-card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    height: 400px;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    animation: fadeInUp 0.6s ease forwards;
  }

  .chart-card:hover {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .chart-card-header {
    padding: 1.5rem;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chart-card-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    display: flex;
    align-items: center;
  }

  .chart-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
    border-radius: 0.5rem;
    color: #6366f1;
    margin-right: 0.75rem;
  }

  .chart-card-body {
    flex: 1;
    padding: 1.5rem;
    min-height: 0;
  }

  .chart-actions {
    display: flex;
    gap: 0.5rem;
  }

  .time-range-select {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .time-range-select:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    outline: none;
  }

  .btn-link-custom {
    background: none;
    border: none;
    color: #6366f1;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    transition: all 0.2s ease;
  }

  .btn-link-custom:hover {
    color: #4f46e5;
    text-decoration: underline;
  }

  /* Activity List */
  .activity-list {
    max-height: 320px;
    overflow-y: auto;
    padding: 1rem 1.5rem;
  }

  .activity-list::-webkit-scrollbar {
    width: 6px;
  }

  .activity-list::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 10px;
  }

  .activity-list::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
  }

  .activity-list::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }

  .activity-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
    margin-bottom: 0.75rem;
  }

  .activity-item:hover {
    background: #f9fafb;
  }

  .activity-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: 1.1rem;
  }

  .activity-content {
    flex: 1;
    min-width: 0;
  }

  .activity-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
    gap: 0.75rem;
  }

  .activity-text {
    font-size: 0.9rem;
    color: #374151;
    margin: 0;
    line-height: 1.5;
  }

  .activity-text strong {
    color: #1f2937;
    font-weight: 600;
  }

  .activity-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.625rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .activity-meta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .activity-device,
  .activity-date {
    font-size: 0.8rem;
    color: #6b7280;
    display: flex;
    align-items: center;
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }

  .empty-icon {
    font-size: 3rem;
    color: #d1d5db;
    margin-bottom: 1rem;
  }

  .empty-text {
    color: #9ca3af;
    font-size: 0.95rem;
    margin: 0;
  }

  /* Footer */
  .dashboard-footer {
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 1.25rem 0;
    margin-top: auto;
  }

  .footer-text {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
  }

  .footer-link {
    color: #6b7280;
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-link:hover {
    color: #6366f1;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .dashboard-actions {
      width: 100%;
      justify-content: space-between;
    }

    .btn-primary-custom span {
      display: none;
    }

    .btn-primary-custom {
      padding: 0.75rem;
      width: 42px;
      justify-content: center;
    }

    .dashboard-title {
      font-size: 1.5rem;
    }

    .stat-card-inner {
      padding: 1.25rem;
    }

    .stat-icon-wrapper {
      width: 50px;
      height: 50px;
      font-size: 1.25rem;
    }

    .stat-value {
      font-size: 1.75rem;
    }

    .chart-card {
      height: 350px;
    }

    .activity-item {
      flex-direction: column;
      align-items: flex-start;
    }

    .activity-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .footer-links {
      margin-top: 0.75rem;
      width: 100%;
      justify-content: center;
    }
  }

  @media (max-width: 576px) {
    .dashboard-title {
      font-size: 1.35rem;
    }

    .stat-value {
      font-size: 1.5rem;
    }

    .chart-card-header {
      padding: 1.25rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .time-range-select {
      width: 100%;
    }

    .activity-meta {
      flex-direction: column;
      gap: 0.25rem;
    }
  }

  /* Animations */
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .fa-spin {
    animation: spin 1s linear infinite;
  }

  /* Alert Enhancements */
  .alert {
    border-radius: 0.75rem;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .alert-danger {
    background: #fef2f2;
    color: #991b1b;
  }
`;

