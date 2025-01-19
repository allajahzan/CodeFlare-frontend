import StudentLayout from "@/components/layout/studentLayout";
import Login from "@/pages/login/login";
import Dashboard from "@/pages/student/dashboard";
import Invoice from "@/pages/student/invoice";
import Leave from "@/pages/student/leave";
import LeetCode from "@/pages/student/leetcode";
import Manifest from "@/pages/student/manifest";
import Reviews from "@/pages/student/reviews";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "@/routes/publicRoute";
import ProtectedRoute from "@/routes/protectedRoute";

// Student Routes
function StudentRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicRoute allowedRole="student" />}>
                <Route path="" element={<Navigate to="student/login" />} />
                <Route path="student" element={<Navigate to="student/login" />} />
                <Route path="student/login" element={<Login />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<ProtectedRoute allowedRole="student" />}>
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
