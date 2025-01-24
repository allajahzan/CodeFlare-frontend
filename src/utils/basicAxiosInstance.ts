import axios from "axios";
import { BASE_URL } from "./baseUrl";

// Url proxy
const basicAxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default basicAxiosInstance;
