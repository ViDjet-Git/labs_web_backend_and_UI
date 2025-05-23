import React from 'react';
import { useNavigate } from 'react-router-dom';

function Info() {

  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    console.log('User logged out');
    // Redirect to login page
    navigate('/');
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">MyChat</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="/home">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/info">Info</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-danger" onClick={handleLogout} href='/'>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <h2 className="text-center mb-4">Info</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">About MyChat</h5>
            <p className="card-text">MyChat is a simple chat application built with React, Node.js and Django.</p>
            <h5 className="card-title">Features</h5>
            <ul>
              <li>Register/Login</li>
              <li>See online users</li>
              <li>Chat with online users</li>
              <li>See your chats</li>
              <li>Delete your chats</li>
              {/*<li>Delete chats for both users</li>*/}
              <li>See your profile</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;