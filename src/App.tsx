import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminRoutes from "./routes/admin-routes";
import StudentRoutes from "./routes/student-routes";
import CoordinatorRoutes from "./routes/coordinator-routes";
import InstructorRoutes from "./routes/instructor-routes";
import { SnapshotContextProvider } from "./context/snapshot-context";

// App Component
function App() {
    return (
        <Router>
            {/* Toster */}
            <Toaster />

            {/* Routes */}
            <Routes>
                <Route path="/*" element={<SnapshotContextProvider><StudentRoutes /></SnapshotContextProvider>} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/coordinator/*" element={<CoordinatorRoutes />} />
                <Route path="/instructor/*" element={<InstructorRoutes />} />
            </Routes>
        </Router>
    );
}

export default App;
