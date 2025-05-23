import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  //const TempUsers = ["User 1", "User 2", "User 3", "User 4"]; // Test data
  const [usersOnline, setUsersOnline] = useState([]); // Use TempUsers for demo
  const [currentUserId, setCurrentUserId] = useState(null);


  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear user data from local storage
    localStorage.removeItem('user');
    console.log('User logged out');
    // Redirect to login page
    navigate('/');
  }

  const RegisteredUser = JSON.parse(localStorage.getItem('user'));
  if (!RegisteredUser) {
    navigate('/login');
  }
  const token = RegisteredUser.token;
  console.log('Token:', token);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8000/ws/online-users/?token=${token}`);

    socket.onopen = () => {
      console.log('WebSocket connected');
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received data:', data);
      if (data.type === 'online_users') {
        setUsersOnline(data.users);
      }

      if (data.type === 'current_user') {
        setCurrentUserId(data.current_user_id);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket closed');
    }

    return () => {
      socket.close();
    };
  }, [token]);


  const createChat = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/create-chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Chat ID:', data.chat_id);
        // Redirect to the chat room
        navigate(`/chat/${data.chat_id}`);
      } else {
        console.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
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
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
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
      <div className="container users-online">
        <h2 className="text-center mb-4">Users Online</h2>
        {usersOnline && usersOnline.length > 0 && usersOnline !== "" ? (
          <ul className="list-group shadow rounded" style={{ maxWidth: "500px", margin: "0 auto" }}>
            {usersOnline.map((user) => (
              <li key={user.id} className="list-group-item d-flex align-items-center justify-content-between border-0">
                <span className="fw-bold">
                  {user.username} {user.id === currentUserId && <span className="text-muted">(You)</span>}
                </span>
                {user.id !== currentUserId && (
                  <button className="btn btn-success btn-sm" onClick={() => createChat(user.id)}>Chat</button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-warning text-center" role="alert">
            No users online :(
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;