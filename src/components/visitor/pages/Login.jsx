import React from 'react';
import LoginForm from '../forms/LoginForm';
import ThemeToggle from '../../common/ThemeToggle';
import '../styles/login.css';

function Login() {
  return (
    <div className="login-page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <LoginForm />
    </div>
  );
}

export default Login;