import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
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

      {/* LOGIN MODAL */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="loginEmail" placeholder="Enter email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="loginPassword" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-success w-100">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* SIGNUP MODAL */}
      <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="signupModalLabel">Sign Up</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="signupName" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="signupName" placeholder="Enter full name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="signupEmail" placeholder="Enter email" />
                </div>
                <div className="mb-3">
                  <label htmlFor="signupPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="signupPassword" placeholder="Password" />
                </div>
                <button type="submit" className="btn btn-warning w-100">Sign Up</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
