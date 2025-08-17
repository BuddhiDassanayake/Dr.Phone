import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Customers from "./pages/Customers.jsx";
import Repairs from "./pages/Repairs.jsx";
import RepairTrackingModal from "./components/RepairTrackingModal.jsx";
import LoginCard from "./components/Login/LoginModal.jsx";
import SignupModal from "./components/Signup/SignupModal.jsx";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <Router>
      {/* Navbar */}
      <Navbar />

      {/* Bootstrap Modals */}
      <LoginCard />
      <SignupModal />
      <RepairTrackingModal />

      {/* Main Content */}
      <main className="flex-grow-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />

          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/repairs" element={<Repairs />} />

          {/* Optional: Add more admin routes */}
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
