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
    USER = "/user",
    GET_USERS = "/user/users",
    CHANGE_USER_STATUS = "/user/status",
    SEARCH_USER = '/user/search',

    // Profile APIs - user service
    PROFILE = "/user/profile",
    CHANGE_PROFILE_PIC = "/user/profile-pic",
    CHANGE_PASSWORD = "/user/change-password",

    // Admin APIs - admin service
    ADMIN = "/admin",
    BATCH = "/admin/batch",
    SEARCH_BATCH = "/admin/batch/search",

    // Chat APIs - communication service
    CHAT = "/communication/chat",
    MESSAGE = "/communication/message",

    // Review APIs - instructor service
    REVIEW = '/instructor/review'
}

export default ApiEndpoints;
