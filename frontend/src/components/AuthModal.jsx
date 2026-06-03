import React, { useState } from "react";

export default function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(isLogin ? "Successfully Logged In!" : "Account Created Successfully!");
      document.querySelector("#authModal .btn-close").click(); // Auto close modal
    }, 1500);
  };

  return (
    <div className="modal fade custom-modal" id="authModal" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg rounded-4">
          <div className="modal-header bg-light border-0">
            <h5 className="modal-title fw-bold">
              <i className="bi bi-person-circle me-2 text-primary"></i> Member Portal
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div className="modal-body p-4 p-md-5">
            <div className="bg-light p-1 rounded-pill mb-4 d-flex">
              <button className={`btn flex-fill rounded-pill fw-bold ${isLogin ? "btn-primary shadow-sm" : "btn-light text-muted"}`} onClick={() => setIsLogin(true)}>Login</button>
              <button className={`btn flex-fill rounded-pill fw-bold ${!isLogin ? "btn-primary shadow-sm" : "btn-light text-muted"}`} onClick={() => setIsLogin(false)}>Register</button>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="form-floating mb-3">
                  <input type="text" className="form-control rounded-4" id="floatingName" placeholder="John Doe" required />
                  <label htmlFor="floatingName">Full Name</label>
                </div>
              )}
              
              <div className="form-floating mb-3">
                <input type="email" className="form-control rounded-4" id="floatingInput" placeholder="name@example.com" required />
                <label htmlFor="floatingInput">Email address</label>
              </div>
              
              <div className="form-floating mb-4">
                <input type="password" className="form-control rounded-4" id="floatingPassword" placeholder="Password" required />
                <label htmlFor="floatingPassword">Password</label>
              </div>

              <button className="btn btn-primary w-100 py-3 rounded-pill fw-bold shadow-sm" type="submit" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm"></span> : (isLogin ? "Sign In" : "Create Account")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}