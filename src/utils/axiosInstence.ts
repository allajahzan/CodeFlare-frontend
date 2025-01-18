import axios from "axios";

// Base url
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

const refreshToken = async () => {
    try {
        const resp = await axiosInstance.post(`/auth/user/refresh-token`);
        const { accessToken } = resp.data;

        localStorage.setItem("accessToken", accessToken); // set accessToken to localstorage

        return accessToken;
    } catch (err: any) {
        console.log(err);
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
                console.log(err.message);
                console.log("Logging Out...");
                localStorage.removeItem("accessToken");
                return Promise.reject(err);
            }
        }

        return Promise.reject(err); // For other errors, reject the promise
    }
);

export default axiosInstance;
