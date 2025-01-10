import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardStudent from "./pages/student/dashboard";
import DashboardCoordinator from "./pages/coordinator/Dashboard/Dashboard";
import DashboardAdmin from "./pages/admin/dashboard";
import Reviews from "./pages/student/reviews";
import LeetCode from "./pages/student/leetcode";
import Invoice from "./pages/student/invoice";
import Manifest from "./pages/student/manifest";
import Leave from "./pages/student/leave";
import Login from "./pages/login/login";
import OngoingStudents from "./pages/coordinator/Students/OngoingStudents/OngoingStudents";
import MainLayout from "./components/layout/studentLayout";
import { Toaster } from "@/components/ui/toaster";
import AdminLayout from "./components/layout/adminLayout";
import Users from "./pages/admin/users";
import { useState } from "react";

function App() {
  return (
    <Router>
      {/* toster */}
      <Toaster />

      {/* tourtes */}
      <Routes>
        <Route path="/*" element={<StudentRoutes />} />
        <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

// user routes
function StudentRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="student/login" />} />
      <Route path="*" element={<Navigate to="student/login" />} />
      <Route path="student/login" element={<Login />} />

      {/* main layout */}
      <Route element={<MainLayout />}>
        <Route path="student/dashboard" element={<DashboardStudent />} />
        <Route path="student/reviews" element={<Reviews />} />
        <Route path="student/leetcode" element={<LeetCode />} />
        <Route path="student/invoices" element={<Invoice />} />
        <Route path="student/manifest" element={<Manifest />} />
        <Route path="student/leaves" element={<Leave />} />
      </Route>
    </Routes>
  );
}

// counsellor routes
function CoordinatorRoutes() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="login" />} />
      <Route path="*" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />

      <Route path="*" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<DashboardCoordinator />} />
      <Route path="ongoingStudents" element={<OngoingStudents />} />
    </Routes>
  );
}

// admin routes routes
function AdminRoutes() {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  return (
    <Routes>
      <Route path="" element={<Navigate to="login" />} />
      <Route path="*" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />

      {/* main layout */}
      <Route
        element={
          <AdminLayout
            isDrawerOpen={isDrawerOpen}
          />
        }
      >
        <Route path="dashboard" element={<DashboardAdmin />} />
        <Route
          path="users"
          element={
            <Users isDrawerOpen={isDrawerOpen} setDrawerOpen={setDrawerOpen} />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
