// App.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  ) : null;
}

export default App;
