import InstructorLayout from "@/components/layout/instructorLayout";
import Dashboard from "@/pages/instructor/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import Verify from "@/pages/authentication/forgotPassword";
import Reset from "@/pages/authentication/resetPassword";
import AuthenticationLayout from "@/components/layout/autheticationLayout";

// Instructor Routes
function InstructorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="instructor" />}>
                <Route element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to="login" />} />
                    <Route path="login" element={<Login />} />
                    <Route path="forgot-password" element={<Verify />} />
                    <Route path="reset-password" element={<Reset />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole="instructor" />}>
                <Route element={<InstructorLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="login" />} />
        </Routes>
    );
}

export default InstructorRoutes;
