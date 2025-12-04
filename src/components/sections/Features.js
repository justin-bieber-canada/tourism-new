import React from 'react';

function Features() {
  const features = [
    {
      icon: 'fa-sharp fa-solid fa-sitemap',
      title: 'Explore Sites',
      description: 'Browse through hundreds of historical sites with detailed information, photos, and location maps.'
    },
    {
      icon: 'fa-discord',
      title: 'Site Discovery',
      description: 'Advanced search and filtering to find historical sites based on location, era, and cultural significance.'
    },
    {
      icon: 'fa-buromobelexperte',
      title: 'Expert Guides',
      description: 'Connect with certified site agents and guides for an enriched historical experience.'
    },
    {
      icon: 'fa-person-breastfeeding',
      title: 'Guide Matching',
      description: 'Smart algorithm matches you with the perfect guide based on your interests and language preferences.'
    },
    {
      icon: 'fa-angle-right',
      title: 'Rich Content',
      description: 'Access verified historical information curated by tourism experts and researchers.'
    },
    {
      icon: 'fa-list-check',
      title: 'Visit Tracking',
      description: 'Track visit history, request status, and upcoming scheduled visits in your dashboard.'
    }
  ];

  return (
    <section className="features" id="feature">
      <div className="section-title">
        <h2>Feature</h2>
        <p>Discover the features that make us the preferred choice for tourism management</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">
              <i className={`fa-sharp fa-solid ${feature.icon}`}></i>
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;