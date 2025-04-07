"use client";
import { useEffect, useState } from 'react';

export default function Home() {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState('');
  const [temp, setTemp] = useState(null);
  const [humidity, setHumidity] = useState(45); // Mock for now
  const [occupied, setOccupied] = useState(false);

useEffect(() => {
  console.log('Home - Starting useEffect');
  const token = localStorage.getItem('token');
  console.log('Home - Token:', token);
  if (!token) {
    console.log('Home - No token, redirecting to /');
    window.location.href = '/';
    return;
  }

  // Verify token using the API instead of client-side verification
  console.log('Home - Verifying token via API');
  fetch('/api/verify', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => {
    console.log('Home - Verify response status:', res.status);
    if (!res.ok) {
      throw new Error('Token verification failed');
    }
    return res.json();
  })
  .then(data => {
    console.log('Home - User verified:', data);
    setRole(data.role);
    setUsername(data.username || 'Unknown');
  })
  .catch(err => {
    console.error('Home - Verification failed:', err.message);
    localStorage.removeItem('token');
    window.location.href = '/';
  });

  console.log('Home - Fetching settings');
  fetch('/api/settings')
    .then(res => {
      console.log('Home - Settings response status:', res.status);
      return res.json();
    })
    .then(data => {
      console.log('Home - Settings data:', data);
      setTemp(data.temp);
      setOccupied(data.occupied);
    })
    .catch(err => console.error('Home - Settings fetch failed:', err.message));
}, []);
  const saveSettings = async () => {
    const token = localStorage.getItem('token');
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, temp, occupied }),
    });
  };

  const canEditAll = ['admin', 'operator'].includes(role);
  const canEditTemp = canEditAll || role === 'engineer';

  if (!role) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl mb-4 sm:mb-6">HVAC Home</h1>
      <div className="w-full max-w-md sm:max-w-lg mb-4 sm:mb-6 p-4 bg-white rounded shadow">
        <p>ENTRATE in as: <strong>{username}</strong> ({role})</p>
        <p>Status: <span className="text-green-500">Online</span></p>
      </div>
      <div className="w-full max-w-md sm:max-w-lg grid grid-cols-1 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg sm:text-xl">Temperature: {temp !== null ? `${temp}°F` : 'Loading...'}</h2>
          {canEditTemp ? (
            <input
              type="number"
              value={temp || ''}
              onChange={(e) => setTemp(Number(e.target.value))}
              onBlur={saveSettings}
              className="mt-2 p-2 border w-full"
            />
          ) : (
            <p className="mt-2 text-gray-500">Read-only</p>
          )}
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg sm:text-xl">Humidity: {humidity}%</h2>
          <p className="mt-2 text-gray-500">Read-only</p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg sm:text-xl">Occupied Mode: {occupied ? 'On' : 'Off'}</h2>
          {canEditAll ? (
            <button
              onClick={() => { setOccupied(!occupied); saveSettings(); }}
              className={`mt-2 p-2 w-full ${occupied ? 'bg-red-500' : 'bg-green-500'} text-white`}
            >
              Toggle {occupied ? 'Off' : 'On'}
            </button>
          ) : (
            <p className="mt-2 text-gray-500">Read-only</p>
          )}
        </div>
      </div>
      <div className="w-full max-w-md sm:max-w-lg flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="p-2 bg-blue-500 text-white w-full sm:w-auto"
        >
          Back to Dashboard
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
