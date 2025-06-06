import ApiEndpoints from "@/constants/api-endpoints";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import basicAxiosInstance from "./basic-axios-instance";

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const refreshToken = async () => {
    try {
        const resp = await basicAxiosInstance.get(
            ApiEndpoints.REFRESH_TOKEN,
            { withCredentials: true }
        );
        const data = resp?.data.data;

        localStorage.setItem("accessToken", data.accessToken); // set accessToken to localstorage

        return data.accessToken;
    } catch (err: any) {
        throw err;
    }
};

// Requsest Interceptors
axiosInstance.interceptors.request.use(
    (config): any => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // set accessToken to authorization header
        }

        return config;
    },
    (err) => {
        return Promise.reject(err);
    }
);

// Response Interceptors
axiosInstance.interceptors.response.use(
    (resp) => {
        return resp;
    },
    async (err) => {
        const originalRequest = err.config;

        if (
            err.response &&
            err.response.status === 403 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshToken();

                originalRequest.headers.Authorization = `Bearer ${accessToken}`; // reset new accessToken to authorization header

                return axiosInstance(originalRequest);
            } catch (err: any) {
                console.log(err);
                
                toast({ title: "Token expired. Please login again!" });
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                localStorage.removeItem("isAuth")
                return;
            }
        }

        return Promise.reject(err); // For other errors, reject the promise
    }
);

export default axiosInstance;
