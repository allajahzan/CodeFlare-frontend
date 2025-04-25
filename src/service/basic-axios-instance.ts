import axios from "axios";

// Create a basic axios instance
const basicAxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default basicAxiosInstance;
