import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Settings from './components/Settings';
import Login from './components/Login';

const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Jeśli jest token, to użytkownik jest zalogowany
};

function App() {
  return (
    <Router>
      <div className="d-flex" style={{ height: '100vh' }}>
        {isAuthenticated() ? (
          <>
            {/* Sidebar */}
            <nav className="bg-dark p-4 vh-100 position-fixed" style={{ width: '250px' }}>
              <h4 className="text-white">Admin Panel</h4>
              <ul className="nav flex-column">
                <li className="nav-item"><Link className="nav-link text-white" to="/">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/users">Users</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/settings">Settings</Link></li>
                <li className="nav-item"><button className="btn btn-danger w-100 mt-2" onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}>Logout</button></li>
              </ul>
            </nav>

            {/* Main Content */}
            <div className="container p-4" style={{ marginLeft: '250px', width: 'calc(100% - 250px)' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </>
        ) : (
          // Przekierowanie do logowania jeśli nie ma tokenu
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
