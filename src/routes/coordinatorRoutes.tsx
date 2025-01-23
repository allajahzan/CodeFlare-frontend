import CoordinatorLayout from "@/components/layout/coordinatorLayout";
import Dashboard from "@/pages/coordinator/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import Verify from "@/pages/authentication/verify";
import Reset from "@/pages/authentication/reset";
import AuthenticationLayout from "@/components/layout/autheticationLayout";
import Students from "@/pages/coordinator/students";

// Coordinator Routes
function CoordinatorRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="coordinator" />}>
                <Route element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to="login" />} />
                    <Route path="login" element={<Login />} />
                    <Route path="verify-email" element={<Verify />} />
                    <Route path="reset-password" element={<Reset />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole="coordinator" />}>
                <Route element={<CoordinatorLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="students" element={<Students isDrawerOpen={isDrawerOpen} setDrawerOpen={_setDrawerOpen} />}/>
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="login" />} />
        </Routes>
    );
}

export default CoordinatorRoutes;
