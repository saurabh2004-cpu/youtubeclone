import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // On component load, check if the user is authenticated
    const checkAuth = async () => {
      try {
        // You can call an API route that checks if the user is authenticated
        const response = await axios.get('http://localhost:8000/api/v1/users/get-current-user', { withCredentials: true });
        
        console.log(response)
        if (response.data && response.status ) {
          // Navigate to the home/dashboard page if authenticated
          navigate('/home');
        } else {
          // Redirect to login if not authenticated
          navigate('/login');
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        navigate('/login');  // Redirect to login if there's an error
      }
    };

    checkAuth();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Dashboard;
