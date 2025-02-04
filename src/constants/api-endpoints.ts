enum ApiEndpoints {
    // Authentication APIs
    LOGIN = "/user/login",
    VERIFY_EMAIL = "/user/verify-email",
    SEND_OTP = "/user/verify-otp?token=",
    CHECK_RESET_PASSWORD_LINK = "/user/check-reset-password-link?token=",
    RESET_PASSWORD = "/user/reset-password?token=",
    REFRESH_TOKEN = "/user/refresh-token",
    LOGOUT = "/user/logout",

    // User CRUD APIs
    GET_USERS = "/user/users",
    USER = "/user",

    // Admin APIs
    ADMIN = "/admin",
}

export default ApiEndpoints;
