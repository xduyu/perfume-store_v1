import React, { useState } from 'react';
import './login.css';

function Login() {
  const api = 'http://localhost:3000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${api}/api/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setResponse(data);
      if (data.status === 'success') {
        localStorage.setItem('adminid', data.adminid);
        window.location.href = '/';
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setResponse({ status: 'error', message: 'Server error' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">For Sellers Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {response && (
          <p className={`login-message ${response.status === 'success' ? 'success' : 'error'}`}>
            {response.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
