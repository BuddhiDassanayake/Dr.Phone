// src/pages/AdminDashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function AdminDashboard() {
  const repairData = {
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [
      {
        label: "Repairs",
        data: [4, 6, 10],
        backgroundColor: ["#f39c12", "#3498db", "#2ecc71"],
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Topbar />
        <div className="container">
          <h2 className="mb-4">Dashboard Overview</h2>

          {/* Stats Cards */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card text-white bg-warning mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Pending Repairs</h5>
                  <p className="card-text fs-4">4</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-info mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">In Progress</h5>
                  <p className="card-text fs-4">6</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-success mb-3 shadow">
                <div className="card-body">
                  <h5 className="card-title">Completed</h5>
                  <p className="card-text fs-4">10</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="row">
            <div className="col-md-6">
              <div className="card p-3 shadow">
                <h5>Repair Status Overview</h5>
                <Bar data={repairData} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3 shadow">
                <h5>Repair Distribution</h5>
                <Pie data={repairData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
