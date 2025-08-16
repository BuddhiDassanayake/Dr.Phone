// src/components/RepairTrackingModal.jsx
import React from "react";

export default function RepairTrackingModal() {
  return (
    <div
      className="modal fade"
      id="repairTrackingModal"
      tabIndex="-1"
      aria-labelledby="repairTrackingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg">
          <div className="modal-header">
            <h5 className="modal-title" id="repairTrackingModalLabel">
              Track Your Repair
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label className="form-label">Enter Repair ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. RP123456"
                />
              </div>
              <button className="btn btn-success w-100" type="submit">
                Track
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> repair-tracking
