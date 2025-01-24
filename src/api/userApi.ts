// Authentication api
export const userApi = {
    // Authentication related api
    login: "/user/login",
    verifyEmail: "/user/verify-email",
    sendOtp: "/user/verify-otp?token=",
    resetPassword: "/user/reset-password?token=",
    refreshToken: "/user/refresh-token",
    logout : "/user/logout",

    // User CRUD related api
    getStudents: "/user/student",
    getCoordinatorsAndInstructors: "/user/coordinator-instructor",
    user : "/user"
};