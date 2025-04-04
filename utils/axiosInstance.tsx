import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://sustylo-web.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
