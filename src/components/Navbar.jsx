import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top py-3">
      <div className="container">
        <a className="navbar-brand fw-bold" href="/">Dr.PHONE</a>
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

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5">
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="/">Home</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#services">Services</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#about">About</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#contact">Contact</a></li>
          </ul>

          <div className="d-flex ms-auto">
            <button className="btn btn-success me-2" data-bs-toggle="modal" data-bs-target="#loginModal">
              Login
            </button>

            <button className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#signupModal">
              Sign Up
            </button>

            <Link to="/admin" className="btn btn-success text-white">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
