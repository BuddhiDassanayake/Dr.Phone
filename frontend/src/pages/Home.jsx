import React from "react";
import "../home.css";
import "../index.css";
import RepairTrackingModal from "../components/RepairTrackingModal";

const features = [
  {
    icon: "bi bi-shield-check",
    title: "Certified Technicians",
    description: "Your device is handled by accredited experts who ensure quality repairs.",
  },
  {
    icon: "bi bi-lightning-charge-fill",
    title: "Same-Day Service",
    description: "We prioritize speed and efficiency to get your device back to you quickly.",
  },
  {
    icon: "bi bi-gem",
    title: "Premium Parts",
    description: "We use only the highest quality parts, backed by our comprehensive warranty.",
  },
];

const howItWorksSteps = [
    {
        icon: "bi bi-card-text",
        title: "1. Get Quotation",
        description: "Tell us the issue with your device, and we'll provide you with a free. ",
    },
    {
        icon: "bi bi-box-seam",
        title: "2. Register Your Device",
        description: "Once you approve the quote, register your phone with us and detail the necessary repairs.",
    },
    {
        icon: "bi bi-tools",
        title: "3. Track Your Repair",
        description: "Stay informed with real-time updates on the status of your repair from start to finish.",
    },
];

const repairServices = [
  { name: "Screen Replacement", img: "/img5.jpeg" },
  { name: "Battery Replacement", img: "/img6.jpeg" },
  { name: "Motherboard Logic", img: "/img7.jpeg" },
  { name: "Water Damage Repair", img: "/img10.jpeg" },
  { name: "Camera & Lenses", img: "/img11.jpeg" },
  { name: "Charging Port Fix", img: "/img12.jpg" },
];

const testimonials = [
  {
    name: "Samantha R.",
    feedback: "The service was incredibly fast and professional. My phone screen is perfect now. I can't recommend them enough!",
    img: "/img8.jpeg",
  },
  {
    name: "Mike Chen",
    feedback: "A truly reliable and honest repair shop. They fixed my laptop's motherboard when others said it was impossible.",
    img: "/img8.jpeg",
  },
];

export default function Home() {
  return (
    <>
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Expert Repairs for Your Mobile Phones.</h1>
          <p className="hero-subtitle">
            Fast, reliable, and professional service for all your mobile Phones.
          </p>
          <button
            className="btn btn-accent btn-lg rounded-pill shadow-lg"
            data-bs-toggle="modal"
            data-bs-target="#repairTrackingModal"
          >
            Track My Repair Status
          </button>
        </div>
      </section>

      <section className="site-section">
        <div className="container">
          <h2 className="section-heading">The Gold Standard in Device Repair</h2>
          <div className="row g-5 text-center">
            {features.map((feature, index) => (
              <div key={index} className="col-md-4">
                <div className="feature-card">
                  <div className="feature-icon">{feature.icon && <i className={feature.icon}></i>}</div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="site-section bg-light">
          <div className="container">
              <h2 className="section-heading">Our Simple 3-Step Process</h2>
              <div className="row g-5">
                  {howItWorksSteps.map((step, index) => (
                      <div key={index} className="col-md-4">
                          <div className="step-card">
                              <div className="step-icon">{step.icon && <i className={step.icon}></i>}</div>
                              <h5 className="step-title">{step.title}</h5>
                              <p className="step-description">{step.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <section id="services" className="site-section">
        <div className="container">
          <h2 className="section-heading">Repairs for Every Major Issue</h2>
          <div className="row g-4">
            {repairServices.map((service, index) => (
              <div key={index} className="col-md-4 col-sm-6">
                <div className="service-card">
                  <img src={service.img} alt={service.name} className="service-img" />
                  <div className="service-overlay">
                    <h5 className="service-name">{service.name}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="site-section bg-light">
        <div className="container">
          <h2 className="section-heading">Trusted by Customers Like You</h2>
          <div className="row g-4 justify-content-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-6">
                <div className="testimonial-card">
                  <i className="bi bi-quote testimonial-quote-icon"></i>
                  <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                  <div className="testimonial-author">
                    <img src={testimonial.img} alt={testimonial.name} className="testimonial-img" />
                    <span className="testimonial-name">{testimonial.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="site-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="section-heading">Have a Question? Get in Touch.</h2>
              <p className="lead mb-5">
                We're here to help. Fill out the form below, and our team will get back to you shortly.
              </p>
              <form className="contact-form">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Your Name" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="email" className="form-control" placeholder="Your Email" required />
                  </div>
                </div>
                <div className="mb-4">
                  <textarea className="form-control" rows="6" placeholder="Your Message" required></textarea>
                </div>
                <button type="submit" className="btn btn-accent btn-lg w-100">Send Your Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <RepairTrackingModal />
    </>
  );
}