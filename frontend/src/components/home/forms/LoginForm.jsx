import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../services/authService';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError('');

    try {
      const user = await authService.login(email, password);

      if (user) {
        if (user.is_active === false || user.is_active === 0) {
          alert('Your account has been deactivated. Please contact the administrator.');
          return;
        }

        const userType = user.user_type ? user.user_type.toLowerCase().trim() : 'visitor';

        // Store role-specific tokens for compatibility
        const token = localStorage.getItem('token');
        if (userType === 'admin') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
          navigate('/admin/dashboard');
        } else if (userType === 'researcher') {
          localStorage.setItem('researcher_token', token);
          localStorage.setItem('researcher_user', JSON.stringify(user));
          navigate('/researcher/dashboard');
        } else if (userType === 'guide' || userType === 'site_agent') {
          localStorage.setItem('guide_token', token);
          localStorage.setItem('guide_user', JSON.stringify(user));
          navigate('/guide/dashboard');
        } else {
          localStorage.setItem('visitor_token', token);
          localStorage.setItem('visitor_user', JSON.stringify(user));
          navigate('/visitor/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Invalid credentials. Please check your email and password.');
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
        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <div className="password-wrapper">
              <input 
                type="password"
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
