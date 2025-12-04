import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
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
    // Handle login logic here
    console.log('Login data:', formData);
  };



  return (
    <div className="login-container">
      <div className="logo">
        <h1>Tourism Management System</h1>
        <p>Explore historical sites with expert guidance</p>
      </div>
      
      <div className="login-box">
        <h2>Login</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              name="username" 
              placeholder="Enter your email" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
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
          
          <button type="submit">Login</button>
        </form>
        
        <div className="forgot-password">
          <Link to="/forgot">Forgot your password?</Link>
        </div>
        
        <div className="register-link">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;