import React, { useState } from 'react';
import { sendDataLogin } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import '../asset/css/login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendDataLogin(formData);
      console.log('Response from backend:', response);
  
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user)); 
        alert('Login successful!');
        navigate('/', { state: { user: response.user } });
      } else {
        setError('Invalid credentials');
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to login');
      alert('Failed to login');
    }
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='login'>
      <div className="input-container">
        <form onSubmit={handleSubmit}>
          <p className="title">Login</p>
          
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

          {/* <Link to="#" style={{ textDecoration: 'none' }} className="forget">Forgot password?</Link> */}

          <button className="button" type="submit"><span>Login</span></button>

          <p>Don't have an account? <Link to="/register" style={{ textDecoration: 'none' }}>Sign up</Link></p>
        </form>

        <button className="button" onClick={handleBack} style={{ marginTop: '10px' }}><span> Back </span></button>

        {error && <div style={{ color: 'red' }}>{error}</div>}
      </div>
    </div>
  );
};

export default Login;
