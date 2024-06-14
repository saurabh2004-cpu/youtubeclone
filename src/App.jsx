// App.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import './App.css';
import nprogress from 'nprogress';


 // Configure nprogress
 nprogress.configure({ showSpinner: false });

 // Start nprogress on route change start and stop on route change end
 useEffect(() => {
     const handleRouteChangeStart = () => {
         nprogress.start();
     };

     const handleRouteChangeEnd = () => {
         nprogress.done();
     };

     window.addEventListener('beforeunload', handleRouteChangeStart);
     window.addEventListener('load', handleRouteChangeEnd);

     return () => {
         window.removeEventListener('beforeunload', handleRouteChangeStart);
         window.removeEventListener('load', handleRouteChangeEnd);
     };
 }, []);


 


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
