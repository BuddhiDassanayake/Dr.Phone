import React from "react";
import "../home.css";
import "../index.css";
import RepairTrackingModal from "../components/RepairTrackingModal";


// Features array
const features = [
  {
    title: "Trusted Professionals",
    description: "We have certified technicians ready to help.",
    img: "img2.avif",
  },
  {
    title: "Quick Turnaround",
    description: "Most repairs done in under 24 hours.",
    img: "img3.jpg",
  },
  {
    title: "Free Diagnostics",
    description: "We check your device for free before repair.",
    img: "img4.png",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section id="home" className="py-5 hero  ">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-start">
              <h1 className="fw-bold">Your One-Stop Solution for Mobile Repairs</h1>
              <p className="lead text-secondary">Fast, Fair, Reliable</p>
            <a
  href="#"
  className="btn btn-success btn-lg rounded-pill text-white shadow-lg"
  data-bs-toggle="modal"
  data-bs-target="#repairTrackingModal"
>
  Repair Tracking
</a>


            </div>
            <div className="col-md-6 text-center"></div>
          </div>
        </div>
      </section>
      

      {/* Features Grid */}
      <section id="home" className="features-section">
        <h2 className="features-title">Our Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-box">
              <img
                src={feature.img}
                alt={feature.title}
                className="img-fluid mb-3"
                style={{ maxHeight: "100px", objectFit: "contain" }}
              />
              <h5 className="feature-title">{feature.title}</h5>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Repairs Section */}
     <section id="services" className="features-section" pb-5>
  <h2 className="features-title">All kinds of repairs. For real.</h2>
  <div className="features-grid">
    {[
      { name: "Screen Replacement", img: "img5.jpeg" },
      { name: "Battery Replacement", img: "img6.jpeg" },
      { name: "Motherboard Repair", img: "img7.jpeg" },
      { name: "Water Damage Repair", img: "img10.jpeg" },
      { name: "Camera Replacement", img: "img11.jpeg" },
      { name: "Charging Port Repair", img: "img12.jpg" }
    ].map((repair, index) => (
      <div key={index} className="feature-box text-center">
        <img
          src={repair.img}
          alt={repair.name}
          className="img-fluid mb-3"
          style={{ maxHeight: "150px", objectFit: "contain" }}
        />
        <h5 className="feature-title">{repair.name}</h5>
      </div>
    ))}
  </div>
</section>


      {/* Testimonials Section */}
     <section id="about" className="features-section py-5" style={{  color: '#fff' }}>
  <div className="container">
    <h2 className="features-title text-center mb-5">What Our Customers Say</h2>

    <div className="row g-4 justify-content-center">
      {[
        { name: "John Doe", rating: 5, feedback: "Great service! My phone feels brand new.", img: "/img8.jpeg" },
        { name: "Lisa Ray", rating: 5, feedback: "Quick and affordable repair. Highly recommended.", img: "/img8.jpeg" },
        { name: "Mike Chen", rating: 5, feedback: "Professional team, great results!", img: "/img8.jpeg" },
        { name: "Emma Watson", rating: 5, feedback: "Excellent customer support and fast repair.", img: "/img8.jpeg" },
        { name: "David Lee", rating: 5, feedback: "Reliable service. I trust them with all my devices.", img: "/img8.jpeg" },
      ].map((testimonial, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <div className="card text-center shadow-sm h-100" style={{ borderRadius: '15px' }}>
            <img
              src={testimonial.img}
              alt={testimonial.name}
              className="card-img-top mx-auto mt-3"
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="card-title">{testimonial.name}</h5>
              <p className="card-text">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning"></i>
                ))}
              </p>
              <p className="card-text fst-italic">"{testimonial.feedback}"</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Contact Form Section in Grid/Card Layout */}
  <section  id="contact" className="features-section">
  <div className="container py-5">
    <h2 className="features-title text-center mb-4">Contact Us</h2>
    <div className="row justify-content-center">
      {/* Contact Form Card */}
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card p-4 shadow-sm">
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Your name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Your message"
              ></textarea>
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
<RepairTrackingModal />

    </>
  );
}