
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
  });}
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData, { withCredentials: true });
      if (response.data.state === 'success') {
        alert(response.data.message + ' ' + response.data.username + '!');
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/home');
      } else {
        alert('Log in failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error during log in:', error);
      alert('An error occurred.' + error.request.response);
    }
  }

  return (
    <div className="login-container d-flex justify-content-center align-items-center flex-column">
      <h1 className="mb-3">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" name="username" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success">Login</button>
        </div>
      </form>
      <p className="mt-3">Don't have an account? <a href="/register">Register here</a></p>
    </div>
  );
}

export default Login;