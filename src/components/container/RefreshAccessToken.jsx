// Function to refresh access token
import axios from "axios";


async function refreshAccessToken(refreshToken) {
    try {
        const response = await axios.post('/api/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        // Update the access token in your frontend state
        // This could involve storing it securely in local storage or memory
        localStorage.setItem('accessToken', accessToken);
        return accessToken;
    } catch (error) {
        // Handle error (e.g., display error message or redirect to login page)
        console.error('Error refreshing access token:', error.message);
        throw error;
    }
}

// Example usage in your application
async function makeSecureRequest() {
    const accessToken = localStorage.getItem('accessToken');
    try {
        // Make a request to a protected endpoint using the access token
        const response = await axios.get('/api/user/refresh-access-token', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
       
        console.log('Response:', response.data);
    } catch (error) {
        if (error.response.status === 401 && error.response.data.message === 'Token expired') {
            // Access token expired, attempt to refresh it
            const newAccessToken = await refreshAccessToken(localStorage.getItem('refreshToken'));
            // Retry the failed request with the new access token
            return makeSecureRequest();
        } else {
            // Handle other errors
            console.error('Error:', error.message);
        }
    }
}
