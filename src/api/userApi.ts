import { BASE_URL } from "./baseApi";

// Authentication api
export const userApi = {
    login: BASE_URL + "/user/login",
    verifyEmail: BASE_URL + "/user/verify-email?token=",
    sendOtp: BASE_URL + "/user/verify-otp?token=",
    refreshToken: BASE_URL + "/user/refresh-token",
    getStudents: "/user/student",
    getCoordinatorsAndInstructors: "/user/coordinator-instructor",
    user : "/user"
};