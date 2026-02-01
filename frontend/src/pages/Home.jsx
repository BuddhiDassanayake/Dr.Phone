import React, { useState, useEffect } from "react";
import "../home.css";
import "../index.css";
import RepairTrackingModal from "../components/RepairTrackingModal";

// Defines an array of features offered by the service
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

// Defines an array of steps explaining how the repair process works
const howItWorksSteps = [
  {
    icon: "bi bi-card-text",
    title: "1. Get Quotation",
    description: "Tell us the issue with your device, and we'll provide you with a free, transparent quote instantly.",
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

// Defines an array of repair services offered, including images
const repairServices = [
  { name: "Screen Replacement", img: "/img5.jpeg" },
  { name: "Battery Replacement", img: "/img6.jpeg" },
  { name: "Motherboard Logic", img: "/img7.jpeg" },
  { name: "Water Damage Repair", img: "/img10.jpeg" },
  { name: "Camera & Lenses", img: "/img11.jpeg" },
  { name: "Charging Port Fix", img: "/img12.jpg" },
];

// Defines an array of customer testimonials
const testimonials = [
  {
    name: "Samantha R.",
    feedback: "The service was incredibly fast and professional. My phone screen is perfect now. I can't recommend them enough!",
    img: "/img8.jpeg",
    rating: 5,
  },
  {
    name: "Mike Chen",
    feedback: "A truly reliable and honest repair shop. They fixed my laptop's motherboard when others said it was impossible.",
    img: "/img8.jpeg",
    rating: 5,
  },
];

// Stats counter component
const StatsCounter = ({ end, label, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="stat-item">
      <h3 className="stat-number">{count}{suffix}</h3>
      <p className="stat-label">{label}</p>
    </div>
  );
};

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Hero Section with Enhanced Design */}
      <section id="home" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <i className="bi bi-star-fill"></i>
            <span>Trusted by 10,000+ Customers</span>
          </div>
          <h1 className="hero-title">
            Expert Repairs for Your <span className="text-gradient">All Mobile Devices</span>
          </h1>
          <p className="hero-subtitle">
            Fast, reliable, and professional service for all your mobile phones. 
            Get your device back to perfect condition with our certified technicians.
          </p>
          
          <div className="hero-buttons">
            <button
              className="btn btn-primary btn-lg rounded-pill shadow-lg"
              data-bs-toggle="modal"
              data-bs-target="#repairTrackingModal"
            >
              <i className="bi bi-search me-2"></i>
              Track My Repair
            </button>
            <a href="#contact" className="btn btn-outline-light btn-lg rounded-pill">
              <i className="bi bi-chat-dots me-2"></i>
              Get a Quote
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="hero-stats">
            <div className="stat-item">
              <i className="bi bi-check-circle-fill"></i>
              <span>Same-Day Service</span>
            </div>
            <div className="stat-item">
              <i className="bi bi-shield-fill-check"></i>
              <span>Warranty Included</span>
            </div>
            <div className="stat-item">
              <i className="bi bi-lightning-fill"></i>
              <span>Fast Turnaround</span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row text-center g-4">
            <div className="col-6 col-md-3">
              <StatsCounter end={10000} label="Devices Repaired" suffix="+" />
            </div>
            <div className="col-6 col-md-3">
              <StatsCounter end={98} label="Success Rate" suffix="%" />
            </div>
            <div className="col-6 col-md-3">
              <StatsCounter end={24} label="Hour Service" suffix="h" />
            </div>
            <div className="col-6 col-md-3">
              <StatsCounter end={5000} label="Happy Customers" suffix="+" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="site-section features-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="section-badge">Why Choose Us</span>
            <h2 className="section-heading">The Gold Standard in Device Repair</h2>
            <p className="section-subheading">
              We combine expertise, quality parts, and exceptional service to deliver the best repair experience.
            </p>
          </div>
          
          <div className="row g-4">
            {features.map((feature, index) => (
              <div key={index} className="col-lg-4 col-md-6">
                <div className="feature-card">
                  <div className="feature-icon-wrapper">
                    <div className="feature-icon">
                      {feature.icon && <i className={feature.icon}></i>}
                    </div>
                  </div>
                  <h5 className="feature-title">{feature.title}</h5>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="site-section how-it-works-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="section-badge">Process</span>
            <h2 className="section-heading">Our Simple 3-Step Process</h2>
            <p className="section-subheading">
              Getting your device repaired has never been easier. Follow these simple steps.
            </p>
          </div>
          
          <div className="row g-4 position-relative">
            <div className="process-line d-none d-md-block"></div>
            
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="col-lg-4 col-md-4">
                <div className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <div className="step-icon-wrapper">
                    <div className="step-icon">
                      {step.icon && <i className={step.icon}></i>}
                    </div>
                  </div>
                  <h5 className="step-title">{step.title}</h5>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="site-section services-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="section-badge">Our Services</span>
            <h2 className="section-heading">Repairs for Every Major Issue</h2>
            <p className="section-subheading">
              From cracked screens to water damage, we handle all types of mobile phone repairs.
            </p>
          </div>
          
          <div className="row g-4">
            {repairServices.map((service, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-6">
                <div className="service-card">
                  <div className="service-img-wrapper">
                    <img src={service.img} alt={service.name} className="service-img" />
                    <div className="service-overlay">
                      <div className="service-content">
                        <h5 className="service-name">{service.name}</h5>
                        <button className="btn btn-light btn-sm rounded-pill mt-2">
                          Learn More <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="site-section testimonials-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <span className="section-badge">Testimonials</span>
            <h2 className="section-heading">Trusted by Customers Like You</h2>
            <p className="section-subheading">
              Don't just take our word for it. See what our satisfied customers have to say.
            </p>
          </div>
          
          <div className="row g-4 justify-content-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-lg-6 col-md-6">
                <div className="testimonial-card">
                  <div className="testimonial-header">
                    <i className="bi bi-quote testimonial-quote-icon"></i>
                    <div className="testimonial-rating">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </div>
                  </div>
                  <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                  <div className="testimonial-author">
                    <img src={testimonial.img} alt={testimonial.name} className="testimonial-img" />
                    <div className="testimonial-info">
                      <span className="testimonial-name">{testimonial.name}</span>
                      <span className="testimonial-position">Verified Customer</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2 className="cta-heading">Ready to Fix Your Device?</h2>
            <p className="cta-subheading">
              Get your free quote today and experience the best repair service in town.
            </p>
            <div className="cta-buttons">
              <a href="#contact" className="btn btn-light btn-lg rounded-pill">
                <i className="bi bi-calendar-check me-2"></i>
                Book Now
              </a>
              <button
                className="btn btn-outline-light btn-lg rounded-pill"
                data-bs-toggle="modal"
                data-bs-target="#repairTrackingModal"
              >
                <i className="bi bi-search me-2"></i>
                Track Repair
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="site-section contact-section">
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="contact-info">
                <span className="section-badge">Get In Touch</span>
                <h2 className="section-heading mb-4">Have a Question? We're Here to Help.</h2>
                <p className="mb-4">
                  Fill out the form and our team will get back to you within 24 hours. 
                  You can also reach us through the following channels:
                </p>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="contact-text">
                      <h6>Visit Us</h6>
                      <p>123 Repair Street, Tech City, TC 12345</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div className="contact-text">
                      <h6>Call Us</h6>
                      <p>+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div className="contact-text">
                      <h6>Email Us</h6>
                      <p>support@phonerepair.com</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="bi bi-clock-fill"></i>
                    </div>
                    <div className="contact-text">
                      <h6>Working Hours</h6>
                      <p>Mon - Sat: 9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="contact-form-wrapper">
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Your Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="6"
                      placeholder="Tell us about your device issue..."
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill">
                    <i className="bi bi-send me-2"></i>
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Repair Tracking Modal */}
      <RepairTrackingModal />
    </>
  );
}