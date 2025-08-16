import React, { useState } from "react";
import "./Navbar.css";
import LoginCard from "./Login/LoginModal.jsx";
import SignupModal from "./Signup/SignupModal.jsx";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top py-3">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#home">Dr.PHONE</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-5">
              <li className="nav-item"><a className="nav-link text-white fw-bold" href="#home">Home</a></li>
              <li className="nav-item"><a className="nav-link text-white fw-bold" href="#services">Services</a></li>
              <li className="nav-item"><a className="nav-link text-white fw-bold" href="#about">About</a></li>
              <li className="nav-item me-5"><a className="nav-link text-white fw-bold" href="#contact">Contact</a></li>
            </ul>

            <div className="d-flex ms-auto">
           <button
              class="btn btn-success"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
            >
              Login
            </button>

<button
  className="btn btn-warning fw-bold ms-2"
  data-bs-toggle="modal"
  data-bs-target="#signupModal"
>
  Sign Up
</button>


            </div>
          </div>
        </div>
      </nav>

      {/* ✅ Bootstrap Modal for Login */}
      {showLogin && (
        <div className="modal show fade d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content p-4">
              <LoginCard onClose={() => setShowLogin(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
