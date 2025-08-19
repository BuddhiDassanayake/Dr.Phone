import React from "react";
import "../footer.css"; // Ensure this CSS file is created and imported

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="row footer-content">

          {/* Column 1: Brand & Socials */}
          <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
            <h5 className="footer-brand">Dr.PHONE</h5>
            <p className="footer-description">
              Your trusted solution for professional smartphone repairs. We use expert technicians and premium parts to bring your device back to life.
            </p>
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="bi bi-github"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-4 mb-4 mb-md-0">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links list-unstyled">
              <li><a href="#home">Home</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
            <h6 className="footer-heading">Support</h6>
            <ul className="footer-links list-unstyled">
              <li>
                <a href="#!" data-bs-toggle="modal" data-bs-target="#repairTrackingModal">
                  Track My Repair
                </a>
              </li>
              <li><a href="#!">Warranty Policy</a></li>
              <li><a href="#!">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="col-lg-3 col-md-4 mb-4 mb-md-0">
            <h6 className="footer-heading">Contact Info</h6>
            <ul className="footer-contact list-unstyled">
              <li><i className="bi bi-geo-alt-fill"></i><span>123 Tech Street, Digital City</span></li>
              <li><i className="bi bi-telephone-fill"></i><span>(999) 123-TECH</span></li>
              <li><i className="bi bi-envelope-fill"></i><span>info@drphone.com</span></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Dr.PHONE. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}