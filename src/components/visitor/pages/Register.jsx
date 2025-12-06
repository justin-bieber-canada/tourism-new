import React from 'react';
import RegisterForm from '../forms/RegisterForm';
import ThemeToggle from '../../common/ThemeToggle';
import '../styles/register.css';

function Register() {
  return (
    <div className="register-page" style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      <RegisterForm />
    </div>
  );
}

export default Register;