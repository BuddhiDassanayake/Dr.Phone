import React from "react";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";

// Styles
import "./index.css";
import "./home.css";

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
    </div>
  );
}

export default App;
