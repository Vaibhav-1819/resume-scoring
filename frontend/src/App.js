import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Candidates from "./pages/Candidates";
import CandidateDetailPage from "./pages/CandidateDetail";
import NotFound from "./pages/NotFound";
import "./App.css";

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📊 Resume Scorer
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={isActive('/')}>
            🏠 Home
          </Link>
        </li>
        <li>
          <Link to="/candidates" className={isActive('/candidates')}>
            👥 Candidates
          </Link>
        </li>
      </ul>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidate/:id" element={<CandidateDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <footer style={{
          textAlign: 'center',
          padding: '30px',
          color: 'white',
          marginTop: '50px',
          opacity: '0.8'
        }}>
          <p>Built with ❤️ using Spring Boot + React</p>
          <p style={{fontSize: '14px', marginTop: '5px'}}>Resume Scoring System © 2025</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;