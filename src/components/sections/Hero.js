import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero" id="home">
      <h1>Discover Historical Wonders</h1>
      <p>Experience the rich cultural heritage and historical sites with our comprehensive tourism management system. Connect with expert guides and explore ancient treasures.</p>
      <Link to="/register" className="cta-button">Start Your Journey</Link>
    </section>
  );
}

export default Hero;