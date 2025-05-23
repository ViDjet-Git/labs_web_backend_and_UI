import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import ChatRoom from './pages/ChatRoom';
import Profile from './pages/Profile';
import Info from './pages/Info';
import Error from './pages/Error';
import { Navigate } from 'react-router-dom';

function App() {

  const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? children : <Navigate to={'/login'} />;
  }

  const AlreadyLogged = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? <Navigate to={'/home'} /> : children;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AlreadyLogged>
            <Welcome />
          </AlreadyLogged>
        } />
        <Route path="/register" element={
          <AlreadyLogged>
            <Register />
          </AlreadyLogged>
        } />
        <Route path="/login" element={
          <AlreadyLogged>
            <Login />
          </AlreadyLogged>
        } />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/chat/:chatId" element={
          <PrivateRoute>
            <ChatRoom />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/info" element={
          <PrivateRoute>
            <Info />
          </PrivateRoute>
        } />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
