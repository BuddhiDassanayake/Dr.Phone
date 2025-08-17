import React, { useState } from "react";

export default function RepairTrackingModal() {
  const [repairId, setRepairId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    // For now, simulate tracking
    setTrackingInfo({
      id: repairId,
      status: "In Progress",
      customer: "John Doe",
      repair: "Screen Replacement",
    });
  };

  return (
    <div className="modal fade" id="repairTrackingModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title">Track Your Repair</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleTrack}>
              <div className="mb-3">
                <label className="form-label">Enter Repair ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={repairId}
                  onChange={(e) => setRepairId(e.target.value)}
                  placeholder="e.g. RP123456"
                  required
                />
              </div>
              <button className="btn btn-success w-100" type="submit">
                Track
              </button>
            </form>

            {trackingInfo && (
              <div className="mt-3 p-3 border rounded bg-light">
                <p><strong>Repair ID:</strong> {trackingInfo.id}</p>
                <p><strong>Customer:</strong> {trackingInfo.customer}</p>
                <p><strong>Repair:</strong> {trackingInfo.repair}</p>
                <p><strong>Status:</strong> {trackingInfo.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
