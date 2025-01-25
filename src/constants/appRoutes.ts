// App Routes
enum AppRoutes {
    // Authenticaion Routes
    LOGIN = 'login',
    RESET_PASSWORD = 'reset-password',
    FORGOT_PASSWORD = 'forgot-password',

    // Common Routes
    DASHBOARD = 'dashboard',
    CHATS = 'chats',
    PROFILE = 'profile',

    // Admin Routes
    ADMIN = "admin",
    ADMIN_USERS = "users",

    // Coordinator Routes
    COORDINATOR = "coordinator",
    COORDINATOR_STUDENTS = "students",

    // Instructor Routes
    INSTRUCTOR = "instructor",
    INSTRUCTOR_STUDENTS = "students",

    // Student Routes
    STUDENT = "student",
    STUDENT_REVIEWS = "reviews",
    STUDENT_TASKS = "tasks",
    STUDENT_INVOICES = "invoices",
    STUDENT_LEAVES = "leaves",
}

export default AppRoutes;
