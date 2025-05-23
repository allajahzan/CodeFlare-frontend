import InstructorLayout from "@/layout/instructor-layout";
import Dashboard from "@/pages/instructor/dashboard";
import Login from "@/pages/authentication/login";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/public-routes";
import ProtectedRoutes from "@/routes/protected-routes";
import ForgotPassword from "@/pages/authentication/forgot-password";
import Reset from "@/pages/authentication/reset-password";
import AuthenticationLayout from "@/layout/authentication-layout";
import AppRoutes from "@/constants/app-routes";
import Chat from "@/pages/chat/chat";
import Profile from "@/pages/profile/profile";
import Reviews from "@/pages/instructor/reviews";
import MeetLanding from "@/pages/meet/landing";
import Meet from "@/pages/meet/meet";
import DomainContextProvider from "@/context/domain-context";

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
            <Route element={<DomainContextProvider><ProtectedRoutes allowedRole={AppRoutes.INSTRUCTOR} /></DomainContextProvider>}>
            <Route path={AppRoutes.CHATS} element={<Chat />} />
            <Route path={AppRoutes.MEET} element={<MeetLanding />} />
            <Route path={AppRoutes.MEET+ '/:id'} element={<Meet />} />
                <Route element={<InstructorLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={AppRoutes.STUDENT_REVIEWS} element={<Reviews />} />
                    <Route path={AppRoutes.PROFILE} element={<Profile />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.INSTRUCTOR}`} />} />
        </Routes>
    );
}

export default InstructorRoutes;
