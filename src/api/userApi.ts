import { BASE_URL } from "./baseApi";

// Authentication api
export const userApi = {
    login: BASE_URL + "/user/login",
    forgotPasswod: BASE_URL + "/user/forgot-password",
    sendOtp: BASE_URL + "/user/verify-otp?token=",
    resetPassword: BASE_URL + "/user/reset-password?token=",
    refreshToken: BASE_URL + "/user/refresh-token",
    getStudents: "/user/student",
    getCoordinatorsAndInstructors: "/user/coordinator-instructor",
    user : "/user"
};