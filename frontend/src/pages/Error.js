function Error() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid">
          <a className="navbar-brand" href="/home">MyChat</a>
        </div>
      </nav>
    <div className="container d-flex justify-content-center align-items-center flex-column">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
    </div>
  );
}

export default Error;