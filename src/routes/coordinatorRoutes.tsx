import AdminLayout from "@/components/layout/adminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/authentication/login/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import VerifyEmail from "@/pages/authentication/verifyEmail/verifyEmail";

// Admin Routes
function CoordinatorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="coordinator" />}>
                <Route path="" element={<Navigate to="login" />} />
                <Route path="login" element={<Login />} />
                <Route path="verifyEmail" element={<VerifyEmail />} />
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
