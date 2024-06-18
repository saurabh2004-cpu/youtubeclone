import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useBlockBackNavigation() {
    const navigate = useNavigate();

    useEffect(() => {
        const handlePopState = (event) => {
            // Check if the current location is the home page
            if (window.location.pathname === '/') {
                navigate('/');
                window.history.pushState(null, '', window.location.href); // Push current state to maintain the position
            }
        };

        window.addEventListener('popstate', handlePopState);

        // Push current state when the component mounts to start the history stack from here
        window.history.pushState(null, '', window.location.href);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);
}

export default useBlockBackNavigation;
