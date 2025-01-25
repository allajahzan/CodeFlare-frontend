import InstructorLayout from "@/components/layout/instructorLayout";
import Dashboard from "@/pages/instructor/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import Reset from "@/pages/authentication/resetPassword";
import AuthenticationLayout from "@/components/layout/autheticationLayout";
import AppRoutes from "@/constants/appRoutes";

// Instructor Routes
function InstructorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole={AppRoutes.INSTRUCTOR} />}>
                <Route element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to={AppRoutes.LOGIN} />} />
                    <Route path={AppRoutes.LOGIN} element={<Login />} />
                    <Route path={AppRoutes.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={AppRoutes.RESET_PASSWORD} element={<Reset />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole={AppRoutes.INSTRUCTOR} />}>
                <Route element={<InstructorLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.INSTRUCTOR}`} />} />
        </Routes>
    );
}

export default InstructorRoutes;
