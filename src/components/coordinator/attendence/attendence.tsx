import { useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Analysis from "./analysis";
import Lists from "./lists";

// Attendence list Component
function Attendence() {
    // Redux
    const role = useSelector((state: stateType) => state.role);

    // View state
    const [view, setView] = useState<"lists-view" | "analysis-view">(
        role === "student" ? "analysis-view" : "lists-view"
    );

    return (
        <>
            {/* lists */}
            {view === "lists-view" && <Lists view={view} setView={setView} />}
            {view === "analysis-view" && <Analysis view={view} setView={setView} />}
        </>
    );
}

export default Attendence;
