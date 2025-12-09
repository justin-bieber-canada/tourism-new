import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero-modern" id="home">
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-badge">✨ Explore Ethiopia's Heritage</span>
          <h1>Discover Historical Wonders with <span className="text-gradient">Expert Guidance</span></h1>
          <p>
            Experience rich cultural heritage through our modern tourism management platform. 
            Connect with certified guides, book exclusive tours, and explore ancient treasures like never before.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="cta-button primary">Start Your Journey</Link>
            <Link to="/login" className="cta-button secondary">Sign In</Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Historical Sites</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Happy Visitors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
           <div className="image-wrapper">
             <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Lalibela" className="hero-img-main" />
             <div className="floating-card card-1">
                <span>🏛️ Ancient History</span>
             </div>
             <div className="floating-card card-2">
                <span>⭐ Top Rated Guides</span>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;