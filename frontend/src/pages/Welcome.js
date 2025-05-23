function Welcome() {
  return (
    <div className="welcome-container d-flex justify-content-center align-items-center flex-column">
      <h1>Welcome to MyChat Application</h1>
      <p>Please register or log in to continue.</p>
      <div className="welcome-buttons">
        <a href="/register" className="btn btn-success me-4 mb-2">Register</a>
        <a href="/login" className="btn btn-outline-success mb-2">Login</a>
      </div>
    </div>
  );
}

export default Welcome;