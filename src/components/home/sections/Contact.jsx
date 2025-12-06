import React from 'react';

function Contact() {
  const contactMethods = [
    {
      icon: 'fa-envelope',
      title: 'Email Support',
      details: 'yoseph2719@gmail.com'
    },
    {
      icon: 'fa-phone',
      title: 'Phone',
      details: '+251 9 61 74 18 06'
    },
    {
      icon: 'fa-align-center',
      title: 'Headquarters',
      details: 'Debre Berhan, Ethiopia'
    }
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2>Contact Us</h2>
          <p>Get in touch with our team for any questions or support regarding the Tourism Management System</p>
        </div>
        
        <div className="contact-grid">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon">
                <i className={`fa-solid ${method.icon}`}></i>
              </div>
              <h3>{method.title}</h3>
              <p>{method.details}</p>
            </div>
          ))}
        </div>
        
        <div className="contact-support">
          <p>Response Time: Within 24 hours</p>
          <p className="support-email">Primary Contact: yoseph2719@gmail.com</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;