import StudentLayout from "@/components/layout/studentLayout";
import Login from "@/pages/authentication/login";
import Dashboard from "@/pages/student/dashboard";
import Invoice from "@/pages/student/invoice";
import Leave from "@/pages/student/leave";
import Manifest from "@/pages/student/manifest";
import Reviews from "@/pages/student/reviews";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import AuthenticationLayout from "@/components/layout/autheticationLayout";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import ResetPassword from "@/pages/authentication/resetPassword";
import AppRoutes from "@/constants/appRoutes";

// Student Routes
function StudentRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole={AppRoutes.STUDENT} />}>
                <Route path={AppRoutes.STUDENT} element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to={AppRoutes.LOGIN} />} />
                    <Route path={AppRoutes.LOGIN} element={<Login />} />
                    <Route path={AppRoutes.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={AppRoutes.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole={AppRoutes.STUDENT} />}>
                <Route path={AppRoutes.STUDENT} element={<StudentLayout />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={AppRoutes.STUDENT_REVIEWS} element={<Reviews />} />
                    <Route path={AppRoutes.STUDENT_INVOICES} element={<Invoice />} />
                    <Route path={AppRoutes.PROFILE} element={<Manifest />} />
                    <Route path={AppRoutes.STUDENT_LEAVES} element={<Leave />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.STUDENT}`} />} />
        </Routes>
    );
}

export default StudentRoutes;
