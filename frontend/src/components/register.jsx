import React, { useState } from 'react';
import { sendDataToBackend } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../asset/css/login.css';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    rePassword: '' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.rePassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await sendDataToBackend(formData);
      console.log('Response from backend:', response);
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to register');
      alert('Failed to register');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login">
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <p className="title">Register</p>

          <div className="detail-container">
            <input
              type="text"
              name="username"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <label className="label">Enter Name</label>
            <div className="underline"></div>
          </div>

          <div className="detail-container">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label className="label">Enter Email</label>
            <div className="underline"></div>
          </div>

          <div className="detail-container">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label className="label">Enter Password</label>
            <div className="underline"></div>
          </div>

          <div className="detail-container">
            <input
              type="password"
              name="rePassword"
              value={formData.rePassword}
              onChange={handleChange}
              required
            />
            <label className="label">Re-enter Password</label>
            <div className="underline"></div>
          </div>


          <button className="button" type="submit"><span>Register</span></button>

          <p>Already have an account? <Link to="/login" style={{ textDecoration: 'none' }}>Login</Link></p>
        </form>

        <button className="button" onClick={handleBack} style={{ marginTop: '10px' }}><span> Back </span></button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default Register;
