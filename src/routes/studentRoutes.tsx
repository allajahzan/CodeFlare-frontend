import StudentLayout from "@/components/layout/studentLayout";
import Login from "@/pages/authentication/login";
import Dashboard from "@/pages/student/dashboard";
import Invoice from "@/pages/student/invoice";
import Leave from "@/pages/student/leave";
import LeetCode from "@/pages/student/leetcode";
import Manifest from "@/pages/student/manifest";
import Reviews from "@/pages/student/reviews";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoutes from "@/routes/publicRoutes";
import ProtectedRoutes from "@/routes/protectedRoutes";
import AuthenticationLayout from "@/components/layout/autheticationLayout";
import Verify from "@/pages/authentication/verify";
import Reset from "@/pages/authentication/reset";

// Student Routes
function StudentRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoutes allowedRole="student" />}>
                <Route path="student" element={<AuthenticationLayout />}>
                    <Route path="" element={<Navigate to="student/login" />} />
                    <Route path="login" element={<Login />} />
                    <Route path="verify-email" element={<Verify />} />
                    <Route path="reset-password" element={<Reset />} />
                </Route>
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoutes allowedRole="student" />}>
                <Route path="student" element={<StudentLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="reviews" element={<Reviews />} />
                    <Route path="leetcode" element={<LeetCode />} />
                    <Route path="invoices" element={<Invoice />} />
                    <Route path="manifest" element={<Manifest />} />
                    <Route path="leaves" element={<Leave />} />
                </Route>
            </Route>

            {/* Fallback for unmatched routes */}
            <Route path="*" element={<Navigate to="student/login" />} />
        </Routes>
    );
}

export default StudentRoutes;
