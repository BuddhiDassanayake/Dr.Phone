import React from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
=======
>>>>>>> repair-tracking

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
<<<<<<< HEAD
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
=======
>>>>>>> repair-tracking

// Styles
import "./index.css";
import "./home.css";

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="d-flex flex-column min-vh-100">
        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-grow-1 container mt-5 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
=======
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow-1">
        <Home />
      </main>

      {/* Footer */}
      <Footer />
    </div>
>>>>>>> repair-tracking
  );
}

export default App;
