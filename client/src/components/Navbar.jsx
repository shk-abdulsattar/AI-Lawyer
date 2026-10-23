import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiMic } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar({ onStartVoice }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <nav className={`editorial-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        
        <Link to="/" className="brand-logo">
          <span className="brand-text">AI Lawyer</span>
        </Link>

        
        <div className={`nav-menu ${menuOpen ? 'menu-open' : ''}`}>
          <Link to="/" className={`menu-link ${location.pathname === '/' ? 'active' : ''}`}>
            TALK TO AI
          </Link>
          <Link to="/analyze" className={`menu-link ${location.pathname === '/analyze' ? 'active' : ''}`}>
            CHECK DOCUMENT
          </Link>
          <Link to="/find-lawyer" className={`menu-link ${location.pathname === '/find-lawyer' ? 'active' : ''}`}>
            FIND LAWYER
          </Link>
          <Link to="/rights" className={`menu-link ${location.pathname === '/rights' ? 'active' : ''}`}>
            YOUR RIGHTS
          </Link>
        </div>

        <div className="nav-right">
          <button 
            type="button"
            className="nav-get-started-btn"
            onClick={onStartVoice}
          >
            <span className="nav-btn-content">
              <span className="nav-live-dot" />
              <span>TALK TO AI</span>
            </span>
          </button>

          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
