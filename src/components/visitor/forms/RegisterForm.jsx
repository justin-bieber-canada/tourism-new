import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { visitorService } from '../../../services/visitorService';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Map form data to user object structure
    const userData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password, // In real app, hash this!
      username: formData.email // Use email as username for simplicity
    };

    visitorService.register(userData).then(() => {
      alert('Registration successful! Please login.');
      navigate('/login');
    });
  };


  return (
    <div className="register-container">
      <div className="logo">
        <h1>Tourism Management System</h1>
        <p>Join our community of explorers</p>
      </div>
      
      <div className="register-box">
        <h2>Create Your Account</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="name-group">
            <div className="form-group">
              <label htmlFor="first-name">First Name</label>
              <input 
                type="text" 
                id="first-name" 
                name="firstName" 
                placeholder="Enter your first name" 
                value={formData.firstName}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last-name">Last Name</label>
              <input 
                type="text" 
                id="last-name" 
                name="lastName" 
                placeholder="Enter your last name" 
                value={formData.lastName}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="Enter your phone number" 
              value={formData.phone}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="birthdate">Birth Date</label>
            <input 
              type="date" 
              id="birthdate" 
              name="birthdate" 
              value={formData.birthdate}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input 
              type="text" 
              id="address" 
              name="address" 
              placeholder="Enter your full address" 
              value={formData.address}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input 
                type= "password"
                name="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleChange}
                required 
                id="password" 
              />
            </div>
          </div>             
          
          <button type="submit">Register</button>
        </form>
        
        <div className="login-link">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;