import AdminLayout from "@/components/layout/adminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import VerifyEmail from "@/pages/authentication/verify";
import VerifyOtp from "@/pages/authentication/otp";

// Admin Routes
function CoordinatorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="coordinator" />}>
                <Route path="" element={<Navigate to="login" />} />
                <Route path="login" element={<Login />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="verify-otp" element={<VerifyOtp />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole="coordinator" />}>
                <Route element={<AdminLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="login" />} />
        </Routes>
    );
}

export default CoordinatorRoutes;
