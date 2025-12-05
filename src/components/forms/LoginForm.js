import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { visitorService } from '../../services/visitorService';


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

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = formData;

    // Admin Login Check
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_token', 'mock-admin-token');
      localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', name: 'Administrator', role: 'admin' }));
      navigate('/admin/dashboard');
      return;
    }

    // Visitor Login Check
    visitorService.login(username, password)
      .then(user => {
        localStorage.setItem('visitor_token', 'mock-visitor-token');
        localStorage.setItem('visitor_user', JSON.stringify(user));
        navigate('/visitor/dashboard');
      })
      .catch(err => {
        alert('Invalid credentials. Please register if you do not have an account.');
      });
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