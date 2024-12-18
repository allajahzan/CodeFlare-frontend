import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardStudent from "./pages/Student/Dashboard/Dashboard";
import DashboardCounsellor from "./pages/Counsellor/Dashboard/Dashboard";
import Reviews from "./pages/Student/Reviews/Reviews";
import LeetCode from "./pages/Student/Leetcode/Leetcode";
import Invoice from "./pages/Student/Invoice/Invoice";
import Manifest from "./pages/Student/Manifest/Manifest";
import Leave from "./pages/Student/Leave/Leave";
import Login from "./pages/Student/Login/Login";
import OngoingStudents from "./pages/Counsellor/Students/OngoingStudents/OngoingStudents";
import MainLayout from "./components/Layout/StudentLayout";
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <Router>
      {/* toster */}
      <Toaster />

      {/* tourtes */}
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/counsellor/*" element={<CounsellorRoutes />} />
      </Routes>
    </Router>
  );
}

// user routes
function UserRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"student/login"} />} />
        <Route path="*" element={<Navigate to={"student/login"} />} />
        <Route path="student/login" element={<Login />} />

        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route path="student/dashboard" element={<DashboardStudent />} />
          <Route path="student/reviews" element={<Reviews />} />
          <Route path="student/leetcode" element={<LeetCode />} />
          <Route path="student/invoices" element={<Invoice />} />
          <Route path="student/manifest" element={<Manifest />} />
          <Route path="student/leaves" element={<Leave />} />
        </Route>
      </Routes>
    </>
  );
}

// counsellor routes
function CounsellorRoutes() {
  return (
    <>
      <Routes>
        <Route path="" element={<Navigate to={"login"} />} />
        <Route path="*" element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardCounsellor />} />
        <Route path="ongoingStudents" element={<OngoingStudents />} />
      </Routes>
    </>
  );
}

export default App;
