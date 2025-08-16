<<<<<<< HEAD
import React from 'react';
import './navbar.css'; // import custom CSS
=======
import React from "react";
import "./Navbar.css"; // import the CSS file
>>>>>>> repair-tracking

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top py-3">
      <div className="container">
<<<<<<< HEAD
        <a className="navbar-brand fw-bold" href="#home">MySite</a>

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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link text-white fw-bold" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold" href="#services">Services</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white fw-bold" href="#contact">Contact</a>
            </li>
=======
        <a className="navbar-brand fw-bold" href="#home">Dr.PHONE</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto me-5 ">
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#home">Home</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#services">Services</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold" href="#about">About</a></li>
            <li className="nav-item"><a className="nav-link text-white fw-bold me-5" href="#contact">Contact</a></li>
            

            {/* Right Side Buttons */}
        <div className="d-flex  ms-auto">
          <a href="#login" className="btn btn-outline-light me-2 fw-bold me-3">Login</a>
          <a href="#signup" className="btn btn-warning fw-bold">Signup</a>
        </div>

>>>>>>> repair-tracking
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
