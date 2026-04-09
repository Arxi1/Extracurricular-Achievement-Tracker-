const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD ? 'https://backend-production-6e97.up.railway.app/api' : 'http://localhost:8080/api');

export default API_BASE_URL;
