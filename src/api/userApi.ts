import { BASE_URL } from "./baseApi";

// Authentication api
export const userApi = {
    // Authentication related api
    login: BASE_URL + "/user/login",
    verifyEmail: BASE_URL + "/user/verify-email",
    sendOtp: BASE_URL + "/user/verify-otp?token=",
    resetPassword: BASE_URL + "/user/reset-password?token=",
    refreshToken: BASE_URL + "/user/refresh-token",
    logout : BASE_URL + "/user/logout",

    // User CRUD related api
    getStudents: "/user/student",
    getCoordinatorsAndInstructors: "/user/coordinator-instructor",
    user : "/user"
};