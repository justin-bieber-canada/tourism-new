import React from 'react';

function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-title">
          <h2>About</h2>
        </div>
        <div className="about-content">
          <div className="about-img">
            <img src="image/tourism.avif" alt="Tourism Management" />
          </div>
          <div className="about-text">
            <h3>About Tourism Management <span>System </span></h3>
            <p>Our platform bridges the gap between historical site enthusiasts and 
              professional tourism services. We provide a comprehensive ecosystem where 
              visitors can explore, researchers can contribute, and guides can connect 
              with interested explorers.</p>
            <p>With years of experience in the tourism industry, we've created a system that 
              benefits all stakeholders while preserving and promoting cultural heritage.</p>
            <p>Join our community of over 100 registered users and explore more 
              than 50 historical sites across the country.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;