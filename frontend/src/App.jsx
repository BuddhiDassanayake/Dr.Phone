// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Repairs from "./pages/Repairs.jsx";
import ChatBot from "./components/ChatBot"; // Ensure path is correct

function AppContent() {
  const location = useLocation();

  // Define admin page paths where you DON'T want the chatbot or public footer
  const adminPages = ["/admin", "/admin/dashboard", "/admin/customers", "/admin/repairs"];
  const isAdminPage = adminPages.includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar stays at the top */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />

          {/* Admin Pages */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/repairs" element={<Repairs />} />
        </Routes>
      </main>

      {/* 
         1. Call ChatBot here as a regular component.
         2. Use !isAdminPage so it only shows on public routes.
      */}
      {!isAdminPage && <ChatBot />}

      {/* Footer: only for non-admin pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;