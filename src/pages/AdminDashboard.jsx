// src/pages/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

// --- Helper for dynamic hover effects (optional but good practice) ---
const cardHoverStyle = {
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
};

const onMouseOver = (e) => {
  e.currentTarget.style.transform = "translateY(-5px)";
  e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.1)";
};

const onMouseOut = (e) => {
  e.currentTarget.style.transform = "none";
  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
};


export default function AdminDashboard() {
  // --- Chart Data & Options ---
  const repairData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Repairs",
        data: [4, 6, 10],
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)", // Orange
          "rgba(54, 162, 235, 0.7)", // Blue
          "rgba(75, 192, 192, 0.7)", // Green
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // --- Inline Styles ---
  const styles = {
    dashboardContainer: {
      backgroundColor: "#f8f9fa",
      flex: 1,
    },
    content: {
      padding: "2rem",
    },
    header: {
      color: "#343a40",
      fontWeight: "bold",
    },
    card: {
      border: "none",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      ...cardHoverStyle,
    },
    cardIcon: {
      width: "40px",
      height: "40px",
      marginBottom: "1rem",
      opacity: 0.7,
    },
    cardTitle: {
      fontWeight: "600",
      color: "#6c757d",
    },
    cardText: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    chartContainer: {
      backgroundColor: "#fff",
      padding: "1.5rem",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
      height: "400px",
    },
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />
      <div style={styles.dashboardContainer}>
        <Topbar />
        <main style={styles.content}>
          <h1 className="mb-4" style={styles.header}>
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="row mb-4 g-4">
            {/* Pending Repairs Card */}
            <div className="col-md-4">
              <div
                className="card text-dark p-3"
                style={{ ...styles.card, borderLeft: "5px solid #ffc107" }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h5 className="card-title" style={styles.cardTitle}>
                      PENDING REPAIRS
                    </h5>
                    <p className="card-text" style={{ ...styles.cardText, color: "#ffc107" }}>
                      4
                    </p>
                  </div>
                  <svg style={styles.cardIcon} xmlns="http://www.w3.org/2000/svg" fill="#ffc107" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 7h-2v6h2V7zm-1 8c-.552 0-1 .448-1 1s.448 1 1 1 1-.448 1-1-.448-1-1-1z"></path></svg>
                </div>
              </div>
            </div>
            {/* In Progress Card */}
            <div className="col-md-4">
              <div
                className="card text-dark p-3"
                style={{ ...styles.card, borderLeft: "5px solid #3498db" }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h5 className="card-title" style={styles.cardTitle}>
                      IN PROGRESS
                    </h5>
                    <p className="card-text" style={{ ...styles.cardText, color: "#3498db" }}>
                      6
                    </p>
                  </div>
                  <svg style={styles.cardIcon} xmlns="http://www.w3.org/2000/svg" fill="#3498db" viewBox="0 0 24 24"><path d="M12 2c-3.483 0-6.443 2.105-7.59 5.013A.996.996 0 0 0 5.405 8H8v2H5.405c.002.033.005.065.005.1 0 3.86 3.14 7 7 7s7-3.14 7-7c0-.035-.003-.067-.005-.1H16V8h2.595c.545 0 .995-.448.995-1-.001-2.908-2.909-5.013-6.58-5.013zm0 13c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path><path d="M13 9h-2v3H8v2h3v3h2v-3h3v-2h-3z"></path></svg>
                </div>
              </div>
            </div>
            {/* Completed Card */}
            <div className="col-md-4">
              <div
                className="card text-dark p-3"
                style={{ ...styles.card, borderLeft: "5px solid #2ecc71" }}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
              >
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h5 className="card-title" style={styles.cardTitle}>
                      COMPLETED
                    </h5>
                    <p className="card-text" style={{ ...styles.cardText, color: "#2ecc71" }}>
                      10
                    </p>
                  </div>
                   <svg style={styles.cardIcon} xmlns="http://www.w3.org/2000/svg" fill="#2ecc71" viewBox="0 0 24 24"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l6.707-6.707-1.414-1.414z"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row g-4">
            <div className="col-lg-7">
              <div style={styles.chartContainer}>
                <h5 className="mb-3" style={{ color: "#495057" }}>Repair Status Overview</h5>
                <div style={{ height: "300px" }}>
                  <Bar data={repairData} options={chartOptions} />
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div style={styles.chartContainer}>
                <h5 className="mb-3" style={{ color: "#495057" }}>Repair Distribution</h5>
                 <div style={{ height: "300px" }}>
                   <Pie data={repairData} options={chartOptions} />
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}