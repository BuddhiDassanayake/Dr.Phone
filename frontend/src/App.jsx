// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx"; // existing footer for public pages
import Home from "./pages/Home.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Repairs from "./pages/Repairs.jsx";

function AppContent() {
  const location = useLocation();

  // Define admin page paths
  const adminPages = ["/admin", "/admin/dashboard", "/admin/customers", "/admin/repairs"];
  const isAdminPage = adminPages.includes(location.pathname);

  return (
    <>
      {/* Navbar */}
      <Navbar />

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
        </Routes>
      </main>

      {/* Footer: only for non-admin pages */}
      {!isAdminPage && <Footer />}
    </>
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
