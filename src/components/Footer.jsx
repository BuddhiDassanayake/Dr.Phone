import Home from "../pages/Home"

export default function Footer() {
  return (
    <footer id ="contact" className="bg-success text-white pt-5 pb-5">
      <div className="container">
        <div className="row">

          {/* Logo & Description */}
          <div className="col-md-3 mb-3">
            <h5 className="fw-bold">
              <img src="/logo.png" alt="Dr.Phone" style={{ height: '25px', marginRight: '5px' }} />
              Dr.PHONE
            </h5>
            <p className="small">
              Professional phone repair services with expert technicians and genuine parts.  
              Your trusted device repair solution.
            </p>
            <div>
              <a href="#" className="text-white me-2"><i className="bi bi-github"></i></a>
              <a href="#" className="text-white me-2"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white"><i className="bi bi-apple"></i></a>
            </div>
          </div>

          {/* Services */}
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Services</h6>
            <ul className="list-unstyled small">
              <li>Screen Repair</li>
              <li>Battery Replacement</li>
              <li>Water Damage</li>
              <li>Camera Repair</li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled small">
              <li>Track Repair</li>
              <li>Warranty</li>
              <li>FAQ</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 mb-3">
            <h6 className="fw-bold">Contact Info</h6>
            <ul className="list-unstyled small">
              <li><i className="bi bi-geo-alt-fill me-2"></i>123 Tech Street, Digital City</li>
              <li><i className="bi bi-telephone-fill me-2"></i>(999) 123-TECH</li>
              <li><i className="bi bi-envelope-fill me-2"></i>info@drphone.com</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
