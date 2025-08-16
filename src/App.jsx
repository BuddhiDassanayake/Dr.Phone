import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx"; // Admin login page
import AdminDashboard from "./pages/AdminDashboard.jsx"; // Admin dashboard
import Footer from "./components/Footer.jsx";
import LoginCard from "./components/Login/LoginModal.jsx";
import SignupModal from "./components/Signup/SignupModal.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <Router>
      {/* Navigation */}
      <Navbar />

      {/* Bootstrap Modals */}
      <LoginCard />
      <SignupModal />

      {/* Main Content */}
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
