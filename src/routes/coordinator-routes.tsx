import CoordinatorLayout from "@/components/layout/coordinator-layout";
import Dashboard from "@/pages/coordinator/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/public-routes";
import ProtectedRoutes from "@/routes/protected-routes";
import ForgotPassword from "@/pages/authentication/forgot-password";
import ResetPassword from "@/pages/authentication/reset-password";
import AuthenticationLayout from "@/components/layout/authentication-layout";
import Students from "@/pages/coordinator/students";
import AppRoutes from "@/constants/app-routes";
import Chat from "@/pages/chat/chat";

// Coordinator Routes
function CoordinatorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole={AppRoutes.COORDINATOR} />}>
                <Route element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to={AppRoutes.LOGIN} />} />
                    <Route path={AppRoutes.LOGIN} element={<Login />} />
                    <Route path={AppRoutes.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={AppRoutes.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole={AppRoutes.COORDINATOR} />}>
            <Route path={AppRoutes.CHATS} element={<Chat />} />
                <Route element={<CoordinatorLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={AppRoutes.COORDINATOR_STUDENTS} element={<Students isDrawerOpen={isDrawerOpen} setDrawerOpen={_setDrawerOpen} />}/>
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.COORDINATOR}`} />} />
        </Routes>
    );
}

export default CoordinatorRoutes;
