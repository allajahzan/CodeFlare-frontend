import AdminLayout from "@/layout/admin-layout";
import Dashboard from "@/pages/admin/dashboard";
import Users from "@/pages/admin/users";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/public-routes";
import ProtectedRoutes from "@/routes/protected-routes";
import AuthenticationLayout from "@/layout/authentication-layout";
import ForgotPassword from "@/pages/authentication/forgot-password";
import ResetPassword from "@/pages/authentication/reset-password";
import AppRoutes from "@/constants/app-routes";
import Chat from "@/pages/chat/chat";
import Profile from "@/pages/profile/profile";
import CurriculumsPage from "@/pages/admin/curriculums";
import MeetLanding from "@/components/meet/landing";
import Meet from "@/components/meet/meet";

// Admin Routes
function AdminRoutes() {
    const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole={AppRoutes.ADMIN} />}>
                <Route element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to={AppRoutes.LOGIN} />} />
                    <Route path={AppRoutes.LOGIN} element={<Login />} />
                    <Route path={AppRoutes.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={AppRoutes.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole={AppRoutes.ADMIN} />}>
                <Route path={AppRoutes.CHATS} element={<Chat />} />
                <Route path={AppRoutes.MEET} element={<MeetLanding />} />
                <Route path={AppRoutes.MEET + '/:id'} element={<Meet />} />
                <Route element={<AdminLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={AppRoutes.ADMIN_USERS} element={<Users isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />} />
                    <Route path={AppRoutes.ADMIN_CURRICULUM + '/' + AppRoutes.ADMIN_BATCHES} element={<CurriculumsPage setDrawerOpen={setDrawerOpen} />} />
                    <Route path={AppRoutes.ADMIN_CURRICULUM + '/' + AppRoutes.ADMIN_WEEKS} element={<CurriculumsPage setDrawerOpen={setDrawerOpen} />} />
                    <Route path={AppRoutes.ADMIN_CURRICULUM + '/' + AppRoutes.ADMIN_DOMAINS} element={<CurriculumsPage setDrawerOpen={setDrawerOpen} />} />
                    <Route path={AppRoutes.PROFILE} element={<Profile />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.ADMIN}`} />} />
        </Routes>
    );
}

export default AdminRoutes;
