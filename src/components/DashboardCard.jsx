import React from "react";

export default function DashboardCard({ title, value, icon, bgColor }) {
  return (
    <div className="col-md-3 mb-3">
      <div className={`card text-white ${bgColor} shadow-sm`}>
        <div className="card-body d-flex align-items-center">
          <div className="me-3">{icon}</div>
          <div>
            <h5 className="card-title">{title}</h5>
            <h3 className="card-text">{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
