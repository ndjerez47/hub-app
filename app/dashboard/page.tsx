"use client";
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');

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
      setRole(data.role);
      setUsername(data.username || 'Unknown');
    })
    .catch(err => {
      console.error('Dashboard - Verification failed:', err.message);
      localStorage.removeItem('token');
      window.location.href = '/';
    });
  }, []);

  if (!role) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl mb-4 sm:mb-6">HVAC Hub Dashboard - {role}</h1>
      <div className="w-full max-w-md sm:max-w-lg grid grid-cols-1 gap-4 mb-4 sm:mb-6">
        {role === 'admin' && (
          <>
            <div className="p-4 bg-white rounded shadow">Manage Users <button onClick={() => window.location.href = '/users'} className="ml-2 p-1 bg-blue-500 text-white">Go</button></div>
            <div className="p-4 bg-white rounded shadow">System Config</div>
            <div className="p-4 bg-white rounded shadow">All Data</div>
          </>
        )}
        {role === 'operator' && (
          <>
            <div className="p-4 bg-white rounded shadow">Adjust Temp</div>
            <div className="p-4 bg-white rounded shadow">Status</div>
          </>
        )}
        {role === 'mechanic' && (
          <>
            <div className="p-4 bg-white rounded shadow">Diagnostics</div>
            <div className="p-4 bg-white rounded shadow">Maintenance Logs</div>
          </>
        )}
        {role === 'enduser' && (
          <>
            <div className="p-4 bg-white rounded shadow">View Status</div>
            <div className="p-4 bg-white rounded shadow">Set Temp</div>
          </>
        )}
        {role === 'engineer' && (
          <>
            <div className="p-4 bg-white rounded shadow">Tune System</div>
            <div className="p-4 bg-white rounded shadow">Analytics</div>
          </>
        )}
      </div>
      <div className="w-full max-w-md sm:max-w-lg flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.href = '/home'}
          className="p-2 bg-green-500 text-white w-full sm:w-auto"
        >
          Go to Home
        </button>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
          className="p-2 bg-red-500 text-white w-full sm:w-auto"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
