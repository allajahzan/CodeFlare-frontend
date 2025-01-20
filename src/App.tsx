import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminRoutes from "./routes/adminRoutes";
import StudentRoutes from "./routes/studentRoutes";
import CoordinatorRoutes from "./routes/coordinatorRoutes";

function App() {
  return (
    <Router>
      {/* Toster */}
      <Toaster />

      {/* Routes */}
      <Routes>
        <Route path="/*" element={<StudentRoutes />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
