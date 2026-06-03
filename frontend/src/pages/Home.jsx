import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BookSearchModal from "../components/BookSearchModal";
import AuthModal from "../components/AuthModal";
import "../home.css";
import "../index.css";

// Features, Steps, and Categories
const features = [
  { icon: "bi bi-book-half", title: "Vast Collection", description: "Access hundreds of physical books and e-books." },
  { icon: "bi bi-laptop", title: "Digital Access", description: "Read, reserve, and renew books online 24/7." },
  { icon: "bi bi-people-fill", title: "Community Spaces", description: "Enjoy quiet study rooms and collaborative workspaces." },
];

const howItWorksSteps = [
  { icon: "bi bi-search", title: "1. Search Catalog", description: "Browse our online catalog to find resources." },
  { icon: "bi bi-bookmark-check", title: "2. Reserve", description: "Reserve your book online with one click." },
  { icon: "bi bi-arrow-repeat", title: "3. Read & Return", description: "Easily return or renew through our portal." },
];

const bookCategories = [
  { name: "Fiction & Literature", img: "https://images.unsplash.com/photo-1474932430478-367d16b99031?w=500&q=80" },
  { name: "Science & Tech", img: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80" },
  { name: "History", img: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&q=80" },
];

const StatsCounter = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } 
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <div className="stat-item text-center">
      <h2 className="fw-bold text-primary">{count}{suffix}</h2>
      <p className="text-muted fw-semibold">{label}</p>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! A librarian will contact you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <Navbar />

      {/* Modern Hero Section */}
      <section id="home" className="hero-section bg-light py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 mb-3">
                <i className="bi bi-star-fill me-2"></i>Trusted by 50,000+ Readers
              </span>
              <h1 className="display-4 fw-bold mb-4 text-dark">
                Unlock Knowledge at Your <span className="text-primary">Modern Library</span>
              </h1>
              <p className="lead text-muted mb-5">
                Fast, reliable, and seamless access to a world of information. Discover books, digital resources, and quiet spaces tailored for you.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <button className="btn btn-primary btn-lg rounded-pill px-4 shadow" data-bs-toggle="modal" data-bs-target="#bookSearchModal">
                  <i className="bi bi-search me-2"></i>Search Catalog
                </button>
                <button className="btn btn-outline-dark btn-lg rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#authModal">
                  Become a Member
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <img src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80" alt="Library" className="img-fluid rounded-4 shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5 border-bottom">
        <div className="container">
          <div className="row g-4">
            <div className="col-6 col-md-3"><StatsCounter end={100} label="Books Available" suffix="k+" /></div>
            <div className="col-6 col-md-3"><StatsCounter end={15} label="Active Members" suffix="k+" /></div>
            <div className="col-6 col-md-3"><StatsCounter end={24} label="Digital Access" suffix="/7" /></div>
            <div className="col-6 col-md-3"><StatsCounter end={50} label="Study Rooms" suffix="+" /></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="services" className="py-5 bg-light">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Explore by Category</h2>
            <p className="text-muted">Find exactly what you need.</p>
          </div>
          <div className="row g-4">
            {bookCategories.map((cat, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                  <img src={cat.img} className="card-img-top" alt={cat.name} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body text-center p-4">
                    <h5 className="fw-bold">{cat.name}</h5>
                    <button className="btn btn-light rounded-pill mt-3 text-primary" data-bs-toggle="modal" data-bs-target="#bookSearchModal">
                      Browse Shelf <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="fw-bold mb-4">Need Help Finding a Book?</h2>
              <p className="text-muted mb-4">Fill out the form and our librarians will get back to you within 24 hours.</p>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3"><i className="bi bi-geo-alt fs-5"></i></div>
                <div><h6 className="mb-0 fw-bold">Visit Us</h6><p className="text-muted mb-0">123 Knowledge Ave, Book City</p></div>
              </div>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3"><i className="bi bi-envelope fs-5"></i></div>
                <div><h6 className="mb-0 fw-bold">Email Us</h6><p className="text-muted mb-0">librarian@modernlibrary.com</p></div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm border">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Name</label>
                    <input type="text" className="form-control rounded-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input type="email" className="form-control rounded-3 py-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Message</label>
                    <textarea className="form-control rounded-3 py-2" rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-3 rounded-pill fw-bold">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inject Modals at the bottom of the page */}
      <BookSearchModal />
      <AuthModal />
    </div>
  );
}