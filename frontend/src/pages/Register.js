import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
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
      const response = await axios.post('http://localhost:8000/api/register/', formData);
      if (response.data.state === 'success') {
        alert(response.data.message);
        navigate('/login');
      } else {
        alert('Registration failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred.' + error.request.response);
    }
  }

  return (
    <div className="register-container d-flex justify-content-center align-items-center flex-column">
      <h1 className="mb-3">Register</h1>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" name="username" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" name="email" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" name="password" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="password2" className="form-label">Repeat Password</label>
          <input type="password" className="form-control" name="password2" onChange={handleChange} required />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-success">Register</button>
        </div>
      </form>
      <p className="mt-3">Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}

export default Register;