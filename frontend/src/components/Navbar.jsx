import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top bg-white shadow-sm" style={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.9)' }}>
      <div className="container">
        <a className="navbar-brand fw-bold text-primary fs-4" href="#home">
          <i className="bi bi-book-half me-2"></i>EduLib
        </a>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto fw-semibold">
            <li className="nav-item"><a className="nav-link text-dark px-3" href="#home">Home</a></li>
            <li className="nav-item"><a className="nav-link text-dark px-3" href="#services">Collection</a></li>
            <li className="nav-item"><a className="nav-link text-dark px-3" href="#contact">Contact</a></li>
          </ul>
          <div className="d-flex gap-2 mt-3 mt-lg-0">
            <button className="btn btn-outline-primary rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#bookSearchModal">
              <i className="bi bi-search me-1"></i> Search
            </button>
            <button className="btn btn-primary rounded-pill px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#authModal">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}