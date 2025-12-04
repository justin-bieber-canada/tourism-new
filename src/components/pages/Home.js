import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Features from '../sections/Features';
import Contact from '../sections/Contact';
import '../styles/index.css';

function Home() {
  return (
    <div className="home-page">
      <Header />
      <Hero />
      <About />
      <Features />
      <Contact />
      <Footer />
    </div>
  );
}

export default Home;