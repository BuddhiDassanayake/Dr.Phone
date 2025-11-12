import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css"; // Import the new CSS file

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg site-navbar fixed-top">
      <div className="container">
        {/* Brand/Logo */}
        <a className="navbar-brand" href="/">
          Dr.PHONE
        </a>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonials">Testimonials</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">Contact</a>
            </li>
          </ul>

          {/* Admin Button */}
          <div className="d-lg-flex">
            <Link to="/admin" className="btn btn-outline-accent">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;