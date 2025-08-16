import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoginCard from "./components/Login/LoginModal.jsx";
import Home from "./pages/Home";
import "./index.css";
import "./home.css";
import LoginModal from "./components/Login/LoginModal.jsx";
import SignupModal from "./components/Signup/SignupModal.jsx";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navigation */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow-1">
        <Home />
      </main>

      {/* Footer */}
      <Footer />
    <LoginModal/>
    <SignupModal/>
    </div>
  );
}

export default App;


