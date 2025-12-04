import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav">
        <div className="logo">Tourism_MS</div>
        
        <div 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          id="menuToggle"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`} id="navLinks">
          <Link to="/" className="btn" onClick={closeMenu}>Home</Link>
          <a href="#about" className="btn" onClick={closeMenu}>About</a>
          <a href="#feature" className="btn" onClick={closeMenu}>Feature</a>
          <a href="#contact" className="btn" onClick={closeMenu}>Contact</a>
          <Link to="/login" className="login-btn" onClick={closeMenu}>Sign In</Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
