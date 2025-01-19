import AdminLayout from "@/components/layout/adminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Users from "@/pages/admin/users";
import Login from "@/pages/login/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";

// Admin Routes
function AdminRoutes() {
    const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="admin" />}>
                <Route path="" element={<Navigate to="login" />} />
                <Route path="login" element={<Login />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole="admin" />}>
                <Route element={<AdminLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="login" />} />
        </Routes>
    );
}

export default AdminRoutes;
