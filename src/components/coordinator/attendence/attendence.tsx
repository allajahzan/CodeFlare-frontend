import { useState } from "react";
import { useSelector } from "react-redux";
import { stateType } from "@/redux/store";
import Records from "./records";
import Analysis from "./analysis";

// Attendence list Component
function Attendence() {
    // Redux
    const role = useSelector((state: stateType) => state.role);

    // View state
    const [view, setView] = useState<"records-view" | "analysis-view">(
        role === "student" ? "analysis-view" : "records-view"
    );

    return (
        <>
            {/* Records */}
            {view === "records-view" && <Records view={view} setView={setView} />}
            {view === "analysis-view" && <Analysis view={view} setView={setView} />}
        </>
    );
}

export default Attendence;
