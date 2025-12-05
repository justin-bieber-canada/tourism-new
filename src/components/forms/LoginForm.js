import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';


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

    const user = dataService.findUser(username, password);

    if (user) {
      if (!user.is_active) {
        alert('Your account has been deactivated. Please contact the administrator.');
        return;
      }

      const userType = user.user_type ? user.user_type.toLowerCase().trim() : 'visitor';

      if (userType === 'admin') {
        localStorage.setItem('admin_token', 'mock-admin-token');
        localStorage.setItem('admin_user', JSON.stringify(user));
        navigate('/admin/dashboard');
      } else if (userType === 'researcher') {
        localStorage.setItem('researcher_token', 'mock-researcher-token');
        localStorage.setItem('researcher_user', JSON.stringify(user));
        navigate('/researcher/dashboard');
      } else if (userType === 'guide' || userType === 'site_agent') {
        localStorage.setItem('guide_token', 'mock-guide-token');
        localStorage.setItem('guide_user', JSON.stringify(user));
        navigate('/guide/dashboard');
      } else {
        // Visitor
        localStorage.setItem('visitor_token', 'mock-visitor-token');
        localStorage.setItem('visitor_user', JSON.stringify(user));
        navigate('/visitor/dashboard');
      }
    } else {
      alert('Invalid credentials. Please check your username and password.');
    }
  };



  return (
    <div className="login-container">
      <div className="logo">
        <h1>Tourism Management System</h1>
        <p>Explore historical sites with expert guidance</p>
      </div>
      
      <div className="login-box">
        <h2>Sign In</h2>
        
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