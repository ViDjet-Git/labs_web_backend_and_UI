import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  //const TempChats = ["Chat 1", "Chat 2", "Chat 3"]; // Test data
  const [chats, setChats] = useState([]); // Use TempUsers for demo
  //const [user, setUser] = useState({ username, email });

  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    console.log('User logged out');
    // Redirect to login/register page
    navigate('/');
  }

  const RegisteredUser = JSON.parse(localStorage.getItem('user'));
  const token = RegisteredUser.token;
  if (!RegisteredUser) {
    navigate('/login');
  }

  useEffect(() => {
    fetch('http://localhost:8000/api/user-chats/', {
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Unauthorized');
      return res.json();
      
    })
    .then(data => {
      setChats(data);
    })
    .catch(err => {
      console.error(err);
      navigate('/');
    });
  }, [token, navigate]);

  const handleDelete = (chatId) => {
    if(!window.confirm("Are you sure you want to delete this chat?")) return;

    fetch(`http://localhost:8000/api/chat/${chatId}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      }
    })
    .then(res => {
      if(res.status === 204) {
        setChats(prevChats => prevChats.filter(chat => chat.chat_id !== chatId));
      } else {
        return res.json().then(data => {
          throw new Error(data.error || 'Failed to delete chat');
        });
      }
    })
    .catch(err => {
      console.error(err);
      alert('Failed to delete chat: ' + err.message);
    });
  };

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
                <a className="nav-link active" aria-current="page" href="/profile">Profile</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/info">Info</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-danger" onClick={handleLogout} href='/'>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <h2 className="text-center mb-4">Profile</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title">User Information</h5>
            <p className="card-text">Username: {RegisteredUser.username}</p>
            <p className="card-text">Email: {RegisteredUser.email}</p>
            <div className="chats card-text">
              <h5 className="mb-4">Your chats:</h5>
              {chats && chats.length > 0 && chats !== "" ? (
                <ul className="list-group shadow rounded" style={{ maxWidth: "500px", margin: "0 auto" }}>
                  {chats.map(chat => (
                  <li key={chat.chat_id} className="list-group-item d-flex align-items-center justify-content-between border-0">
                    <span className="fw-bold">Chat with: {chat.participants}</span>
                    <div>
                    <button className="btn btn-success btn-sm me-1" onClick={() => navigate(`/chat/${chat.chat_id}`)}>Go Chat</button>
                    <button className="btn btn-danger btn-sm me-1"
                    onClick={() => handleDelete(chat.chat_id)}>
                      Delete
                    </button>
                    </div>
                  </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-warning text-center" role="alert">
                  You have no chats :(
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;