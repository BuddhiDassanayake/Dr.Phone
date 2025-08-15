import React from 'react';
import './navbar.css'; // import custom CSS

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success fixed-top py-3">
      <div className="container">
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
