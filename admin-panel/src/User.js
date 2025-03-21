import React, { useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState(["John Doe", "Jane Smith"]);
  const [newUser, setNewUser] = useState("");

  const addUser = () => {
    if (newUser.trim() !== "") {
      setUsers([...users, newUser]);
      setNewUser("");
    }
  };

  const deleteUser = (index) => {
    setUsers(users.filter((_, idx) => idx !== index));
  };

  return (
    <div>
      <h1>Users Management</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter user name"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addUser}>Add User</button>
      </div>
      <ul className="list-group">
        {users.map((user, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            {user}
            <button className="btn btn-danger btn-sm" onClick={() => deleteUser(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
