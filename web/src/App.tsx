import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardStudent from "./pages/Student/dashboard/dashboard";
import DashboardCounsellor from "./pages/Counsellor/Dashboard/Dashboard";
import DashboardDevelopr from "./pages/developer/dashboard";
import Reviews from "./pages/Student/reviews/reviews";
import LeetCode from "./pages/Student/Leetcode/Leetcode";
import Invoice from "./pages/Student/Invoice/Invoice";
import Manifest from "./pages/Student/Manifest/Manifest";
import Leave from "./pages/Student/Leave/Leave";
import Login from "./pages/login/login";
import OngoingStudents from "./pages/Counsellor/Students/OngoingStudents/OngoingStudents";
import MainLayout from "./components/layout/studentLayout";
import { Toaster } from "@/components/ui/toaster";
import DeveloperLayout from "./components/layout/developerLayout";
import Admins from "./pages/developer/admins";

function App() {
  return (
    <Router>
      {/* toster */}
      <Toaster />

      {/* tourtes */}
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/counsellor/*" element={<CounsellorRoutes />} />
        <Route path="/developer/*" element={<DeveloperRoutes />} />
      </Routes>
    </Router>
  );
}

// user routes
function UserRoutes() {
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
function CounsellorRoutes() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="login" />} />
      <Route path="*" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />

      <Route path="*" element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<DashboardCounsellor />} />
      <Route path="ongoingStudents" element={<OngoingStudents />} />
    </Routes>
  );
}

// developer routes
function DeveloperRoutes() {
  return (
    <Routes>
      <Route path="" element={<Navigate to="login" />} />
      <Route path="*" element={<Navigate to="login" />} />
      <Route path="login" element={<Login />} />

      {/* main layout */}
      <Route element={<DeveloperLayout />}>
        <Route path="dashboard" element={<DashboardDevelopr />} />
        <Route path="admins" element={<Admins/>}/>
      </Route>
    </Routes>
  );
}

export default App;
