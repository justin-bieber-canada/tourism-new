import React from 'react';
import '../styles/components/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="logoo">Tourism_MS</div>
      <span>&copy; {new Date().getFullYear()} Tourism Management System. All rights reserved.</span>
    </footer>
  );
}

export default Footer;