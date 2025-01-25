import CoordinatorLayout from "@/components/layout/coordinatorLayout";
import Dashboard from "@/pages/coordinator/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import ForgotPassword from "@/pages/authentication/forgotPassword";
import ResetPassword from "@/pages/authentication/resetPassword";
import AuthenticationLayout from "@/components/layout/autheticationLayout";
import Students from "@/pages/coordinator/students";
import AppRoutes from "@/constants/appRoutes";

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
