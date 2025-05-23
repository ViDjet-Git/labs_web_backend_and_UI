import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChatRoom() {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [chatUser, setChatUser] = useState('');
  const [chatExists, setChatExists] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = currentUser.token;


  if (!currentUser) {
    navigate('/login');
  }
  
  useEffect(() => {
    axios.get(`http://localhost:8000/api/chat/${chatId}/exists/`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    }).then(res => {
        setChatExists(true);
        console.log('Chat exists:', res.data);
    }).catch(() => navigate('/error'));
    

    axios.get(`http://localhost:8000/api/chat/${chatId}/partner/`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    }).then(res => {
      setChatUser(res.data.username);
    }).catch(() => {
      setChatUser("Unknown User");
    });

    axios.get(`http://localhost:8000/api/chat/${chatId}/messages`, {
      headers: {
        'Authorization': `Token ${token}`,
      }
    }).then(res => setMessages(res.data));
  }, [chatId, token, navigate]);

  useEffect(() => {
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${chatId}/?token=${token}`);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, {
        content: data.message,
        sender_username: data.sender,
        timestamp: new Date().toISOString()
      }]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      socketRef.current.close();
    };
  }, [chatId, token]);

  if (chatExists === null) return <p>Loading...</p>;

  const sendMessage = (e) => {
    if(newMessage.trim() !== '') {
      socketRef.current.send(JSON.stringify({
        message: newMessage,
      }));
      setNewMessage('');
    }
  };

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
                <a className="nav-link" href="/info">Info</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-danger" href="/" onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <h2 className="text-center mb-4">Live Chat#{chatId} with {chatUser}</h2>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="chat-window" style={{ height: '400px', overflowY: 'scroll' }}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.sender_username === currentUser.username ? 'sent' : 'received'}`}>
                  <span className="fw-bold">{msg.sender_username}: </span>{msg.content}
                </div>
              ))}
            </div>
            <div className="d-flex mt-3">
              <input 
                type="text" 
                className="form-control me-2" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()} 
              />
              <button 
                className="btn btn-primary mt-2"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
      </div>
    </div>
    </div>
  );
}

export default ChatRoom;