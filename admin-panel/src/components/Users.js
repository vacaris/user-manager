import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:5000';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editingUser, setEditingUser] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(5);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('user');

  const fetchUsers = () => {
    const token = localStorage.getItem('token');
    fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Nie udało się pobrać użytkowników');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = parseInt(payload.sub);
        setCurrentUserId(userId);

        if (data.length === 1 && data[0].id === userId) {
          setCurrentUserRole(data[0].role);
        } else {
          const found = data.find(u => u.id === userId);
          setCurrentUserRole(found?.role || 'user');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Błąd podczas pobierania użytkowników');
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Brak tokenu – zaloguj się ponownie');
    if (!username || !email || !password) return alert('Uzupełnij wszystkie pola!');

    fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ username, email, password, role })
    })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) {
          console.error('Rejestracja nie powiodła się:', res.status, text);
          throw new Error(text || 'Błąd podczas rejestracji');
        }
        return JSON.parse(text);
      })
      .then(() => {
        setUsername('');
        setEmail('');
        setPassword('');
        setRole('user');
        fetchUsers();
      })
      .catch(err => {
        console.error(err);
        alert('Błąd przy dodawaniu użytkownika');
      });
  };

  const deleteUser = (id) => {
    fetch(`${BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(err => {
        console.error(err);
        alert('Błąd przy usuwaniu użytkownika');
      });
  };

  const updateUser = (id) => {
    fetch(`${BASE_URL}/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole
      })
    })
      .then(res => res.json())
      .then(() => {
        setEditingUser(null);
        setNewUsername('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('user');
        fetchUsers();
      })
      .catch(err => {
        console.error(err);
        alert('Błąd przy aktualizacji użytkownika');
      });
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(user =>
        user.username.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="container p-4" style={{ marginLeft: '220px', width: 'calc(100% - 220px)' }}>
      <h2>User Management</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {currentUserRole === 'admin' && (
        <div className="mb-4">
          <h5>Add New User</h5>
          <input type="text" className="form-control mb-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <select className="form-control mb-2" value={role} onChange={e => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-primary w-100" onClick={addUser}>Add User</button>
        </div>
      )}

      <ul className="list-group">
        {currentUsers.map(user => (
          <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.username} ({user.email}) - <strong>{user.role}</strong></span>
            {(currentUserRole === 'admin' || user.id === currentUserId) && (
              <div>
                <button className="btn btn-warning btn-sm mx-1" onClick={() => {
                  setEditingUser(user.id);
                  setNewUsername(user.username);
                  setNewEmail(user.email);
                  setNewRole(user.role);
                }}>Edit</button>
                {currentUserRole === 'admin' && (
                  <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user.id)}>Delete</button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 d-flex justify-content-center">
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`btn btn-sm mx-1 ${page === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {editingUser && (
        <div className="mt-4">
          <h5>Edit User</h5>
          <input type="text" className="form-control mb-2" placeholder="New Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
          <input type="email" className="form-control mb-2" placeholder="New Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <input type="password" className="form-control mb-2" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <select className="form-control mb-2" value={newRole} onChange={e => setNewRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button className="btn btn-success w-100" onClick={() => updateUser(editingUser)}>Update User</button>
        </div>
      )}
    </div>
  );
};

export default Users;
