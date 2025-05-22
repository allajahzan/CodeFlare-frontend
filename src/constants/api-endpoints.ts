enum ApiEndpoints {
    // Authentication urls - user service
    LOGIN = "/user/login",
    VERIFY_EMAIL = "/user/verify-email",
    SEND_OTP = "/user/verify-otp?token=",
    CHECK_RESET_PASSWORD_LINK = "/user/check-reset-password-link?token=",
    RESET_PASSWORD = "/user/reset-password?token=",
    REFRESH_TOKEN = "/user/refresh-token",
    LOGOUT = "/user/logout",

    // User CRUD urls - user service
    USER = "/user",
    GET_USERS = "/user/users",
    CHANGE_USER_STATUS = "/user/status",
    SEARCH_USER = "/user/search",
    USER_COUNT = "/user/count",
    SELECT_DOMAIN = "/user/select-domain",

    DELETE_IMAGE = "user/delete-image",

    // Profile urls - user service
    PROFILE = "/user/profile",
    CHANGE_PROFILE_PIC = "/user/profile-pic",
    CHANGE_PASSWORD = "/user/change-password",

    // Admin urls - admin service
    ADMIN = "/admin",
    BATCH = "/admin/batch",
    SEARCH_BATCH = "/admin/batch/search",
    WEEK = "/admin/week",
    SEARCH_WEEK = "/admin/week/search",
    DOMAIN = "/admin/domain",
    SEARCH_DOMAIN = "/admin/domain/search",

    // Chat urls - communication service
    CHAT = "/communication/chat",
    MESSAGE = "/communication/message",
    MEET = "/communication/meet",
    NOTIFICATION = "/communication/notification",

    // Review urls - instructor service
    REVIEW = "/instructor/review",
    REVIEW_STATUS = "/instructor/review/status",
    REVIEW_SCORE = "/instructor/review/score",

    // Attendence urls - student service
    ATTENDENCE = "/student/attendence",
    ATTENDENCE_SEARCH = `${ATTENDENCE}/search`,
    ATTENDENCE_STATUS = `${ATTENDENCE}/status`,
    CHECK_IN_OUT = `${ATTENDENCE}/check-in-out`,
    SNAP_SHOT = `${ATTENDENCE}/snapshot`,
    MONTHLY_ATTENDENCE = `${ATTENDENCE}/monthly-attendence`,

    // Warning urls - student service
    WARNING = "/student/warning",
}

export default ApiEndpoints;
