import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


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
    // Simple local check: if admin credentials entered, redirect to admin dashboard
    const { username, password } = formData;
    console.log('Login data:', formData);
    // Default admin credentials (change in adminService.mock.js if needed)
    if (username === 'admin' && password === 'admin123') {
      // store a mock admin token and user info so AdminRoute allows access
      localStorage.setItem('admin_token', 'mock-admin-token');
      localStorage.setItem('admin_user', JSON.stringify({ username: 'admin', name: 'Administrator' }));
      // Do not force change password; let admin use the Change Password link when desired
      navigate('/admin/dashboard');
      return;
    }

    // Otherwise proceed with normal login (visitor/user) flow - replace with real auth
    alert('Login successful (mock). For admin use username: admin and password: admin123');
  };

  const navigate = useNavigate();



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