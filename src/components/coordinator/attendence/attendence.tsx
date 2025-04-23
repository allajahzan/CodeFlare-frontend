import { useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Insights from "./insights";
import Lists from "./lists";

// Attendence list Component
function Attendence() {
    // Redux
    const role = useSelector((state: stateType) => state.role);

    // View state
    const [view, setView] = useState<"lists-view" | "insights-view">(
        role === "student" ? "insights-view" : "lists-view"
    );

    return (
        <>
            {/* lists */}
            {view === "lists-view" && <Lists view={view} setView={setView} />}
            {view === "insights-view" && <Insights view={view} setView={setView} />}
        </>
    );
}

export default Attendence;
