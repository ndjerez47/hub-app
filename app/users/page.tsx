"use client";
import { useEffect, useState } from 'react';

export default function Users() {
  const [role, setRole] = useState(null);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'enduser' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/';
      return;
    }

    // Verify token using the API
    fetch('/api/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Token verification failed');
      }
      return res.json();
    })
    .then(data => {
      if (data.role !== 'admin') {
        window.location.href = '/home';
        return;
      }
      setRole(data.role);

      // Fetch users after successful authentication
      return fetch('/api/users');
    })
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => {
      console.error('Users - Verification failed:', err.message);
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }, []);

  const addUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, ...newUser }),
    });
    if (res.ok) {
      const updatedUsers = await res.json();
      setUsers(updatedUsers);
      setNewUser({ username: '', password: '', role: 'enduser' });
    }
  };

  if (!role) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl mb-4 sm:mb-6">User Management</h1>
      <div className="w-full max-w-md sm:max-w-lg mb-4 sm:mb-6">
        <form onSubmit={addUser} className="p-4 bg-white rounded shadow">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="mb-2 p-2 border w-full"
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="mb-2 p-2 border w-full"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="mb-2 p-2 border w-full"
          >
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="mechanic">Mechanic</option>
            <option value="enduser">End User</option>
            <option value="engineer">Engineer</option>
          </select>
          <button type="submit" className="p-2 bg-green-500 text-white w-full">Add User</button>
        </form>
      </div>
      <div className="w-full max-w-md sm:max-w-lg">
        <h2 className="text-lg sm:text-xl mb-2">Current Users</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="p-2 bg-white rounded shadow">
              {user.username} ({user.role})
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => window.location.href = '/home'}
        className="mt-4 sm:mt-6 p-2 bg-blue-500 text-white w-full sm:w-auto max-w-md sm:max-w-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
