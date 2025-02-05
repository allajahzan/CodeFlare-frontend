enum ApiEndpoints {
    // Authentication APIs - user service
    LOGIN = "/user/login",
    VERIFY_EMAIL = "/user/verify-email",
    SEND_OTP = "/user/verify-otp?token=",
    CHECK_RESET_PASSWORD_LINK = "/user/check-reset-password-link?token=",
    RESET_PASSWORD = "/user/reset-password?token=",
    REFRESH_TOKEN = "/user/refresh-token",
    LOGOUT = "/user/logout",

    // User CRUD APIs - user service
    GET_USERS = "/user/users",
    USER = "/user",

    // Admin APIs - admin service
    ADMIN = "/admin",

    // Chat APIs - communication service
    CHAT = "/communication/chat",
}

export default ApiEndpoints;
