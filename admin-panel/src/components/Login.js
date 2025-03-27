import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(response => {
      if (!response.ok) throw new Error('Invalid credentials');
      return response.json();
    })
    .then(data => {
      console.log("JWT Token:", data.token);  // Debugging JWT
      localStorage.setItem('token', data.token); // saving JWT to localStorage
      window.location.href = '/users';  // redirect to Users page after login
    })
    .catch(error => setError(error.message));
  };

  return (
    <div className="container p-4">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <input
        type="email"
        className="form-control mb-3"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="btn btn-primary" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
