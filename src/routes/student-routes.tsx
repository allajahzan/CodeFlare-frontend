import StudentLayout from "@/layout/student-layout";
import Login from "@/pages/authentication/login";
import Dashboard from "@/pages/student/dashboard";
import Chat from '@/components/chat/chat';
import Leave from "@/pages/student/attendence";
import Reviews from "@/pages/student/reviews";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/public-routes";
import ProtectedRoutes from "@/routes/protected-routes";
import AuthenticationLayout from "@/layout/authentication-layout";
import ForgotPassword from "@/pages/authentication/forgot-password";
import ResetPassword from "@/pages/authentication/reset-password";
import AppRoutes from "@/constants/app-routes";
import { useState } from "react";
import Profile from "@/pages/profile/profile";
import Attendence from "@/pages/student/attendence";
import MeetLanding from "@/components/meet/landing";
import Meet from "@/components/meet/meet";
import { SnapshotContextProvider } from "@/context/snapshot-context";
import DomainContextProvider from "@/context/domain-context";

// Student Routes
function StudentRoutes() {
    const [isDrawerOpen, _setDrawerOpen] = useState<boolean>(false);
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole={AppRoutes.STUDENT} />}>
                <Route path={AppRoutes.STUDENT} element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to={AppRoutes.LOGIN} />} />
                    <Route path={AppRoutes.LOGIN} element={<Login />} />
                    <Route path={AppRoutes.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={AppRoutes.RESET_PASSWORD} element={<ResetPassword />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<SnapshotContextProvider><DomainContextProvider><ProtectedRoutes allowedRole={AppRoutes.STUDENT} /></DomainContextProvider></SnapshotContextProvider>}>
                <Route path={`${AppRoutes.STUDENT}/${AppRoutes.CHATS}`} element={<Chat />} />
                <Route path={`${AppRoutes.STUDENT}/${AppRoutes.MEET}`} element={<MeetLanding />} />
                <Route path={`${AppRoutes.STUDENT}/${AppRoutes.MEET}` + '/:id'} element={<Meet />} />
                <Route path={AppRoutes.STUDENT} element={<StudentLayout isDrawerOpen={isDrawerOpen} />}>
                    <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
                    <Route path={AppRoutes.STUDENT_REVIEWS} element={<Reviews />} />
                    <Route path={AppRoutes.ATTENDENCE} element={<Attendence />} />
                    <Route path={AppRoutes.STUDENT_LEAVES} element={<Leave />} />
                    <Route path={AppRoutes.PROFILE} element={<Profile />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to={`/${AppRoutes.STUDENT}`} />} />
        </Routes>
    );
}

export default StudentRoutes;
