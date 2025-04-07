"use client";
import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');

  const users = ['admin', 'operator', 'mechanic', 'enduser', 'engineer'];

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login attempt:', { username });
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log('API response:', data);
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token set:', data.token);
        console.log('Redirecting to /home');
        // Use a single navigation method
        window.location.href = '/home';
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error during login: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl mb-4">ahora si</h1>
        <select
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 border w-full"
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 border w-full"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white w-full">Login</button>
      </form>
    </div>
  );
}
